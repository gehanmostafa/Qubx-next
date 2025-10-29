"use client";

import { queryClient } from "@/reactQuery";
import { QueryClientProvider } from "@tanstack/react-query";

const ReactQueryProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
