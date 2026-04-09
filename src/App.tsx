import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import Colchoes from "./pages/Colchoes.tsx";
import Checkout from "./pages/Checkout.tsx";
import Painel from "./pages/Painel.tsx";
import Maquina from "./pages/Maquina.tsx";
import Pneus from "./pages/Pneus.tsx";
import AroListing from "./pages/AroListing.tsx";
import PneuDetalhe from "./pages/PneuDetalhe.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();
const UTMIFY_PIXEL_ID = "6900c23507be5c15f8571297";

const App = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    (window as Window & { pixelId?: string }).pixelId = UTMIFY_PIXEL_ID;

    if (document.querySelector('script[data-utmify-pixel="true"]')) return;

    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("defer", "");
    script.setAttribute("data-utmify-pixel", "true");
    script.src = "https://cdn.utmify.com.br/scripts/pixel/pixel.js";
    document.head.appendChild(script);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/colchoes" element={<Colchoes />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/painel" element={<Painel />} />
            <Route path="/maquina" element={<Maquina />} />
            <Route path="/pneus" element={<Pneus />} />
            <Route path="/pneus/:aro" element={<AroListing />} />
            <Route path="/pneus/:aro/:slug" element={<PneuDetalhe />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
