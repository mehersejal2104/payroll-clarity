import { useState } from "react";
import { Plus, Pencil, Trash2, Building2, LayoutTemplate, Copy, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: number;
  name: string;
  sites: string[];
  components: number;
  lastModified: string;
  status: "Active" | "Draft";
}

const initialTemplates: Template[] = [
  { id: 1, name: "Standard CTC - Engineering", sites: ["Head Office", "Branch A"], components: 8, lastModified: "15 Mar 2026", status: "Active" },
  { id: 2, name: "Management CTC", sites: ["Head Office"], components: 10, lastModified: "10 Mar 2026", status: "Active" },
  { id: 3, name: "Intern CTC Template", sites: ["Branch B"], components: 5, lastModified: "02 Mar 2026", status: "Draft" },
];

const salaryComponents = [
  { group: "Earnings", items: ["Basic Salary", "HRA", "Conveyance", "Medical Allowance", "Special Allowance"] },
  { group: "Employer Contributions", items: ["Employer PF", "Employer ESI", "Employer LWF"] },
  { group: "Deductions", items: ["Employee PF", "Employee ESI", "Professional Tax", "TDS"] },
];

const CTCTemplate = () => {
  const [templates, setTemplates] = useState(initialTemplates);
  const [templateName, setTemplateName] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBasic, setEditBasic] = useState("50");
  const [editHRA, setEditHRA] = useState("20");
  const [editConveyance, setEditConveyance] = useState("5");
  const [editMedical, setEditMedical] = useState("5");
  const [editSpecial, setEditSpecial] = useState("20");
  const [editPF, setEditPF] = useState("12");
  const [editPT, setEditPT] = useState("200");
  const [editTDS, setEditTDS] = useState("10");

  const handleCreate = () => {
    if (!templateName.trim()) {
      toast({ title: "Error", description: "Template name is required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const newTemplate: Template = {
        id: Date.now(),
        name: templateName,
        sites: selectedSite ? [selectedSite] : ["Head Office"],
        components: 8,
        lastModified: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Draft",
      };
      setTemplates(prev => [...prev, newTemplate]);
      setTemplateName("");
      setSelectedSite("");
      setSaving(false);
      setCreateOpen(false);
      toast({ title: "Template Created", description: `"${newTemplate.name}" has been created.` });
    }, 1200);
  };

  const handleEdit = (tpl: Template) => {
    setEditingTemplate(tpl);
    setEditName(tpl.name);
  };

  const handleSaveEdit = () => {
    if (!editingTemplate) return;
    setSaving(true);
    setTimeout(() => {
      setTemplates(prev => prev.map(t =>
        t.id === editingTemplate.id
          ? { ...t, name: editName, lastModified: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
          : t
      ));
      setSaving(false);
      setEditingTemplate(null);
      toast({ title: "Template Updated", description: `"${editName}" saved.` });
    }, 1000);
  };

  const handleDelete = (id: number) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Template Deleted", description: "The template has been removed." });
  };

  const handleDuplicate = (tpl: Template) => {
    const dup: Template = {
      ...tpl,
      id: Date.now(),
      name: `${tpl.name} (Copy)`,
      status: "Draft",
      lastModified: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setTemplates(prev => [...prev, dup]);
    toast({ title: "Template Duplicated", description: `"${dup.name}" created.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="page-title">CTC Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage salary component templates for your organization</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog>
            <Dialog>
              <Button variant="outline" className="flex-1 sm:flex-none gap-2 active:scale-[0.97] transition-transform" onClick={() => {}}>
                <Building2 className="h-4 w-4" />
                Assign Template
              </Button>
            </Dialog>
          </Dialog>
          <Button onClick={() => setCreateOpen(true)} className="flex-1 sm:flex-none gap-2 active:scale-[0.97] transition-transform">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <div className="col-span-full payroll-card p-12 text-center">
            <LayoutTemplate className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">No templates yet. Create your first CTC template.</p>
            <Button onClick={() => setCreateOpen(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" /> New Template
            </Button>
          </div>
        ) : (
          templates.map((tpl) => (
            <div key={tpl.id} className="payroll-card p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <LayoutTemplate className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">{tpl.name}</h3>
                  </div>
                  <Badge variant="secondary" className={
                    tpl.status === "Active"
                      ? "bg-success/10 text-success border-0"
                      : "bg-muted text-muted-foreground border-0"
                  }>
                    {tpl.status}
                  </Badge>
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>Sites: {tpl.sites.join(", ")}</p>
                  <p>{tpl.components} salary components · Modified {tpl.lastModified}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs active:scale-[0.97] transition-transform" onClick={() => handleEdit(tpl)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs active:scale-[0.97] transition-transform" onClick={() => handleDuplicate(tpl)}>
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive hover:text-destructive active:scale-[0.97] transition-transform" onClick={() => setDeleteConfirm(tpl.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
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
          <Button className="active:scale-[0.97] transition-transform" onClick={() => toast({ title: "Submitted", description: "Site-wise payslip generation started." })}>Submit</Button>
        </div>
      </div>

      {/* Create Template Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create CTC Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="tpl-name">Template Name *</Label>
              <Input id="tpl-name" placeholder="Enter template name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Associate Sites</Label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger><SelectValue placeholder="Select sites..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Head Office">Head Office</SelectItem>
                  <SelectItem value="Branch A">Branch A</SelectItem>
                  <SelectItem value="Branch B">Branch B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tax and Statutory Settings</Label>
              <p className="text-xs text-muted-foreground">Configure PF, ESI, and tax settings for this template.</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleCreate} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Earnings (%)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Basic Salary</Label>
                  <Input value={editBasic} onChange={(e) => setEditBasic(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">HRA</Label>
                  <Input value={editHRA} onChange={(e) => setEditHRA(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Conveyance</Label>
                  <Input value={editConveyance} onChange={(e) => setEditConveyance(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Medical</Label>
                  <Input value={editMedical} onChange={(e) => setEditMedical(e.target.value)} />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Special Allowance</Label>
                  <Input value={editSpecial} onChange={(e) => setEditSpecial(e.target.value)} />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Deductions</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">PF (%)</Label>
                  <Input value={editPF} onChange={(e) => setEditPF(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Prof. Tax (₹)</Label>
                  <Input value={editPT} onChange={(e) => setEditPT(e.target.value)} />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">TDS (%)</Label>
                  <Input value={editTDS} onChange={(e) => setEditTDS(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this template? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CTCTemplate;
