import { useState, useCallback } from 'react';

export interface ScoutRepository {  
  id: string;  
  name: string;  
  owner: string;  
  description: string;  
  stars: number;  
  forks: number;  
  openIssues: number;  
  language: string;  
  lastUpdate: Date;  
  topics: string[];  
  opportunityScore: number;  
  analysis: {  
    abandonedScore: number;  
    demandScore: number;  
    improvementPotential: string[];  
  };  
}

export interface UseScoutReturn {  
  repositories: ScoutRepository[];  
  loading: boolean;  
  error: Error | null;  
  scan: (query: string) => Promise<void>;  
  filter: (criteria: Partial<ScoutRepository>) => ScoutRepository[];  
}

export const useScout = (): UseScoutReturn => {  
  const [repositories, setRepositories] = useState<ScoutRepository[]>([]);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState<Error | null>(null);

  const scan = useCallback(async (query: string) => {  
    setLoading(true);  
    setError(null);
    console.log('Scanning query:', query);  
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockRepos: ScoutRepository[] = [  
        {  
          id: '1',  
          name: 'awesome-react-hooks',  
          owner: 'developer123',  
          description: 'A collection of useful React hooks',  
          stars: 450,  
          forks: 67,  
          openIssues: 23,  
          language: 'TypeScript',  
          lastUpdate: new Date('2024-01-10'),  
          topics: ['react', 'hooks', 'typescript'],  
          opportunityScore: 85,  
          analysis: {  
            abandonedScore: 60,  
            demandScore: 85,  
            improvementPotential: [  
              'Add more documentation',  
              'Improve test coverage',  
              'Add more examples'  
            ],  
          },  
        },  
      ];

      setRepositories(mockRepos);
      
      // Simulate real-time polling
      const pollInterval = setInterval(() => {
        console.log('Polling for new GitHub events...');
      }, 30000);
      
      return () => clearInterval(pollInterval);  
    } catch (err) {  
      setError(err as Error);  
      console.error('Scout scan failed:', err);  
    } finally {  
      setLoading(false);  
    }  
  }, []);

  const filter = useCallback((criteria: Partial<ScoutRepository>) => {  
    return repositories.filter(repo => {  
      return Object.entries(criteria).every(([key, value]) => {  
        return repo[key as keyof ScoutRepository] === value;  
      });  
    });  
  }, [repositories]);

  return {  
    repositories,  
    loading,  
    error,  
    scan,  
    filter,  
  };  
};