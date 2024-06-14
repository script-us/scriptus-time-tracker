import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactNode } from "react";

type PropTypes = {
  children: ReactNode;
};

const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      gcTime: CACHE_TIME,
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  },
});

const getItemAsync = async (key: string) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const persister = createAsyncStoragePersister({
  storage: {
    getItem: getItemAsync,
    setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    removeItem: (key) => localStorage.removeItem(key),
  },
  throttleTime: 3000,
});

const QueryClientProvider = ({ children }: PropTypes) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        buster: "",
        persister: persister,
        maxAge: CACHE_TIME,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};

export default QueryClientProvider;
