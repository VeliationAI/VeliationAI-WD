
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Interview from "./pages/Interview";
import ETLDesigner from "./pages/ETLDesigner";
import Subscription from "./pages/Subscription";
import JobSearch from "./pages/JobSearch";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserProfile from "./pages/user/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/auth/signin" element={<SignIn />} />
              
              {/* Protected routes */}
              <Route path="/interview" element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              } />
              <Route path="/etl-designer" element={
                <ProtectedRoute>
                  <ETLDesigner />
                </ProtectedRoute>
              } />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/job-search" element={
                <ProtectedRoute>
                  <JobSearch />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={<Resources />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
