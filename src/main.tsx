
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppContext";
import Router from '../router';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
