"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Search, Filter, Download, Plus, Eye, CheckCircle, XCircle, Clock,
  AlertTriangle, ChevronRight, MoreVertical, FileText, User, Building2,
  Shield, Upload, Check, X, RefreshCw, Printer, UserCheck, Users,
  ArrowUpDown, Bell, Mail, Phone, Globe, MapPin, Calendar, TrendingUp,
  Briefcase, DollarSign, Building, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type KYCStatus = "pending" | "in_review" | "approved" | "rejected" | "expired";
type KYCTYPE = "simplified" | "standard" | "enhanced";
type RiskTier = "low" | "medium" | "high" | "critical";

interface KYCClient {
  id: string;
  name: string;
  customerId: string;
  email: string;
  phone: string;
  type: KYCTYPE;
  status: KYCStatus;
  riskTier: RiskTier;
  riskScore: number;
  submittedDate: string;
  daysPending: number;
  progress: number;
  industry: string;
  country: string;
  registrationNumber: string;
  currencies: string[];
}

const kycClients: KYCClient[] = [
  { id: "1", name: "Acme Corp Industries", customerId: "CUST-2024-0847", email: "john@acmecorp.com", phone: "+1 (555) 234-5678", type: "standard", status: "pending", riskTier: "high", riskScore: 6.8, submittedDate: "2026-02-10", daysPending: 11, progress: 65, industry: "Manufacturing", country: "United States", registrationNumber: "123456789", currencies: ["USD", "EUR"] },
  { id: "2", name: "TechFlow Solutions", customerId: "CUST-2024-0848", email: "sarah@techflow.io", phone: "+1 (555) 345-6789", type: "enhanced", status: "in_review", riskTier: "medium", riskScore: 4.5, submittedDate: "2026-02-15", daysPending: 6, progress: 80, industry: "Technology", country: "United Kingdom", registrationNumber: "987654321", currencies: ["USD", "EUR", "GBP"] },
  { id: "3", name: "Global Trade Partners", customerId: "CUST-2024-0849", email: "mike@globaltrade.com", phone: "+1 (555) 456-7890", type: "standard", status: "pending", riskTier: "low", riskScore: 2.1, submittedDate: "2026-02-18", daysPending: 3, progress: 45, industry: "Trading", country: "Germany", registrationNumber: "456789123", currencies: ["USD", "EUR"] },
  { id: "4", name: "Swift Logistics Ltd", customerId: "CUST-2024-0850", email: "info@swiftlogistics.co", phone: "+1 (555) 567-8901", type: "simplified", status: "approved", riskTier: "low", riskScore: 1.8, submittedDate: "2026-02-01", daysPending: 0, progress: 100, industry: "Logistics", country: "Netherlands", registrationNumber: "789123456", currencies: ["EUR"] },
  { id: "5", name: "Prime Ventures", customerId: "CUST-2024-0851", email: "admin@primeventures.io", phone: "+1 (555) 678-9012", type: "enhanced", status: "rejected", riskTier: "critical", riskScore: 9.2, submittedDate: "2026-01-20", daysPending: 0, progress: 100, industry: "Finance", country: "Cayman Islands", registrationNumber: "321654987", currencies: ["USD"] },
  { id: "6", name: "Atlas Construction", customerId: "CUST-2024-0852", email: "contact@atlasconstruction.com", phone: "+1 (555) 789-0123", type: "standard", status: "pending", riskTier: "medium", riskScore: 5.2, submittedDate: "2026-02-19", daysPending: 2, progress: 30, industry: "Construction", country: "United Arab Emirates", registrationNumber: "654987321", currencies: ["USD", "AED"] },
  { id: "7", name: "BlueWave Maritime", customerId: "CUST-2024-0853", email: "ops@bluewave.ship", phone: "+1 (555) 890-1234", type: "enhanced", status: "in_review", riskTier: "high", riskScore: 7.5, submittedDate: "2026-02-12", daysPending: 9, progress: 75, industry: "Shipping", country: "Panama", registrationNumber: "963852741", currencies: ["USD"] },
  { id: "8", name: "Green Energy Co", customerId: "CUST-2024-0854", email: "hello@greenenergy.co", phone: "+1 (555) 901-2345", type: "simplified", status: "expired", riskTier: "low", riskScore: 2.0, submittedDate: "2025-08-15", daysPending: 0, progress: 100, industry: "Energy", country: "Spain", registrationNumber: "852963741", currencies: ["EUR"] },
];

