import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeEffects } from "@/components/theme/ThemeEffects";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CMSDashboard from "./pages/admin/CMSDashboard";
import About from "./pages/About";
import Schedule from "./pages/Schedule";
import Speakers from "./pages/Speakers";
import Startups from "./pages/Startups";
import Venue from "./pages/Venue";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import StartupApplication from "./pages/apply/StartupApplication";
import InvestorApplication from "./pages/apply/InvestorApplication";
import SponsorApplication from "./pages/apply/SponsorApplication";
import SpeakerApplication from "./pages/apply/SpeakerApplication";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ThemeEffects />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/cms" element={<CMSDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/agenda" element={<Schedule />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/startups" element={<Startups />} />
              <Route path="/venue" element={<Venue />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/apply/startup" element={<StartupApplication />} />
              <Route path="/apply/investor" element={<InvestorApplication />} />
              <Route path="/apply/sponsor" element={<SponsorApplication />} />
              <Route path="/apply/speaker" element={<SpeakerApplication />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
