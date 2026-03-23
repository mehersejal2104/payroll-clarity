import { useState, useMemo } from "react";
import {
  Download, Search, Printer, Eye, Loader2, Users, FileText,
  Mail, MessageSquare, ChevronDown, Plus, X, Check, MoreHorizontal,
  IndianRupee, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose
} from "@/components/ui/sheet";

// ─── Types ───
interface PayslipRecord {
  id: string;
  name: string;
  department: string;
  month: string;
  netSalary: string;
  netSalaryNum: number;
  status: "Published" | "Pending";
  avatar: string;
}

// ─── Mock Data ───
const initialPayslips: PayslipRecord[] = [
  { id: "178", name: "John Doe", department: "Engineering", month: "March 2026", netSalary: "₹30,877", netSalaryNum: 30877, status: "Published", avatar: "JD" },
  { id: "353", name: "Ramesh Kumar", department: "Marketing", month: "March 2026", netSalary: "₹24,200", netSalaryNum: 24200, status: "Published", avatar: "RK" },
  { id: "661", name: "Priya Sharma", department: "Design", month: "March 2026", netSalary: "₹27,500", netSalaryNum: 27500, status: "Pending", avatar: "PS" },
  { id: "663", name: "Rikkjha Jha", department: "Engineering", month: "March 2026", netSalary: "₹34,100", netSalaryNum: 34100, status: "Published", avatar: "RJ" },
  { id: "964", name: "Amit Rathod", department: "Finance", month: "March 2026", netSalary: "₹33,400", netSalaryNum: 33400, status: "Pending", avatar: "AR" },
  { id: "1005", name: "Sagar Singh", department: "Engineering", month: "March 2026", netSalary: "₹22,100", netSalaryNum: 22100, status: "Published", avatar: "SS" },
  { id: "1006", name: "Neha Patel", department: "HR", month: "March 2026", netSalary: "₹26,300", netSalaryNum: 26300, status: "Pending", avatar: "NP" },
  { id: "1107", name: "Zyx Kumar", department: "Engineering", month: "March 2026", netSalary: "₹38,800", netSalaryNum: 38800, status: "Published", avatar: "ZK" },
];

const payslipDetail = {
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

// ─── Sub-components ───

function KpiCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string;
}) {
  return (
    <div className="payroll-card p-5 flex items-start gap-4 group cursor-default transition-transform duration-200 hover:-translate-y-0.5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tracking-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function FilterChip({ active, label, count, onClick }: {
  active: boolean; label: string; count: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {label}
      <span className="ml-1.5 text-xs opacity-80">({count})</span>
    </button>
  );
}

function StatusBadge({ status }: { status: "Published" | "Pending" }) {
  return (
    <Badge
      variant="secondary"
      className={`text-xs font-medium border-0 transition-colors duration-200 ${
        status === "Published"
          ? "bg-success/10 text-success"
          : "bg-warning/10 text-warning"
      }`}
    >
      {status === "Published" && <CheckCircle2 className="h-3 w-3 mr-1" />}
      {status === "Pending" && <Clock className="h-3 w-3 mr-1" />}
      {status}
    </Badge>
  );
}

function PayslipTypeCard({ label, selected, onClick, description }: {
  label: string; selected: boolean; onClick: () => void; description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/30 hover:bg-muted/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{label}</span>
        {selected && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  );
}

// ─── Empty State ───
function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-6">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No payslips generated for this month</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
        Generate payslips for your employees to view, download, and distribute them.
      </p>
      <Button onClick={onGenerate} className="gap-2">
        <Plus className="h-4 w-4" /> Generate Payslips
      </Button>
    </div>
  );
}

