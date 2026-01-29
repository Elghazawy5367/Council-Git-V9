import { hackerNewsAPI } from './api-client';

export interface HNOpportunity {
  id: string;
  title: string;
  url: string;
  points: number;
  author: string;
  createdAt: string;
  intentScore: number;
  highlights: string[];
}

interface HNApiHit {
  objectID: string;
  title: string;
  comment_text: string;
  points: number;
  author: string;
  created_at: string;
  url: string;
}

interface HNApiResponse {
  hits: HNApiHit[];
}

export async function fetchHNTrends(query: string = 'SaaS OR "show hn" OR "looking for"'): Promise<HNOpportunity[]> {
  try {
    const response = await hackerNewsAPI.get<HNApiResponse>('/search_by_date', {
      query,
      tags: 'story',
      hitsPerPage: 50
    });

    return response.hits.map((hit: HNApiHit) => {
      const title = hit.title || '';
      const content = (hit.comment_text || '').toLowerCase();
      
      // Calculate intent score based on keywords
      let intentScore = 0;
      const keywords = ['alternative', 'competitor', 'problem', 'expensive', 'hard to', 'need a', 'anyone know'];
      keywords.forEach(word => {
        if (title.toLowerCase().includes(word) || content.includes(word)) intentScore += 2;
      });
      
      intentScore += Math.min(5, Math.floor((hit.points || 0) / 20));

      return {
        id: hit.objectID,
        title,
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        points: hit.points || 0,
        author: hit.author,
        createdAt: hit.created_at,
        intentScore: Math.min(10, intentScore),
        highlights: []
      };
    });
  } catch (error) {
    console.error('Failed to fetch HN trends:', error);
    return [];
  }
}
