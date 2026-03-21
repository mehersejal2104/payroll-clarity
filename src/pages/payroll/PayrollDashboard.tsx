import { useState } from "react";
import { Users, CheckCircle2, Clock, DollarSign, CalendarDays, Play, FileText, LayoutTemplate, ArrowRight, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const summaryCards = [
  { label: "Total Employees", value: "248", icon: Users, trend: "+12 this month", color: "text-primary", bg: "bg-primary/10" },
  { label: "Payroll Processed", value: "186", icon: CheckCircle2, trend: "75% complete", color: "text-success", bg: "bg-success/10" },
  { label: "Pending Payroll", value: "62", icon: Clock, trend: "Action needed", color: "text-warning", bg: "bg-warning/10" },
  { label: "Total Salary Paid", value: "₹48,72,400", icon: DollarSign, trend: "Mar 2026", color: "text-primary", bg: "bg-primary/10" },
];

const recentActivities = [
  { action: "Payroll processed for Engineering dept.", time: "2 hours ago", type: "success" as const },
  { action: "Payslips generated for 45 employees", time: "5 hours ago", type: "success" as const },
  { action: "CTC Template 'Management CTC' updated", time: "1 day ago", type: "info" as const },
  { action: "Payroll pending approval for Finance dept.", time: "1 day ago", type: "warning" as const },
  { action: "New employee added to March payroll", time: "2 days ago", type: "info" as const },
];

const alerts = [
  { message: "62 employees pending payroll processing for March 2026", severity: "warning" as const },
  { message: "Payroll approval pending from Finance Manager", severity: "warning" as const },
  { message: "TDS filing deadline approaching — March 31, 2026", severity: "destructive" as const },
];

const PayrollDashboard = () => {
  const [month, setMonth] = useState("march-2026");
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Payroll Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your organization's payroll status</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full sm:w-44">
              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="march-2026">March 2026</SelectItem>
              <SelectItem value="february-2026">February 2026</SelectItem>
              <SelectItem value="january-2026">January 2026</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/payroll/run")} className="flex-1 sm:flex-none gap-2 active:scale-[0.97] transition-transform">
              <Play className="h-4 w-4" />
              Run Payroll
            </Button>
            <Button variant="outline" onClick={() => navigate("/payroll/payslip")} className="flex-1 sm:flex-none gap-2 active:scale-[0.97] transition-transform">
              <FileText className="h-4 w-4" />
              Generate Payslip
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="payroll-card p-4 md:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${card.bg} p-2.5`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
              <p className="text-xl md:text-2xl font-bold tracking-tight tabular-nums mt-0.5">{card.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{card.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Payroll Date Card */}
      <div className="payroll-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Upcoming Payroll Date</p>
            <p className="text-2xl font-bold text-primary tabular-nums">March 31, 2026</p>
            <p className="text-xs text-muted-foreground mt-0.5">10 days remaining</p>
          </div>
        </div>
        <Button onClick={() => navigate("/payroll/run")} className="gap-2 active:scale-[0.97] transition-transform w-full sm:w-auto">
          Process Now <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Middle Section: Status + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Payroll Status Overview */}
        <div className="lg:col-span-3 payroll-card p-5 space-y-4">
          <h2 className="section-title">Payroll Status Overview</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Processed</span>
                <span className="font-semibold tabular-nums">186 / 248</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-success transition-all duration-700" style={{ width: "75%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Pending Approval</span>
                <span className="font-semibold tabular-nums">42 / 248</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-warning transition-all duration-700" style={{ width: "17%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">On Hold</span>
                <span className="font-semibold tabular-nums">20 / 248</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-destructive transition-all duration-700" style={{ width: "8%" }} />
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Department Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { dept: "Engineering", count: 68, processed: 52 },
                { dept: "Marketing", count: 34, processed: 28 },
                { dept: "Finance", count: 22, processed: 18 },
                { dept: "HR", count: 18, processed: 18 },
                { dept: "Operations", count: 56, processed: 40 },
                { dept: "Sales", count: 50, processed: 30 },
              ].map((d) => (
                <div key={d.dept} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">{d.dept}</p>
                  <p className="text-sm font-semibold mt-0.5">{d.processed}/{d.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-2 payroll-card p-5 space-y-4">
          <h2 className="section-title flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Alerts & Notifications
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`rounded-lg border p-3 text-sm ${
                alert.severity === "destructive" 
                  ? "border-destructive/30 bg-destructive/5 text-destructive" 
                  : "border-warning/30 bg-warning/5 text-warning"
              }`}>
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="payroll-card p-5 space-y-4">
        <h2 className="section-title">Recent Payroll Activities</h2>
        <div className="divide-y">
          {recentActivities.map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full shrink-0 ${
                  activity.type === "success" ? "bg-success" 
                  : activity.type === "warning" ? "bg-warning" 
                  : "bg-primary"
                }`} />
                <span className="text-sm">{activity.action}</span>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Run Payroll", desc: "Process employee salaries", icon: Play, path: "/payroll/run" },
          { label: "View Payslips", desc: "Generate & download payslips", icon: FileText, path: "/payroll/payslip" },
          { label: "Manage Templates", desc: "CTC salary templates", icon: LayoutTemplate, path: "/payroll/ctc-template" },
        ].map((shortcut) => (
          <button
            key={shortcut.label}
            onClick={() => navigate(shortcut.path)}
            className="payroll-card p-5 flex items-center gap-4 text-left group active:scale-[0.98] transition-transform"
          >
            <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/15 transition-colors">
              <shortcut.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{shortcut.label}</p>
              <p className="text-xs text-muted-foreground">{shortcut.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PayrollDashboard;