// ─── Bulk Action Bar ───
function BulkActionBar({ count, onClear, onDownload, onEmail, onPublish }: {
  count: number; onClear: () => void; onDownload: () => void; onEmail: () => void; onPublish: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-xl bg-card border shadow-lg px-5 py-3 animate-fade-in">
      <span className="text-sm font-medium">
        <span className="text-primary font-bold">{count}</span> selected
      </span>
      <Separator orientation="vertical" className="h-6" />
      <Button size="sm" variant="outline" className="gap-1.5" onClick={onDownload}>
        <Download className="h-3.5 w-3.5" /> Download
      </Button>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={onEmail}>
        <Mail className="h-3.5 w-3.5" /> Email
      </Button>
      <Button size="sm" className="gap-1.5" onClick={onPublish}>
        <CheckCircle2 className="h-3.5 w-3.5" /> Publish
      </Button>
      <Button size="sm" variant="ghost" onClick={onClear}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Main Component ───
const Payslip = () => {
  const [month, setMonth] = useState("march-2026");
  const [activeFilter, setActiveFilter] = useState<"all" | "Published" | "Pending">("all");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [payslips, setPayslips] = useState(initialPayslips);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [payslipType, setPayslipType] = useState("payslip");
  const [employeeScope, setEmployeeScope] = useState("all");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const { toast } = useToast();

  // ─── Computed ───
  const counts = useMemo(() => ({
    total: payslips.length,
    published: payslips.filter(p => p.status === "Published").length,
    pending: payslips.filter(p => p.status === "Pending").length,
    totalSalary: payslips.reduce((s, p) => s + p.netSalaryNum, 0),
  }), [payslips]);

  const departments = useMemo(() => [...new Set(payslips.map(p => p.department))], [payslips]);

  const filtered = useMemo(() => payslips.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchFilter = activeFilter === "all" || p.status === activeFilter;
    const matchDept = departmentFilter === "all" || p.department === departmentFilter;
    return matchSearch && matchFilter && matchDept;
  }), [payslips, search, activeFilter, departmentFilter]);

  const allSelected = filtered.length > 0 && filtered.every(p => selectedIds.has(p.id));

  // ─── Handlers ───
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(p => p.id)));
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setPayslips(prev => prev.map(p => ({ ...p, status: "Published" as const })));
      setGenerating(false);
      setGenerateOpen(false);
      toast({ title: "Payslips Generated", description: "All payslips have been generated and published successfully." });
    }, 2000);
  };

  const handleDownload = () => toast({ title: "Downloading", description: "Payslip PDF is being downloaded..." });
  const handleBulkPublish = () => {
    setPayslips(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, status: "Published" as const } : p));
    toast({ title: "Published", description: `${selectedIds.size} payslips marked as published.` });
    setSelectedIds(new Set());
  };

  const payslipTypes = [
    { key: "payslip", label: "Payslip", desc: "Standard monthly payslip" },
    { key: "detailed", label: "Detailed Payslip", desc: "Includes all breakdowns" },
    { key: "tax", label: "Tax Payslip", desc: "Tax computation statement" },
    { key: "fnf", label: "FNF Payslip", desc: "Full & final settlement" },
    { key: "ytd", label: "YTD Payslip", desc: "Year-to-date summary" },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage, generate and distribute employee payslips</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="march-2026">March 2026</SelectItem>
              <SelectItem value="february-2026">February 2026</SelectItem>
              <SelectItem value="january-2026">January 2026</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setGenerateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Generate Payslips
          </Button>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Total Employees" value={counts.total} color="bg-primary/10 text-primary" />
        <KpiCard icon={CheckCircle2} label="Payslips Generated" value={counts.published} color="bg-success/10 text-success" />
        <KpiCard icon={Clock} label="Pending Payslips" value={counts.pending} color="bg-warning/10 text-warning" />
        <KpiCard icon={IndianRupee} label="Total Payroll" value={`₹${counts.totalSalary.toLocaleString("en-IN")}`} color="bg-info/10 text-info" />
      </div>

      {/* ─── Filters ─── */}
      <div className="payroll-card p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search employee name or ID..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <FilterChip active={activeFilter === "all"} label="All" count={counts.total} onClick={() => setActiveFilter("all")} />
            <FilterChip active={activeFilter === "Published"} label="Published" count={counts.published} onClick={() => setActiveFilter("Published")} />
            <FilterChip active={activeFilter === "Pending"} label="Pending" count={counts.pending} onClick={() => setActiveFilter("Pending")} />
          </div>
        </div>
      </div>

      {/* ─── Table / Empty State ─── */}
      {filtered.length === 0 ? (
        <EmptyState onGenerate={() => setGenerateOpen(true)} />
      ) : (
        <div className="payroll-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left w-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Employee</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Department</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Net Salary</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 hover:bg-muted/20 transition-colors duration-150"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-4 py-3">
                      <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {p.avatar}
                        </div>
                        <div>
                          <p className="font-medium leading-tight">{p.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{p.department}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{p.netSalary}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8 transition-transform duration-150 hover:scale-110" onClick={() => setPreviewOpen(true)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 transition-transform duration-150 hover:scale-110" onClick={handleDownload}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => toast({ title: "Sent", description: "Payslip emailed." })}>
                              <Mail className="h-4 w-4" /> Send via Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => toast({ title: "Sent", description: "Payslip sent via WhatsApp." })}>
                              <MessageSquare className="h-4 w-4" /> Send via WhatsApp
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Bulk Action Bar ─── */}
      {selectedIds.size > 0 && (
        <BulkActionBar
          count={selectedIds.size}
          onClear={() => setSelectedIds(new Set())}
          onDownload={() => { toast({ title: "Downloading", description: `Downloading ${selectedIds.size} payslips...` }); setSelectedIds(new Set()); }}
          onEmail={() => { toast({ title: "Emailed", description: `Sent ${selectedIds.size} payslips via email.` }); setSelectedIds(new Set()); }}
          onPublish={handleBulkPublish}
        />
      )}

      {/* ─── Generate Payslip Drawer ─── */}
      <Sheet open={generateOpen} onOpenChange={setGenerateOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Generate Payslips</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 py-6">
            {/* Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Payslip Type</Label>
              <div className="space-y-2">
                {payslipTypes.map(t => (
                  <PayslipTypeCard
                    key={t.key}
                    label={t.label}
                    description={t.desc}
                    selected={payslipType === t.key}
                    onClick={() => setPayslipType(t.key)}
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Employee Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Employee Selection</Label>
              <div className="flex gap-3">
                {[
                  { key: "all", label: "All Employees" },
                  { key: "selected", label: "Selected" },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setEmployeeScope(opt.key)}
                    className={`flex-1 rounded-xl border-2 p-3 text-sm font-medium transition-all duration-200 ${
                      employeeScope === opt.key
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {employeeScope === "selected" && (
                <div className="space-y-2 mt-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      className="pl-9"
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto rounded-lg border p-1 space-y-0.5">
                    {initialPayslips.filter(p => p.name.toLowerCase().includes(employeeSearch.toLowerCase())).map(p => (
                      <label key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer text-sm">
                        <Checkbox />
                        <span>{p.name}</span>
                        <span className="text-muted-foreground text-xs ml-auto">{p.department}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Summary Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Summary</Label>
              <div className="rounded-xl bg-muted/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employees</span>
                  <span className="font-medium">{employeeScope === "all" ? counts.total : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Month</span>
                  <span className="font-medium">March 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{payslipTypes.find(t => t.key === payslipType)?.label}</span>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="gap-2 pt-4 border-t">
            <SheetClose asChild>
              <Button variant="outline" className="flex-1">Cancel</Button>
            </SheetClose>
            <Button onClick={handleGenerate} disabled={generating} className="flex-1 gap-2">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
              {generating ? "Generating..." : "Generate"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* ─── Payslip Detail Drawer ─── */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Payslip Details</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 py-6">
            {/* Employee Info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  JD
                </div>
                <div>
                  <h3 className="text-base font-semibold">{payslipDetail.employee}</h3>
                  <p className="text-xs text-muted-foreground">{payslipDetail.designation} · {payslipDetail.department}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">ID: {payslipDetail.employeeId} · {payslipDetail.month}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5" /> PDF
              </Button>
            </div>

            <Separator />

            {/* Earnings */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Earnings</h4>
              <div className="space-y-2.5">
                {payslipDetail.earnings.map(e => (
                  <div key={e.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{e.label}</span>
                    <span className="font-medium tabular-nums">{e.amount}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total Earnings</span>
                  <span className="tabular-nums text-success">{payslipDetail.totalEarnings}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Deductions</h4>
              <div className="space-y-2.5">
                {payslipDetail.deductions.map(d => (
                  <div key={d.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{d.label}</span>
                    <span className="font-medium tabular-nums">{d.amount}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total Deductions</span>
                  <span className="tabular-nums text-destructive">{payslipDetail.totalDeductions}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Net Salary */}
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-5 flex items-center justify-between">
              <span className="text-base font-semibold">Net Salary</span>
              <span className="text-2xl font-bold tabular-nums text-primary">{payslipDetail.netSalary}</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Payslip;
