import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import TestDetail from "@/pages/TestDetail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl w-full">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/tests/:id" component={TestDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