const getStatusColor = (status: KYCStatus) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "in_review": return "bg-blue-100 text-blue-800";
    case "approved": return "bg-green-100 text-green-800";
    case "rejected": return "bg-red-100 text-red-800";
    case "expired": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getRiskColor = (tier: RiskTier) => {
  switch (tier) {
    case "low": return "bg-green-100 text-green-800";
    case "medium": return "bg-yellow-100 text-yellow-800";
    case "high": return "bg-orange-100 text-orange-800";
    case "critical": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getKycTypeColor = (type: KYCTYPE) => {
  switch (type) {
    case "simplified": return "bg-blue-100 text-blue-800";
    case "standard": return "bg-purple-100 text-purple-800";
    case "enhanced": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function KYCPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<KYCStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<KYCClient | null>(null);

  const filteredClients = kycClients.filter(client => {
    const matchesTab = activeTab === "pending" ? client.status === "pending" : 
                      activeTab === "in_review" ? client.status === "in_review" :
                      activeTab === "approved" ? client.status === "approved" :
                      activeTab === "rejected" ? client.status === "rejected" :
                      activeTab === "expired" ? client.status === "expired" : true;
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "all" || client.riskTier === riskFilter;
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    return matchesTab && matchesSearch && matchesRisk && matchesType;
  });

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const handleSelectClient = (id: string) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter(c => c !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  const getCounts = () => {
    return {
      pending: kycClients.filter(c => c.status === "pending").length,
      in_review: kycClients.filter(c => c.status === "in_review").length,
      approved: kycClients.filter(c => c.status === "approved").length,
      rejected: kycClients.filter(c => c.status === "rejected").length,
      expired: kycClients.filter(c => c.status === "expired").length,
    };
  };

  const counts = getCounts();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">KYC Management</h1>
          <p className="text-muted-foreground">Verify client identities and manage compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Client
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as KYCStatus)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending" className="gap-2">
            Pending KYC
            <Badge variant="secondary" className="ml-1">{counts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in_review" className="gap-2">
            In Review
            <Badge variant="secondary" className="ml-1">{counts.in_review}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            Approved
            <Badge variant="secondary" className="ml-1">{counts.approved}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            Rejected
            <Badge variant="secondary" className="ml-1">{counts.rejected}</Badge>
          </TabsTrigger>
          <TabsTrigger value="expired" className="gap-2">
            Expired
            <Badge variant="secondary" className="ml-1">{counts.expired}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Find by: Company name, Customer ID, Contact email" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Risk Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Tiers</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="critical">Critical Risk</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="KYC Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="simplified">Simplified</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="enhanced">Enhanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedClients.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <span className="text-sm font-medium">{selectedClients.length} selected</span>
            <Button variant="outline" size="sm">Request Additional Info</Button>
            <Button variant="outline" size="sm">Approve Selected</Button>
            <Button variant="outline" size="sm" className="text-destructive">Reject Selected</Button>
          </div>
        )}

        {/* Data Table */}
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>KYC Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">No KYC applications</h3>
                          <p className="text-muted-foreground">No {activeTab.replace('_', ' ')} KYC applications found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow 
                        key={client.id} 
                        className={cn(
                          client.daysPending > 14 && "bg-red-50",
                          client.daysPending <= 1 && "bg-green-50/50"
                        )}
                      >
                        <TableCell>
                          <Checkbox 
                            checked={selectedClients.includes(client.id)}
                            onCheckedChange={() => handleSelectClient(client.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {client.daysPending <= 1 && (
                              <div className="h-2 w-2 bg-green-500 rounded-full" />
                            )}
                            {client.daysPending > 14 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium">{client.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{client.customerId}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                          <Badge className={getKycTypeColor(client.type)}>
                            {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{client.submittedDate}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "font-medium",
                            client.daysPending > 14 && "text-red-600",
                            client.daysPending > 7 && "text-yellow-600"
                          )}>
                            {client.daysPending} days
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(client.riskTier)}>
                            {client.riskTier.charAt(0).toUpperCase() + client.riskTier.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${client.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{client.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Application
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Request Additional Info
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-background border-b">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedClient(null)}>
                      ← Back
                    </Button>
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {selectedClient.name}
                    <Badge className={getKycTypeColor(selectedClient.type)}>
                      {selectedClient.type.charAt(0).toUpperCase() + selectedClient.type.slice(1)} KYC
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {selectedClient.customerId} • {selectedClient.status === "pending" ? "Pending Review" : 
                     selectedClient.status === "in_review" ? "Under Review" :
                     selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1).replace('_', ' ')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <MoreVertical className="h-4 w-4 mr-2" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Request Additional Info</DropdownMenuItem>
                      <DropdownMenuItem><Clock className="h-4 w-4 mr-2" />Schedule Review Call</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><CheckCircle className="h-4 w-4 mr-2" />Approve Application</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><XCircle className="h-4 w-4 mr-2" />Reject Application</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Download className="h-4 w-4 mr-2" />Download Documents</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Overview Tabs */}
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                  <TabsTrigger value="ubo">UBO</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="risk">Risk</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Client Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Client Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Client Type</span>
                          <span className="font-medium flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Business
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Customer ID</span>
                          <span className="font-mono">{selectedClient.customerId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email</span>
                          <span className="flex items-center gap-2">
                            {selectedClient.email}
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Mail className="h-3 w-3" />
                            </Button>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="flex items-center gap-2">
                            {selectedClient.phone}
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Phone className="h-3 w-3" />
                            </Button>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Country</span>
                          <span className="flex items-center gap-2">
                            {selectedClient.country}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Registration #</span>
                          <span className="font-mono">{selectedClient.registrationNumber}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* KYC Config */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          KYC Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">KYC Type</span>
                          <Badge className={getKycTypeColor(selectedClient.type)}>
                            {selectedClient.type.charAt(0).toUpperCase() + selectedClient.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Risk Tier</span>
                          <Badge className={getRiskColor(selectedClient.riskTier)}>
                            {selectedClient.riskTier.charAt(0).toUpperCase() + selectedClient.riskTier.slice(1)} Risk
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Risk Score</span>
                          <span className="font-bold">{selectedClient.riskScore}/10</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Jurisdiction</span>
                            <span>40%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Industry</span>
                            <span>30%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Ownership</span>
                            <span>20%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Other</span>
                            <span>10%</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Submitted</span>
                          <span className="text-sm">{selectedClient.submittedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expected Review</span>
                          <span className="text-sm">3-5 business days</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Currencies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Approved Currencies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {["USD", "EUR", "GBP", "AED"].map(currency => (
                          <div 
                            key={currency}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg border",
                              selectedClient.currencies.includes(currency) 
                                ? "bg-green-50 border-green-200 text-green-700" 
                                : "bg-muted"
                            )}
                          >
                            {selectedClient.currencies.includes(currency) ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                            {currency}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Business Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Industry</p>
                          <p className="font-medium">{selectedClient.industry}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Annual Revenue</p>
                          <p className="font-medium">USD 50-100M</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Employee Count</p>
                          <p className="font-medium">250-500</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="company" className="mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Legal Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Legal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Legal Entity Name</span>
                          <span className="font-medium">{selectedClient.name} Inc.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Registration Number</span>
                          <span className="font-mono">{selectedClient.registrationNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax ID / VAT</span>
                          <span className="font-mono">98-7654321</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Country</span>
                          <span>{selectedClient.country}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Business Start</span>
                          <span>2008-06-15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Business Type</span>
                          <Badge variant="outline">Corporation</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">PEP Status</span>
                          <Badge className="bg-green-100 text-green-800">No</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Operational Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Operational Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Industry</span>
                          <span>{selectedClient.industry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Annual Revenue</span>
                          <span>USD 50-100M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Employee Count</span>
                          <span>250-500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Primary Activity</span>
                          <span>B2B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Website</span>
                          <a href="#" className="text-primary hover:underline">www.acmecorp.com</a>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Address */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Registered Business Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Address Line 1</label>
                            <Input defaultValue="456 Industrial Way" readOnly />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Address Line 2</label>
                            <Input defaultValue="Suite 200" readOnly />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">City</label>
                            <Input defaultValue="San Francisco" readOnly />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">State / Province</label>
                            <Input defaultValue="California" readOnly />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Postal Code</label>
                            <Input defaultValue="94105" readOnly />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Country</label>
                            <Input defaultValue={selectedClient.country} readOnly />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="ubo" className="mt-4">
                  <div className="space-y-4">
                    {/* UBO Risk */}
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Overall UBO Risk: Low</p>
                          <p className="text-sm text-green-700">No PEP connections detected</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* UBO Table */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Ultimate Beneficial Owners</CardTitle>
                        <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add UBO</Button>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Full Name</TableHead>
                              <TableHead>Ownership</TableHead>
                              <TableHead>Position</TableHead>
                              <TableHead>PEP</TableHead>
                              <TableHead>Nationality</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              { name: "John Smith", ownership: 45, position: "CEO", pep: false, nationality: "United States", status: "verified" },
                              { name: "Sarah Johnson", ownership: 35, position: "Director", pep: false, nationality: "United States", status: "verified" },
                              { name: "Michael Chen", ownership: 20, position: "CFO", pep: false, nationality: "Canada", status: "verified" },
                            ].map((ubo, i) => (
                              <TableRow key={i}>
                                <TableCell className="font-medium">{ubo.name}</TableCell>
                                <TableCell>{ubo.ownership}%</TableCell>
                                <TableCell>{ubo.position}</TableCell>
                                <TableCell>
                                  <Badge className={ubo.pep ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                                    {ubo.pep ? "Yes" : "No"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{ubo.nationality}</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">View</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Documents</CardTitle>
                      <CardDescription>Uploaded KYC documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: "Certificate of Incorporation", status: "verified" },
                          { name: "Proof of Address", status: "verified" },
                          { name: "Director ID Documents", status: "verified" },
                          { name: "UBO Declaration", status: "pending" },
                          { name: "Bank Statement", status: "verified" },
                        ].map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <span>{doc.name}</span>
                            </div>
                            <Badge className={doc.status === "verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {doc.status === "verified" ? "✓ Verified" : "⏳ Pending"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="risk" className="mt-4">
                  <div className="space-y-4">
                    {/* Risk Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Risk Assessment Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-3xl font-bold text-yellow-600">{selectedClient.riskScore}/10</p>
                            <p className="text-sm text-muted-foreground">Risk Score</p>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <Badge className={getRiskColor(selectedClient.riskTier)}>
                              {selectedClient.riskTier.toUpperCase()} RISK
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">Risk Tier</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-lg font-semibold">Standard</p>
                            <p className="text-sm text-muted-foreground">Recommended KYC</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Last Assessed: 2026-02-19 at 09:15 UTC</p>
                          <p>Next Assessment Due: 2026-05-19</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Risk Factors */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Jurisdiction Risk (40%)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-100 text-green-800">Low</Badge>
                            <span className="text-sm text-muted-foreground">3/10</span>
                          </div>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> Strong AML/CFT framework</li>
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> FATF compliant</li>
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> Transparent registry</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Industry Risk (30%)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                            <span className="text-sm text-muted-foreground">5/10</span>
                          </div>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-yellow-600" /> Manufacturing sector</li>
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> Established player</li>
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> 15+ years history</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Ownership Risk (20%)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-100 text-green-800">Low</Badge>
                            <span className="text-sm text-muted-foreground">4/10</span>
                          </div>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> Clear UBO chain</li>
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> No PEP connections</li>
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> No shell company</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Transaction Risk (10%)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-100 text-green-800">Low</Badge>
                            <span className="text-sm text-muted-foreground">3/10</span>
                          </div>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> Commensurate limits</li>
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> Normal patterns</li>
                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-green-600" /> Low volatility</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Compliance Checks */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Regulatory Checks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-3">
                          {[
                            { name: "OFAC Sanctions", status: "clear" },
                            { name: "UN Security Council", status: "clear" },
                            { name: "EU High Risk Countries", status: "clear" },
                            { name: "FATF Grey/Black List", status: "clear" },
                          ].map((check, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                              <span>{check.name}</span>
                              <Badge className="bg-green-100 text-green-800">✓ Clear</Badge>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">Last checked: 2026-02-19 09:15 UTC</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Timeline</CardTitle>
                      <CardDescription>Audit trail of KYC application</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: "Application Submitted", date: selectedClient.submittedDate, user: "System" },
                          { action: "Documents Received", date: selectedClient.submittedDate, user: "System" },
                          { action: "Automated Risk Assessment Completed", date: selectedClient.submittedDate, user: "System" },
                          { action: "Assigned to Compliance Team", date: "2026-02-12", user: "System" },
                          { action: "Under Review", date: "2026-02-15", user: "Sarah Chen" },
                        ].map((event, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-3 w-3 bg-primary rounded-full" />
                              {i < 4 && <div className="w-0.5 h-full bg-muted" />}
                            </div>
                            <div className="pb-4">
                              <p className="font-medium">{event.action}</p>
                              <p className="text-sm text-muted-foreground">
                                {event.date} • {event.user}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
