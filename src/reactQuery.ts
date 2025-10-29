import { QueryClient, DefaultOptions } from "@tanstack/react-query";

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: Infinity, //data stays fresh till I manually invalidate it
    retry: 1, // Retry once if a request fails
    refetchOnWindowFocus: false, // Disable refetch on window focus
  },
};

export const queryClient = new QueryClient({ defaultOptions });
