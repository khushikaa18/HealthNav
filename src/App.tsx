import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocationProvider } from "@/contexts/LocationContext";
import { TopNav, Footer } from "@/components/Layout";
import { CopyReviewWidget } from "@/components/CopyReviewWidget";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Chat from "./pages/Chat";
import Results from "./pages/Results";
import Breakdown from "./pages/Breakdown";
import Compare from "./pages/Compare";
import Lenders from "./pages/Lenders";
import ResponsibleAI from "./pages/ResponsibleAI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <TopNav />
    <main className="flex-1">{children}</main>
    <Footer />
    <CopyReviewWidget />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Shell>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/results" element={<Results />} />
              <Route path="/breakdown/:id" element={<Breakdown />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/lenders" element={<Lenders />} />
              <Route path="/responsible-ai" element={<ResponsibleAI />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Shell>
        </BrowserRouter>
      </TooltipProvider>
    </LocationProvider>
  </QueryClientProvider>
);

export default App;
