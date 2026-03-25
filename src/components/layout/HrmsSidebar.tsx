import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Users, UserPlus, Shirt, UserMinus, FileText,
  FolderOpen, Clock, ClipboardCheck, ShieldCheck, Calendar, CalendarDays,
  Palmtree, DollarSign, Play, FileText as FileTextAlt, CreditCard, LayoutTemplate, BarChart3,
  MessageSquare, Settings, Building, UserCog, Workflow, CalendarCog,
  ChevronLeft, ChevronRight, ChevronDown, LogOut, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MenuItem {
  title: string;
  path?: string;
  icon: React.ElementType;
  children?: { title: string; path: string; icon: React.ElementType }[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", path: "/payroll/dashboard", icon: LayoutDashboard },
  { title: "Organization", path: "/organization", icon: Building2 },
  {
    title: "Employees", icon: Users, children: [
      { title: "Employee Directory", path: "/employees/directory", icon: Users },
      { title: "Site Employee", path: "/employees/site", icon: Building },
      { title: "Onboarding", path: "/employees/onboarding", icon: UserPlus },
      { title: "Uniform Applications", path: "/employees/uniform", icon: Shirt },
      { title: "Separation Request", path: "/employees/separation", icon: UserMinus },
      { title: "Generated Letter", path: "/employees/letters", icon: FileText },
    ],
  },
  { title: "Document & Letters", path: "/documents", icon: FolderOpen },
  {
    title: "Attendance", icon: Clock, children: [
      { title: "Attendance Records", path: "/attendance/records", icon: ClipboardCheck },
      { title: "Regularization Requests", path: "/attendance/regularization", icon: Clock },
      { title: "Attendance Audit", path: "/attendance/audit", icon: ShieldCheck },
    ],
  },
  {
    title: "Roster", icon: Calendar, children: [
      { title: "Roster Records", path: "/roster/records", icon: Calendar },
      { title: "Shift", path: "/roster/shift", icon: CalendarDays },
    ],
  },
  {
    title: "Leave", icon: Palmtree, children: [
      { title: "Leave Application", path: "/leave/application", icon: Palmtree },
      { title: "Leave Balance", path: "/leave/balance", icon: CalendarDays },
      { title: "Rollover", path: "/leave/rollover", icon: Clock },
    ],
  },
  {
    title: "Payroll", icon: DollarSign, children: [
      { title: "Run Payroll", path: "/payroll/run", icon: Play },
      { title: "Payslip", path: "/payroll/payslip", icon: FileTextAlt },
      { title: "CTC Template", path: "/payroll/ctc-template", icon: LayoutTemplate },
    ],
  },
  { title: "Communication", path: "/communication", icon: MessageSquare },
  { title: "Holidays", path: "/holidays", icon: Palmtree },
  {
    title: "Settings", icon: Settings, children: [
      { title: "Organization Setting", path: "/settings/organization", icon: Building },
      { title: "User Setting", path: "/settings/user", icon: UserCog },
      { title: "HR Workflow Setting", path: "/settings/workflow", icon: Workflow },
      { title: "Attendance Setting", path: "/settings/attendance", icon: CalendarCog },
      { title: "Leave Setting", path: "/settings/leave", icon: Palmtree },
      { title: "Payroll Setting", path: "/settings/payroll", icon: DollarSign },
    ],
  },
];

interface HrmsSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const HrmsSidebar = ({ mobile, onClose }: HrmsSidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    if (mobile) return false;
    const saved = localStorage.getItem("hrms-sidebar-collapsed");
    return saved === "true";
  });
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Auto-expand parent menu of active route
  useEffect(() => {
    const active = menuItems.find(
      (item) => item.children?.some((child) => location.pathname.startsWith(child.path))
    );
    if (active && !openMenus.includes(active.title)) {
      setOpenMenus((prev) => [...prev, active.title]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!mobile) {
      localStorage.setItem("hrms-sidebar-collapsed", String(collapsed));
    }
  }, [collapsed, mobile]);

  const toggleMenu = (title: string) => {
    if (collapsed && !mobile) {
      setCollapsed(false);
      setOpenMenus([title]);
      return;
    }
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isChildActive = (item: MenuItem) =>
    item.children?.some((child) => location.pathname.startsWith(child.path));

  const sidebarWidth = collapsed && !mobile ? "w-[68px]" : "w-64";

  const renderNavItem = (item: MenuItem) => {
    if (item.children) {
      const isOpen = openMenus.includes(item.title);
      const active = isChildActive(item);

      if (collapsed && !mobile) {
        return (
          <Tooltip key={item.title} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => toggleMenu(item.title)}
                className={cn(
                  "flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-200",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white/90"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.title}
            </TooltipContent>
          </Tooltip>
        );
      }

      return (
        <div key={item.title}>
          <button
            onClick={() => toggleMenu(item.title)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
              active
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white/90"
            )}
          >
            <span className="flex items-center gap-3">
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{item.title}</span>
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-transform duration-300",
                isOpen && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="ml-[15px] mt-0.5 space-y-0.5 border-l border-white/10 pl-3 py-1">
              {item.children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-all duration-200",
                      isActive
                        ? "bg-white/20 text-white font-medium shadow-sm"
                        : "text-white/50 hover:bg-white/8 hover:text-white/80"
                    )
                  }
                >
                  <child.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{child.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Single item
    if (collapsed && !mobile) {
      return (
        <Tooltip key={item.title} delayDuration={0}>
          <TooltipTrigger asChild>
            <NavLink
              to={item.path!}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-center rounded-lg p-2.5 transition-all duration-200",
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/60 hover:bg-white/10 hover:text-white/90"
                )
              }
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <NavLink
        key={item.title}
        to={item.path!}
        onClick={onClose}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
            isActive
              ? "bg-white/15 text-white shadow-sm"
              : "text-white/60 hover:bg-white/10 hover:text-white/90"
          )
        }
      >
        <item.icon className="h-[18px] w-[18px] shrink-0" />
        <span className="truncate">{item.title}</span>
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-[hsl(222,55%,18%)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        sidebarWidth,
        mobile ? "h-full" : "hidden md:flex shrink-0 min-h-screen sticky top-0"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-white/10 px-3 shrink-0",
          collapsed && !mobile ? "justify-center" : "justify-between"
        )}
      >
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white text-xs font-bold">
              HR
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">HRMS Pro</span>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 hover:scale-105 shadow-sm",
              collapsed && "mx-auto"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-0.5 scrollbar-thin">
        {menuItems.map(renderNavItem)}
      </nav>

      {/* User section */}
      <div className={cn(
        "border-t border-white/10 p-3 shrink-0",
        collapsed && !mobile ? "flex justify-center" : ""
      )}>
        {collapsed && !mobile ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white text-xs font-semibold cursor-pointer hover:bg-white/25 transition-colors">
                SM
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="font-medium">Suresh M.</p>
              <p className="text-xs text-muted-foreground">HR Admin</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white text-xs font-semibold shrink-0">
              SM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Suresh M.</p>
              <p className="text-xs text-white/50 truncate">HR Admin</p>
            </div>
            <button className="p-1.5 rounded-md text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default HrmsSidebar;
