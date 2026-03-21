import { useState } from "react";
import { Download, Share2, Search, FileText, Printer, Eye, Loader2, CheckCircle2, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PayslipRecord {
  id: string;
  name: string;
  month: string;
  netSalary: string;
  status: "Published" | "Unpublished";
}

const initialPayslips: PayslipRecord[] = [
  { id: "178", name: "John Doe", month: "March 2026", netSalary: "₹30,877", status: "Published" },
  { id: "353", name: "Ramesh Kumar", month: "March 2026", netSalary: "₹24,200", status: "Published" },
  { id: "661", name: "Priya Sharma", month: "March 2026", netSalary: "₹27,500", status: "Unpublished" },
  { id: "663", name: "Rikkjha Jha", month: "March 2026", netSalary: "₹34,100", status: "Published" },
  { id: "964", name: "Amit Rathod", month: "March 2026", netSalary: "₹33,400", status: "Unpublished" },
  { id: "1005", name: "Sagar Singh", month: "March 2026", netSalary: "₹22,100", status: "Published" },
  { id: "1006", name: "Neha Patel", month: "March 2026", netSalary: "₹26,300", status: "Unpublished" },
  { id: "1107", name: "Zyx Kumar", month: "March 2026", netSalary: "₹38,800", status: "Published" },
];

const payslipPreviewData = {
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
  const [month, setMonth] = useState("march-2026");
  const [activeTab, setActiveTab] = useState<"all" | "Published" | "Unpublished">("all");
  const [search, setSearch] = useState("");
  const [payslips, setPayslips] = useState(initialPayslips);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [payslipType, setPayslipType] = useState("monthly");
  const [employeeScope, setEmployeeScope] = useState("all");
  const [selectedEmployees, setSelectedEmployees] = useState("");
  const { toast } = useToast();

  const tabs = [
    { key: "all" as const, label: "All", count: payslips.length },
    { key: "Published" as const, label: "Published", count: payslips.filter(p => p.status === "Published").length },
    { key: "Unpublished" as const, label: "Unpublished", count: payslips.filter(p => p.status === "Unpublished").length },
  ];

  const filtered = payslips.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "all" || p.status === activeTab;
    return matchSearch && matchTab;
  });

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setPayslips(prev => prev.map(p => ({ ...p, status: "Published" as const })));
      setGenerating(false);
      setGenerateOpen(false);
      toast({ title: "Payslips Generated", description: "All payslips have been generated and published successfully." });
    }, 2000);
  };

  const handleDownload = () => {
    toast({ title: "Downloading", description: "Payslip PDF is being downloaded..." });
  };

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
          <Button onClick={() => setGenerateOpen(true)} className="w-full sm:w-auto gap-2 active:scale-[0.97] transition-transform">
            <Printer className="h-4 w-4" />
            Generate Payslip
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs tabular-nums">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Payslip Table */}
      <div className="payroll-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Employee Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Month</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Net Salary</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No payslips found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold shrink-0">
                          {p.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.month}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{p.netSalary}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="secondary" className={
                        p.status === "Published"
                          ? "bg-success/10 text-success border-0"
                          : "bg-warning/10 text-warning border-0"
                      }>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setPreviewOpen(true)}>
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={handleDownload}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Payslip Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Payslip</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>Payslip Type</Label>
              <div className="flex gap-3">
                {["monthly", "yearly"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setPayslipType(type)}
                    className={`flex-1 rounded-lg border-2 p-3 text-sm font-medium capitalize transition-all ${
                      payslipType === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Employee Selection</Label>
              <div className="flex gap-3">
                {[
                  { key: "all", label: "All Employees" },
                  { key: "selected", label: "Selected Employees" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setEmployeeScope(opt.key)}
                    className={`flex-1 rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                      employeeScope === opt.key
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {employeeScope === "selected" && (
              <div className="space-y-2">
                <Label>Search & Select Employees</Label>
                <Input
                  placeholder="Type employee name..."
                  value={selectedEmployees}
                  onChange={(e) => setSelectedEmployees(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Separate multiple names with commas</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="march-2026">March 2026</SelectItem>
                  <SelectItem value="february-2026">February 2026</SelectItem>
                  <SelectItem value="january-2026">January 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleGenerate} disabled={generating} className="gap-2">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
              {generating ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payslip Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payslip Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{payslipPreviewData.employee}</h3>
                <p className="text-sm text-muted-foreground">{payslipPreviewData.designation} · {payslipPreviewData.department}</p>
                <p className="text-xs text-muted-foreground mt-1">ID: {payslipPreviewData.employeeId} · {payslipPreviewData.month}</p>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-0">Generated</Badge>
            </div>

            <Separator />

            {/* Earnings */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Earnings</h4>
              <div className="space-y-2">
                {payslipPreviewData.earnings.map((e) => (
                  <div key={e.label} className="flex justify-between text-sm">
                    <span>{e.label}</span>
                    <span className="font-medium tabular-nums">{e.amount}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total Earnings</span>
                  <span className="tabular-nums text-success">{payslipPreviewData.totalEarnings}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Deductions</h4>
              <div className="space-y-2">
                {payslipPreviewData.deductions.map((d) => (
                  <div key={d.label} className="flex justify-between text-sm">
                    <span>{d.label}</span>
                    <span className="font-medium tabular-nums">{d.amount}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total Deductions</span>
                  <span className="tabular-nums text-destructive">{payslipPreviewData.totalDeductions}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Net Salary */}
            <div className="flex items-center justify-between rounded-xl bg-primary/5 p-4">
              <span className="text-base font-semibold">Net Salary</span>
              <span className="text-2xl font-bold tabular-nums text-primary">{payslipPreviewData.netSalary}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1 gap-2 active:scale-[0.97] transition-transform" onClick={handleDownload}>
                <Download className="h-4 w-4" /> Download
              </Button>
              <Button variant="outline" className="flex-1 gap-2 active:scale-[0.97] transition-transform" onClick={() => toast({ title: "Shared", description: "Payslip share link copied." })}>
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payslip;
