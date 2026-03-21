import { useState } from "react";
import { Play, Search, Filter, CheckCircle2, Clock, Users, DollarSign, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const employees = [
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

const stats = [
  { label: "Total Employees", value: "22", icon: Users, color: "text-primary" },
  { label: "Processed", value: "14", icon: CheckCircle2, color: "text-success" },
  { label: "Pending", value: "8", icon: Clock, color: "text-warning" },
  { label: "Total CTC", value: "₹4,16,480", icon: DollarSign, color: "text-primary" },
];

const RunPayroll = () => {
  const [month, setMonth] = useState("june-2024");
  const [department, setDepartment] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === "all" || e.department.toLowerCase() === department;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card flex items-start gap-3">
            <div className={`rounded-lg bg-muted p-2 ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold tracking-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTC Payout Summary */}
      <div className="payroll-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">CTC Payout 2024-2025</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Last Run On: 04-07-2024 by Shreya Mayekar</p>
          </div>
          <Badge variant="outline" className="border-warning text-warning font-medium">
            Waiting for Approval
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-muted-foreground">Processed</span><p className="font-semibold text-lg">4</p></div>
          <div><span className="text-muted-foreground">FnF Employees</span><p className="font-semibold text-lg">22</p></div>
          <div><span className="text-muted-foreground">Pending</span><p className="font-semibold text-lg">2</p></div>
          <div><span className="text-muted-foreground">On Hold</span><p className="font-semibold text-lg">0</p></div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="payroll-card p-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full sm:w-40">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="june-2024">June 2024</SelectItem>
                <SelectItem value="may-2024">May 2024</SelectItem>
                <SelectItem value="april-2024">April 2024</SelectItem>
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
          </div>
          <Button className="w-full md:w-auto gap-2 shadow-sm active:scale-[0.97] transition-transform">
            <Play className="h-4 w-4" />
            Run Payroll
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
              {filtered.map((emp, i) => (
                <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors" style={{ animationDelay: `${i * 40}ms` }}>
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
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RunPayroll;
