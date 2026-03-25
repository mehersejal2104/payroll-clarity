import { useState, useMemo } from "react";
import { Search, Download, Calendar, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Import Export",
  "Reports Generation",
  "Audit Reports",
  "Payroll Reports",
  "Compliance Reports",
  "Compliance Tracker Reports",
  "Income Tax Reports",
  "Bank Reports",
  "Leave Reports",
  "Attendance Reports",
  "Expense Reports",
  "Flexi Benefit Reports",
  "Form 16s",
  "Custom Reports",
  "HR Reports",
  "Timesheet Reports",
  "Investment Reports",
  "Survey Reports",
  "Onboarding Reports",
  "Offboarding Reports",
  "Loan Reports",
];

interface ReportRow {
  id: string;
  name: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  type: "Import" | "Export";
  status: "Completed" | "Pending" | "Failed";
}

const generateData = (category: string): ReportRow[] => {
  const base: ReportRow[] = [
    { id: "1", name: `${category} - Monthly Summary`, period: "Mar 2026", generatedAt: "2026-03-20 10:30", generatedBy: "Suresh M.", type: "Export", status: "Completed" },
    { id: "2", name: `${category} - Department Wise`, period: "Mar 2026", generatedAt: "2026-03-18 14:15", generatedBy: "Priya S.", type: "Export", status: "Completed" },
    { id: "3", name: `${category} - Q1 Report`, period: "Q1 2026", generatedAt: "2026-03-15 09:00", generatedBy: "Suresh M.", type: "Export", status: "Pending" },
    { id: "4", name: `${category} - Bulk Import`, period: "Feb 2026", generatedAt: "2026-02-28 16:45", generatedBy: "Amit R.", type: "Import", status: "Completed" },
    { id: "5", name: `${category} - Annual Data`, period: "FY 2025-26", generatedAt: "2026-03-10 11:20", generatedBy: "Neha P.", type: "Export", status: "Failed" },
    { id: "6", name: `${category} - Employee Wise`, period: "Mar 2026", generatedAt: "2026-03-22 08:50", generatedBy: "Suresh M.", type: "Export", status: "Completed" },
  ];
  return base;
};

const Reports = () => {
  const [selectedCategory, setSelectedCategory] = useState("Import Export");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const { toast } = useToast();

  const data = useMemo(() => generateData(selectedCategory), [selectedCategory]);

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || r.type === typeFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [data, search, typeFilter, statusFilter]);

  const handleDownload = (row: ReportRow) => {
    toast({ title: "Download Started", description: `Downloading ${row.name}...` });
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success/15 text-success border-success/20";
      case "Pending": return "bg-warning/15 text-warning border-warning/20";
      case "Failed": return "bg-destructive/15 text-destructive border-destructive/20";
      default: return "";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Details List */}
        <Card className="lg:w-64 shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">Details List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="flex flex-col">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "text-left px-4 py-2.5 text-[13px] transition-colors border-l-2",
                    selectedCategory === cat
                      ? "bg-primary/10 text-primary font-medium border-l-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-transparent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Right Section - Table */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-[140px] h-9 text-sm">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="mar-2026">Mar 2026</SelectItem>
                    <SelectItem value="feb-2026">Feb 2026</SelectItem>
                    <SelectItem value="jan-2026">Jan 2026</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[120px] h-9 text-sm">
                    <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Import">Import</SelectItem>
                    <SelectItem value="Export">Export</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] h-9 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Import/Export Name</TableHead>
                    <TableHead className="text-xs font-semibold">Period</TableHead>
                    <TableHead className="text-xs font-semibold">Generated At</TableHead>
                    <TableHead className="text-xs font-semibold">Generated By</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                        No reports found for the selected filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="text-sm font-medium text-foreground">{row.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.period}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.generatedAt}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.generatedBy}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-medium">
                            {row.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", statusVariant(row.status))}>
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleDownload(row)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
