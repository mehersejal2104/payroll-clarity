import { useState } from "react";
import { Download, Share2, Search, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const employeeList = [
  { id: "178", name: "John Doe" },
  { id: "353", name: "Ramesh Kumar" },
  { id: "661", name: "Priya Sharma" },
  { id: "663", name: "Rikkjha Jha" },
  { id: "964", name: "Amit Rathod" },
  { id: "1005", name: "Sagar Singh" },
  { id: "1006", name: "Neha Patel" },
  { id: "1107", name: "Zyx Kumar" },
  { id: "1128", name: "Baldev Yadav" },
  { id: "1194", name: "Kiran Deshmukh" },
];

const payslipData = {
  employee: "John Doe",
  employeeId: "178",
  designation: "Software Engineer",
  department: "Engineering",
  month: "March 2026",
  earnings: [
    { label: "Basic Salary", amount: "₹18,000" },
    { label: "HRA", amount: "₹7,200" },
    { label: "Conveyance", amount: "₹1,600" },
    { label: "Medical Allowance", amount: "₹1,250" },
    { label: "Special Allowance", amount: "₹6,950" },
  ],
  deductions: [
    { label: "PF (Employee)", amount: "₹2,160" },
    { label: "Professional Tax", amount: "₹200" },
    { label: "ESI (Employee)", amount: "₹263" },
    { label: "TDS", amount: "₹1,500" },
  ],
  totalEarnings: "₹35,000",
  totalDeductions: "₹4,123",
  netSalary: "₹30,877",
};

const Payslip = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("178");
  const [month, setMonth] = useState("march-2026");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="payroll-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by employee name" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="march-2026">March 2026</SelectItem>
              <SelectItem value="february-2026">February 2026</SelectItem>
              <SelectItem value="january-2026">January 2026</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="generated">Generated</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full sm:w-auto gap-2 active:scale-[0.97] transition-transform">
            <Printer className="h-4 w-4" />
            Generate Bulk Pay
          </Button>
        </div>
      </div>

      {/* Employee List + Payslip Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Employee List */}
        <div className="lg:col-span-2 payroll-card overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="section-title flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Employees
            </h3>
          </div>
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {employeeList.map((emp) => (
              <button
                key={emp.id}
                onClick={() => setSelectedEmployee(emp.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 active:scale-[0.98] ${
                  selectedEmployee === emp.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {emp.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">ID: {emp.id}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payslip Preview */}
        <div className="lg:col-span-3 payroll-card p-5 md:p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="page-title">{payslipData.employee}</h2>
              <p className="text-sm text-muted-foreground">{payslipData.designation} · {payslipData.department}</p>
              <p className="text-xs text-muted-foreground mt-1">Employee ID: {payslipData.employeeId} · {payslipData.month}</p>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success border-0">Generated</Badge>
          </div>

          <Separator />

          {/* Earnings */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Earnings</h3>
            <div className="space-y-2">
              {payslipData.earnings.map((e) => (
                <div key={e.label} className="flex justify-between text-sm">
                  <span>{e.label}</span>
                  <span className="font-medium tabular-nums">{e.amount}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span>Total Earnings</span>
                <span className="tabular-nums text-success">{payslipData.totalEarnings}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Deductions</h3>
            <div className="space-y-2">
              {payslipData.deductions.map((d) => (
                <div key={d.label} className="flex justify-between text-sm">
                  <span>{d.label}</span>
                  <span className="font-medium tabular-nums">{d.amount}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span>Total Deductions</span>
                <span className="tabular-nums text-destructive">{payslipData.totalDeductions}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Net Salary */}
          <div className="flex items-center justify-between rounded-xl bg-primary/5 p-4">
            <span className="text-base font-semibold">Net Salary</span>
            <span className="text-2xl font-bold tabular-nums text-primary">{payslipData.netSalary}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 gap-2 active:scale-[0.97] transition-transform">
              <Download className="h-4 w-4" />
              Download Payslip
            </Button>
            <Button variant="outline" className="flex-1 gap-2 active:scale-[0.97] transition-transform">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
