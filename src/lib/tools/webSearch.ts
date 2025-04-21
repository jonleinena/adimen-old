import { tool } from "ai";
import { z } from "zod";

export const webSearchTool = tool({
  description: 'Search the web for any general information or current events',
  parameters: z.object({
    query: z.string().describe('The search query')
  }),
  execute: async ({ query }) => {
    try {
      const API_KEY = process.env.TAVILY_API_KEY;
      if (!API_KEY) {
        throw new Error('TAVILY_API_KEY is not configured');
      }

      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          query: query,
          include_answer: true,
          search_depth: "basic"
        })
      });
      
      if (!response.ok) {
        throw new Error(`Search API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        results: data.results
      };
    } catch (error) {
      console.error('Error performing web search:', error);
      return {
        success: false,
        error: 'Failed to perform web search'
      };
    }
  }
}); 