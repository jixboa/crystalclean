"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Create a new instance of QueryClient
export function Provider({ children }) {
  const [queryClient] = React.useState(() => new QueryClient());

  // Export the React Query provider
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
