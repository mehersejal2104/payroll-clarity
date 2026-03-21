import { NavLink, useLocation } from "react-router-dom";
import { Play, FileText, LayoutTemplate, ChevronDown, DollarSign, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const payrollItems = [
  { title: "Dashboard", path: "/payroll/dashboard", icon: LayoutDashboard },
  { title: "Run Payroll", path: "/payroll/run", icon: Play },
  { title: "Payslip", path: "/payroll/payslip", icon: FileText },
  { title: "CTC Template", path: "/payroll/ctc-template", icon: LayoutTemplate },
];

interface PayrollSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const PayrollSidebar = ({ mobile, onClose }: PayrollSidebarProps) => {
  const location = useLocation();
  const [payrollOpen, setPayrollOpen] = useState(true);

  const isPayrollActive = location.pathname.startsWith("/payroll");

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card",
        mobile ? "h-full w-72" : "hidden md:flex w-60 shrink-0 min-h-screen"
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 border-b">
        <span className="text-base font-bold tracking-tight">HRMS</span>
        {mobile && (
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <button
          onClick={() => setPayrollOpen(!payrollOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isPayrollActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
          )}
        >
          <span className="flex items-center gap-2.5">
            <DollarSign className="h-4 w-4" />
            Payroll
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              payrollOpen && "rotate-180"
            )}
          />
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            payrollOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="ml-4 mt-1 space-y-0.5 border-l pl-3">
            {payrollItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.title}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default PayrollSidebar;
