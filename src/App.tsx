import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PayrollLayout from "@/components/layout/PayrollLayout";
import PayrollDashboard from "@/pages/payroll/PayrollDashboard";
import RunPayroll from "@/pages/payroll/RunPayroll";
import Payslip from "@/pages/payroll/Payslip";
import CTCTemplate from "@/pages/payroll/CTCTemplate";
import Reports from "@/pages/payroll/Reports";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/payroll" element={<PayrollLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PayrollDashboard />} />
              <Route path="run" element={<RunPayroll />} />
              <Route path="payslip" element={<Payslip />} />
              <Route path="ctc-template" element={<CTCTemplate />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
