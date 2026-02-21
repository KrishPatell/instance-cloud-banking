"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { 
  Settings, Copy, Sun, Moon, Monitor, CreditCard, ExternalLink, 
  Pencil, Plus, MoreVertical, Trash2, UserCog, Mail, Bell, Globe,
  Info, Loader2, Check, Building2, Users, Receipt, Smartphone, 
  Shield, Key, AlertTriangle, CheckCircle2, XCircle
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SettingsProvider, useSettings } from "@/lib/context/SettingsContext";
import { cn } from "@/lib/utils";

const tabSchema = z.enum(["general", "fees", "team", "app", "billing"]);

// ============ MAIN PAGE ============
function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  const tabParam = searchParams.get("tab") || "general";
  const activeTab = tabSchema.parse(tabParam);

  const handleTabChange = (value: string) => {
    router.push(`/settings?tab=${value}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your organisation, team, and preferences"
        icon={Settings}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-muted/50 p-1 rounded-xl h-auto">
          <TabsTrigger 
            value="general" 
            className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Building2 className="h-4 w-4" />
            <span className="text-xs font-medium">General</span>
          </TabsTrigger>
          <TabsTrigger 
            value="fees" 
            className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Receipt className="h-4 w-4" />
            <span className="text-xs font-medium">Fees</span>
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Team</span>
          </TabsTrigger>
          <TabsTrigger 
            value="app" 
            className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Smartphone className="h-4 w-4" />
            <span className="text-xs font-medium">App</span>
          </TabsTrigger>
          <TabsTrigger 
            value="billing" 
            className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <CreditCard className="h-4 w-4" />
            <span className="text-xs font-medium">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="fees" className="mt-6">
          <FeesTab />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <TeamTab />
        </TabsContent>

        <TabsContent value="app" className="mt-6">
          <AppTab />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <BillingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SettingsProvider>
      <Suspense fallback={
        <div className="container mx-auto py-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }>
        <SettingsContent />
      </Suspense>
    </SettingsProvider>
  );
}

// ============ TAB A: GENERAL ============
function GeneralTab() {
  const [copied, setCopied] = useState(false);
  const orgId = "org_7y2x9m4k8p1q5w2";

  const handleCopy = () => {
    navigator.clipboard.writeText(orgId);
    setCopied(true);
    toast.success("Organisation ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Organisation */}
      <Card className="rounded-xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Your Organisation</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Organisation name</span>
            <span className="font-medium">Instance Cloud Ltd.</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Organisation ID</span>
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm text-muted-foreground">{orgId}</code>
              <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Created at</span>
            <span className="text-sm text-muted-foreground">15 March 2024</span>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h3 className="text-destructive font-medium mb-2">Delete organisation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your organisation and all associated data. This action cannot be undone.
        </p>
        <Button variant="destructive" className="w-full">
          Delete organisation
        </Button>
      </Card>
    </div>
  );
}

// ============ TAB B: FEES ============
function FeesTab() {
  const [fees, setFees] = useState({
    AED: { amount: 1000, fee: 0.5, vat: 5, mode: "bps" },
    USD: { amount: 1000, fee: 0.3, vat: 0, mode: "bps" },
    EUR: { amount: 1000, fee: 0.4, vat: 20, mode: "bps" },
    GBP: { amount: 1000, fee: 0.35, vat: 20, mode: "bps" },
  });
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (currency: string) => {
    setSaving(currency);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Fees updated for ${currency}`);
    setSaving(null);
  };

  const flags: Record<string, string> = {
    AED: "🇦🇪",
    USD: "🇺🇸",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
  };

  return (
    <div className="max-w-2xl">
      <Accordion type="single" collapsible className="space-y-4">
        {Object.entries(fees).map(([currency, data]) => (
          <AccordionItem key={currency} value={currency} className="border rounded-lg px-4">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <span className="font-bold">{currency}</span>
                <span>{flags[currency]}</span>
                <span className="text-sm text-muted-foreground ml-2">View fee structure</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label>Transaction Amount</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={data.amount}
                      onChange={(e) => setFees({ ...fees, [currency]: { ...data, amount: Number(e.target.value) } })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Transaction Fee</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={data.fee}
                      onChange={(e) => setFees({ ...fees, [currency]: { ...data, fee: Number(e.target.value) } })}
                    />
                    <span className="text-sm text-muted-foreground">{data.mode}</span>
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>VAT Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={data.vat}
                      onChange={(e) => setFees({ ...fees, [currency]: { ...data, vat: Number(e.target.value) } })}
                      className="max-w-[120px]"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button onClick={() => handleSave(currency)} disabled={saving === currency}>
                    {saving === currency ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save fees
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// ============ TAB C: TEAM ============
function TeamTab() {
  const { teamMembers, updateTeamMember, removeMember, addTeamMember } = useSettings();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Manager");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [actionMember, setActionMember] = useState<number | null>(null);

  const handleInvite = async () => {
    if (!inviteEmail.match(/^\S+@\S+\.\S+$/)) {
      toast.error("Enter a valid email");
      return;
    }
    setInviteLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    const newMember = {
      id: Date.now(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole as "Admin" | "Manager" | "Viewer",
      status: "Invited" as const,
      avatar: "🟣",
    };
    addTeamMember(newMember);
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteLoading(false);
  };

  const handleStatusToggle = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    updateTeamMember(id, { status: newStatus as "Active" | "Invited" | "Suspended" });
    toast.success(`Member ${newStatus.toLowerCase()}`);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Team members</h3>
        <Button onClick={() => setInviteOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Invite member
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-t">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{member.avatar}</span>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{member.email}</td>
                <td className="p-4">
                  <Select
                    value={member.role}
                    onValueChange={(v) => {
                      updateTeamMember(member.id, { role: v as "Admin" | "Manager" | "Viewer" });
                      toast.success("Role updated");
                    }}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-4">
                  <Badge
                    className={cn(
                      member.status === "Active" && "bg-green-100 text-green-800",
                      member.status === "Invited" && "bg-amber-100 text-amber-800",
                      member.status === "Suspended" && "bg-gray-100 text-gray-600"
                    )}
                  >
                    {member.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusToggle(member.id, member.status)}>
                        {member.status === "Active" ? "Suspend" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          removeMember(member.id);
                          toast.success("Member removed");
                        }}
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address *</Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={inviteLoading}>
              {inviteLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ TAB D: APP ============
function AppTab() {
  const { appPreferences, updatePreferences } = useSettings();
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Preferences saved");
    setSaving(false);
  };

  const notifications = [
    { key: "email", label: "Email notifications", description: "Receive email communications", locked: false },
    { key: "paymentConfirm", label: "Payment confirmation emails", description: "Notify on successful payments", locked: false },
    { key: "failedAlert", label: "Failed transaction alerts", description: "Alert on transaction failures", locked: false },
    { key: "weeklyDigest", label: "Weekly digest", description: "Summary of account activity", locked: false },
    { key: "securityAlerts", label: "Security alerts", description: "Critical security notifications", locked: true },
  ];

  return (
    <div className="max-w-2xl space-y-8">
      {/* Appearance */}
      <Card className="rounded-xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="flex gap-3">
          {(["light", "dark", "system"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setTheme(mode);
                updatePreferences({ theme: mode });
              }}
              className={cn(
                "px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors",
                theme === mode
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {mode === "light" && <Sun className="w-4 h-4" />}
              {mode === "dark" && <Moon className="w-4 h-4" />}
              {mode === "system" && <Monitor className="w-4 h-4" />}
              <span className="capitalize">{mode}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card className="rounded-xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          {notifications.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              </div>
              <Switch
                checked={appPreferences.notifications[setting.key as keyof typeof appPreferences.notifications]}
                onCheckedChange={(val) =>
                  updatePreferences({
                    notifications: { ...appPreferences.notifications, [setting.key]: val },
                  })
                }
                disabled={setting.locked}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Language & Region */}
      <Card className="rounded-xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={appPreferences.language}
              onValueChange={(v) => updatePreferences({ language: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية (Arabic)</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
                <SelectItem value="de">Deutsch (German)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select
              value={appPreferences.timezone}
              onValueChange={(v) => updatePreferences({ timezone: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC ± 00:00</SelectItem>
                <SelectItem value="AET">AET (UTC+10)</SelectItem>
                <SelectItem value="CST">CST (UTC+08:00)</SelectItem>
                <SelectItem value="GST">GST (UTC+04:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select
              value={appPreferences.dateFormat}
              onValueChange={(v) => updatePreferences({ dateFormat: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Currency Display</Label>
            <Select
              value={appPreferences.currencyDisplay}
              onValueChange={(v) => updatePreferences({ currencyDisplay: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="symbol">Symbol: $1,000.00</SelectItem>
                <SelectItem value="code">Code: USD 1,000.00</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="mt-6" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Save preferences
        </Button>
      </Card>
    </div>
  );
}

// ============ TAB E: BILLING ============
function BillingTab() {
  const { billingSetup, setBillingSetup, billingEmail, setBillingEmail } = useSettings();
  const [billingLoading, setBillingLoading] = useState(false);
  const [emailInput, setEmailInput] = useState(billingEmail || "");
  const [editOpen, setEditOpen] = useState(false);
  const [editEmail, setEditEmail] = useState("");

  const handleSetup = async () => {
    if (!emailInput.match(/^\S+@\S+\.\S+$/)) {
      toast.error("Enter a valid email");
      return;
    }
    setBillingLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setBillingEmail(emailInput);
    setBillingSetup(true);
    toast.success("Billing email saved");
    setBillingLoading(false);
  };

  const handleUpdateEmail = async () => {
    setBillingEmail(editEmail);
    toast.success("Billing email updated");
    setEditOpen(false);
  };

  if (!billingSetup) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center p-8">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Set Up Billing Information</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your billing email to receive invoices and manage your subscription.
          </p>
          <Input
            type="email"
            placeholder="billing@instance.cloud"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="mb-4"
          />
          <p className="text-xs text-muted-foreground mb-4">
            Invoices will be sent to this address via Stripe
          </p>
          <Button onClick={handleSetup} disabled={billingLoading} className="w-full">
            {billingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Powered by Stripe</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Billing Email</p>
              <p className="font-medium">{billingEmail}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { setEditEmail(billingEmail || ""); setEditOpen(true); }}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <Badge>Starter</Badge>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Next Billing Date</p>
            <p className="font-medium">01 March 2026</p>
          </div>

          <Button asChild variant="outline" className="w-full mt-4">
            <a href="https://billing.stripe.com" target="_blank" rel="noopener noreferrer">
              Manage subscription
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Invoices</h3>
        <p className="text-muted-foreground text-center py-8">No invoices yet</p>
      </Card>

      {/* Edit Email Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Billing Email</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="billing@instance.cloud"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateEmail}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Need to import zod for tab schema
import { z } from "zod";
