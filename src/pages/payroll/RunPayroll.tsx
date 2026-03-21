import { useState, useCallback } from "react";
import { Play, Search, Filter, CheckCircle2, Clock, Users, DollarSign, CalendarDays, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  department: string;
  gross: string;
  status: "Processed" | "Pending";
}

const initialEmployees: Employee[] = [
  { id: "178", name: "John Doe", department: "Engineering", gross: "₹35,000", status: "Processed" },
  { id: "353", name: "Ramesh Kumar", department: "Marketing", gross: "₹28,500", status: "Pending" },
  { id: "661", name: "Priya Sharma", department: "HR", gross: "₹32,000", status: "Processed" },
  { id: "663", name: "Rikkjha Jha", department: "Finance", gross: "₹40,200", status: "Pending" },
  { id: "964", name: "Amit Rathod", department: "Engineering", gross: "₹38,750", status: "Processed" },
  { id: "1005", name: "Sagar Singh", department: "Operations", gross: "₹26,000", status: "Processed" },
  { id: "1006", name: "Neha Patel", department: "Marketing", gross: "₹30,500", status: "Pending" },
  { id: "1107", name: "Zyx Kumar", department: "Engineering", gross: "₹45,000", status: "Processed" },
  { id: "1128", name: "Baldev Yadav", department: "Finance", gross: "₹27,800", status: "Pending" },
  { id: "1194", name: "Kiran Deshmukh", department: "HR", gross: "₹33,200", status: "Processed" },
];

const RunPayroll = () => {
  const [month, setMonth] = useState("march-2026");
  const [department, setDepartment] = useState("all");
  const [employeeType, setEmployeeType] = useState("all");
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [processing, setProcessing] = useState<string | null>(null); // individual employee id
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const { toast } = useToast();

  const processedCount = employees.filter(e => e.status === "Processed").length;
  const pendingCount = employees.filter(e => e.status === "Pending").length;

  const stats = [
    { label: "Total Employees", value: employees.length.toString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Processed", value: processedCount.toString(), icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Pending", value: pendingCount.toString(), icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "Total CTC", value: "₹4,16,480", icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
  ];

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === "all" || e.department.toLowerCase() === department;
    return matchSearch && matchDept;
  });

  const processEmployee = useCallback((id: string) => {
    setProcessing(id);
    setTimeout(() => {
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: "Processed" as const } : e));
      setProcessing(null);
      toast({ title: "Employee Processed", description: `Payroll processed successfully.` });
    }, 1200);
  }, [toast]);

  const runBulkPayroll = useCallback(() => {
    setConfirmDialog(false);
    setBulkProcessing(true);
    setTimeout(() => {
      setEmployees(prev => prev.map(e => ({ ...e, status: "Processed" as const })));
      setBulkProcessing(false);
      toast({ title: "Payroll Complete", description: `All employees have been processed for ${month.replace("-", " ")}.` });
    }, 2000);
  }, [month, toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card flex items-start gap-3">
            <div className={`rounded-lg ${s.bg} p-2.5`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className="text-xl font-bold tracking-tight tabular-nums">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTC Payout Summary */}
      <div className="payroll-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">CTC Payout 2025-2026</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Last Run On: 04-03-2026 by Shreya Mayekar</p>
          </div>
          <Badge variant="outline" className="border-warning text-warning font-medium">
            Waiting for Approval
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-muted-foreground">Processed</span><p className="font-semibold text-lg tabular-nums">{processedCount}</p></div>
          <div><span className="text-muted-foreground">FnF Employees</span><p className="font-semibold text-lg tabular-nums">22</p></div>
          <div><span className="text-muted-foreground">Pending</span><p className="font-semibold text-lg tabular-nums">{pendingCount}</p></div>
          <div><span className="text-muted-foreground">On Hold</span><p className="font-semibold text-lg tabular-nums">0</p></div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="payroll-card p-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search employee..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full sm:w-40">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="march-2026">March 2026</SelectItem>
                <SelectItem value="february-2026">February 2026</SelectItem>
                <SelectItem value="january-2026">January 2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
            <Select value={employeeType} onValueChange={setEmployeeType}>
              <SelectTrigger className="w-full sm:w-40">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={() => setConfirmDialog(true)} 
            disabled={bulkProcessing || pendingCount === 0}
            className="w-full md:w-auto gap-2 shadow-sm active:scale-[0.97] transition-transform"
          >
            {bulkProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {bulkProcessing ? "Processing..." : "Run Payroll"}
          </Button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="payroll-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Employee ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Employee Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Department</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Gross</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No employees found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{emp.id}</td>
                    <td className="px-4 py-3 font-medium">{emp.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{emp.department}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{emp.gross}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="secondary"
                        className={
                          emp.status === "Processed"
                            ? "bg-success/10 text-success border-0"
                            : "bg-warning/10 text-warning border-0"
                        }
                      >
                        {emp.status === "Processed" && <Check className="h-3 w-3 mr-1" />}
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {emp.status === "Pending" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1.5 active:scale-[0.97] transition-transform"
                          disabled={processing === emp.id}
                          onClick={() => processEmployee(emp.id)}
                        >
                          {processing === emp.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                          {processing === emp.id ? "Processing" : "Process"}
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-xs">View</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Run Payroll</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will process payroll for <span className="font-semibold text-foreground">{pendingCount} pending employees</span> for {month.replace("-", " ")}. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button onClick={runBulkPayroll} className="gap-2">
              <Play className="h-4 w-4" /> Confirm & Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RunPayroll;
