import { GoogleGenAI } from "@google/genai";
import { NewsItem, Source } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to extract JSON from markdown code blocks
const extractJson = (text: string): any => {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonRegex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse JSON from block", e);
    }
  }
  // Fallback: try parsing the whole text if it looks like JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON directly", e);
    return null;
  }
};

export const fetchBreakingNews = async (topic: string): Promise<NewsItem[]> => {
  try {
    const prompt = `
      你是一个专业的实时新闻聚合助手。
      请利用 Google Search（谷歌搜索）查找关于 "${topic}" 的最新、最可靠、最真实的新闻。
      
      要求：
      1. 优先选择权威信源（主流新闻媒体、官方博客、知名科技期刊、证券交易所公告、权威财经网站）。
      2. 时间范围：过去 24-48 小时。如果是非常小众的话题，可放宽至 1 周，但需在时间戳中标明。
      3. 返回一个包裹在 \`\`\`json 代码块中的有效 JSON 数组。
      4. 每个新闻条目的 JSON 结构必须如下：
         {
           "id": "unique_string_id",
           "title": "事实性强且吸引人的标题（中文，最多 20 字）",
           "summary": "客观简练的摘要（中文，最多 50 字）",
           "fullContent": "详细报道（约 200 字，中文）。如果搜索结果中有具体数据（如财报营收、净利润、增长率）、引用或日期，请务必包含。使用 Markdown 格式。",
           "timestamp": "相对时间（例如：'2小时前' 或 '刚刚'）",
           "category": "科技/商业/财经/军事/政治/生物/国际/科学",
           "impactLevel": "HIGH" (如果是重大突发新闻) 或 "MEDIUM" 或 "LOW"
         }
      5. 语言：简体中文。
      6. 语气：新闻专业主义，客观公正。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) return [];

    const parsedData = extractJson(text);
    
    // Extract sources from grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let globalSources: Source[] = [];
    
    if (groundingChunks) {
       globalSources = groundingChunks
        .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri
        }));
    }

    // Remove duplicates based on URI
    globalSources = globalSources.filter((source, index, self) =>
      index === self.findIndex((t) => (
        t.uri === source.uri
      ))
    );

    if (Array.isArray(parsedData)) {
      // In a real production app, we would map specific grounding chunks to specific sentences.
      // For this demo, we attach the relevant search context (up to 5 top sources) to the items
      // so the user can verify the information.
      const topSources = globalSources.slice(0, 5);
      
      return parsedData.map((item: any) => ({
        ...item,
        sources: topSources 
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};