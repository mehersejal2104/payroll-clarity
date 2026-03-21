import { useState } from "react";
import { Plus, Pencil, Trash2, Building2, LayoutTemplate, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";

const templates = [
  {
    id: 1,
    name: "Standard CTC - Engineering",
    sites: ["Head Office", "Branch A"],
    components: 8,
    lastModified: "15 Mar 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "Management CTC",
    sites: ["Head Office"],
    components: 10,
    lastModified: "10 Mar 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "Intern CTC Template",
    sites: ["Branch B"],
    components: 5,
    lastModified: "02 Mar 2026",
    status: "Draft",
  },
];

const salaryComponents = [
  { group: "Earnings", items: ["Basic Salary", "HRA", "Conveyance", "Medical Allowance", "Special Allowance"] },
  { group: "Employer Contributions", items: ["Employer PF", "Employer ESI", "Employer LWF"] },
  { group: "Deductions", items: ["Employee PF", "Employee ESI", "Professional Tax", "TDS"] },
];

const CTCTemplate = () => {
  const [templateName, setTemplateName] = useState("");
  const [selectedSite, setSelectedSite] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="page-title">CTC Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage salary component templates for your organization</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Assign Template Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none gap-2 active:scale-[0.97] transition-transform">
                <Building2 className="h-4 w-4" />
                Assign Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Template to Site</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Site</Label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="head-office">Head Office</SelectItem>
                      <SelectItem value="branch-a">Branch A</SelectItem>
                      <SelectItem value="branch-b">Branch B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create Template Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none gap-2 active:scale-[0.97] transition-transform">
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create CTC Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                {/* Step: General Settings */}
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Label *</Label>
                  <Input
                    id="template-name"
                    placeholder="Enter template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>

                {/* Step: Associate Sites */}
                <div className="space-y-2">
                  <Label>Associate Sites</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sites..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="head-office">Head Office</SelectItem>
                      <SelectItem value="branch-a">Branch A</SelectItem>
                      <SelectItem value="branch-b">Branch B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Step: Tax and Statutory */}
                <div className="space-y-2">
                  <Label>Tax and Statutory Settings</Label>
                  <p className="text-xs text-muted-foreground">Configure PF, ESI, and tax settings for this template.</p>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button>Next</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="payroll-card p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <LayoutTemplate className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{tpl.name}</h3>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    tpl.status === "Active"
                      ? "bg-success/10 text-success border-0"
                      : "bg-muted text-muted-foreground border-0"
                  }
                >
                  {tpl.status}
                </Badge>
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>Sites: {tpl.sites.join(", ")}</p>
                <p>{tpl.components} salary components · Modified {tpl.lastModified}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs active:scale-[0.97] transition-transform">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs active:scale-[0.97] transition-transform">
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive hover:text-destructive active:scale-[0.97] transition-transform">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Salary Components Reference */}
      <div className="payroll-card p-5 md:p-6">
        <h3 className="section-title mb-4">Salary Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {salaryComponents.map((group) => (
            <div key={group.group}>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{group.group}</h4>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Site-wise Payslip */}
      <div className="payroll-card p-5">
        <h3 className="section-title mb-4">Generate Site-wise Payslip</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Site</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select Sites" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="head-office">Head Office</SelectItem>
                <SelectItem value="branch-a">Branch A</SelectItem>
                <SelectItem value="branch-b">Branch B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Select Month & Year</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select Month" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="march-2026">March 2026</SelectItem>
                <SelectItem value="february-2026">February 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="active:scale-[0.97] transition-transform">Cancel</Button>
          <Button className="active:scale-[0.97] transition-transform">Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default CTCTemplate;
