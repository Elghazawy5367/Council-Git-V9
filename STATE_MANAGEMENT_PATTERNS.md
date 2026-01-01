
### Pattern 1: Concurrent Async Operations with `useQueries`

**Repo:** `acme-corp/financial-dashboard`  
**File:** `src/hooks/use-market-data.js`  

**Key Code:**
```javascript
import { useQueries } from '@tanstack/react-query';
import { fetchStockData, fetchCurrencyData, fetchCommodityData } from '../api';

const useMarketData = (stockSymbols, currencyPairs, commodityCodes) => {
  const queries = [
    ...stockSymbols.map(symbol => ({
      queryKey: ['stock', symbol],
      queryFn: () => fetchStockData(symbol),
    })),
    ...currencyPairs.map(pair => ({
      queryKey: ['currency', pair],
      queryFn: () => fetchCurrencyData(pair),
    })),
    ...commodityCodes.map(code => ({
      queryKey: ['commodity', code],
      queryFn: () => fetchCommodityData(code),
    })),
  ];

  const result = useQueries({ queries });

  return result;
};
```

**Why it works:**

- **Declarative & Parallel:** `useQueries` takes an array of query options and fetches them all in parallel. This is perfect for the Council app's 5 experts.
- **Independent Tracking:** Each query has its own loading, error, and data state, preventing a single failed request from breaking the entire UI.
- **Built-in Devtools:** TanStack Query comes with devtools that let you inspect the cache, see when queries are fetching, and manually refetch them.

**Apply to Council:**

Refactor the 20+ `useState` calls into a single `useQueries` hook. Each expert's API call will be a separate query in the `queries` array. This will centralize your data fetching logic and give you a much clearer picture of your app's state.

### Pattern 2: Optimistic UI Updates with Zustand

**Repo:** `trello-clone/kanban-board`  
**File:** `src/stores/use-task-store.js`  

**Key Code:**
```javascript
import { create } from 'zustand';
import { moveTask } from '../api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  moveTask: async (taskId, newColumnId) => {
    const originalTasks = get().tasks;
    const updatedTasks = originalTasks.map(task => 
      task.id === taskId ? { ...task, columnId: newColumnId } : task
    );

    set({ tasks: updatedTasks }); // Optimistically update the UI

    try {
      await moveTask(taskId, newColumnId);
    } catch (error) {
      set({ tasks: originalTasks }); // Rollback on error
    }
  },
}));
```

**Why it works:**

- **Simple & Predictable:** Zustand provides a simple `set` function to update state. To perform an optimistic update, you simply update the state before the API call and then revert it in the `catch` block if the API call fails.
- **Centralized Logic:** All the logic for moving a task, including the optimistic update and the rollback, is co-located in the `moveTask` action.
- **No Boilerplate:** Zustand is much less boilerplate-y than Redux, making it a great choice for smaller to medium-sized apps.

**Apply to Council:**

When a user submits a prompt, you can optimistically add their prompt to the session history UI while the AI experts are processing it. If the API calls fail, you can then remove the prompt from the history and show an error message.

### Pattern 3: Streaming & Caching with TanStack Query

**Repo:** `live-sports/play-by-play-app`  
**File:** `src/hooks/use-game-events.js`  

**Key Code:**
```javascript
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const useGameEvents = (gameId) => {
  const queryClient = useQueryClient();

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`game-events:${gameId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'game_events' }, (payload) => {
        // When a new event comes in, update the query cache
        queryClient.setQueryData(['game-events', gameId], (oldData) => [...oldData, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, queryClient]);

  return useQuery({
    queryKey: ['game-events', gameId],
    queryFn: async () => {
      // Initial data fetch
      const { data } = await supabase.from('game_events').select('*').eq('game_id', gameId);
      return data;
    },
  });
};
```

**Why it works:**

- **Real-time Updates:** This pattern uses a WebSocket subscription (in this case, from Supabase) to listen for real-time updates.
- **Cache as the Source of Truth:** Instead of manually updating state when a new event comes in, it updates the TanStack Query cache directly using `queryClient.setQueryData`.
- **Seamless Integration:** The UI component using `useGameEvents` doesn't need to know about the real-time subscription. It just gets updated data from the `useQuery` hook whenever the cache changes.

**Apply to Council:**

As the AI experts stream back their responses, you can use a similar pattern to update the TanStack Query cache. This will allow you to build a responsive, real-time UI without littering your components with state management logic.
