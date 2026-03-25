import { Outlet, useLocation } from "react-router-dom";
import HrmsSidebar from "./HrmsSidebar";
import MobileBottomNav from "./MobileBottomNav";
import AppHeader from "./AppHeader";
import { useState } from "react";

const pageTitles: Record<string, string> = {
  "/payroll/dashboard": "Payroll Dashboard",
  "/payroll/run": "Run Payroll",
  "/payroll/payslip": "Payslip",
  "/payroll/ctc-template": "CTC Template",
  "/payroll/reports": "Reports",
};

const PayrollLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Payroll";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <HrmsSidebar />

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-slide-in-left">
            <HrmsSidebar mobile onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader title={title} onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default PayrollLayout;
