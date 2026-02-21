"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Search, HelpCircle, BookOpen, Ticket, MessageCircle, FileText, 
  Video, HelpCircle as QuestionIcon, Phone, Mail, ExternalLink, ArrowRight,
  CheckCircle2, Clock, Star, ChevronRight, Send, Paperclip, X,
  Zap, CreditCard, Users, Shield, Key, Building2, Wallet, Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Section = "knowledge" | "tickets" | "chat" | "docs" | "videos" | "faq" | "contact";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created: string;
  updated: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  views: number;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const knowledgeBaseArticles: Article[] = [
  { id: "1", title: "Getting Started with Instance Cloud", excerpt: "Learn the basics of setting up your account and making your first transaction.", category: "Getting Started", views: 1250 },
  { id: "2", title: "How to Create a Payment", excerpt: "Step-by-step guide to creating and sending payments to other accounts.", category: "Payments", views: 980 },
  { id: "3", title: "Managing Corporate Cards", excerpt: "Learn how to issue, manage, and control corporate card spending.", category: "Cards", views: 756 },
  { id: "4", title: "Understanding KYC Requirements", excerpt: "Complete guide to identity verification and compliance requirements.", category: "Compliance", views: 654 },
  { id: "5", title: "API Authentication Guide", excerpt: "How to authenticate and make API calls to integrate with our services.", category: "API", views: 543 },
  { id: "6", title: "Setting Up Webhooks", excerpt: "Configure webhooks to receive real-time notifications about account events.", category: "API", views: 432 },
];

const faqData: FAQ[] = [
  { question: "How do I reset my password?", answer: "Go to Settings > Security > Reset Password. You'll receive an email with a reset link.", category: "Account" },
  { question: "What payment methods are supported?", answer: "We support bank transfers, SWIFT, and local currency payments in USD, EUR, GBP, and AED.", category: "Payments" },
  { question: "How long do transfers take?", answer: "Local transfers typically complete within 1-2 business days. International transfers may take 3-5 business days.", category: "Payments" },
  { question: "Can I issue virtual cards?", answer: "Yes, you can issue both physical and virtual corporate cards from the Cards section.", category: "Cards" },
  { question: "What is the KYC process?", answer: "KYC (Know Your Customer) is a mandatory verification process. Submit your business documents and identity proof through Settings > Compliance.", category: "Compliance" },
  { question: "How do I invite team members?", answer: "Go to Settings > Team > Invite Member. Enter their email and assign a role (Admin, Manager, or Viewer).", category: "Account" },
];

const popularTopics = [
  { name: "Getting Started", icon: Zap, color: "bg-blue-100 text-blue-600" },
  { name: "Payments", icon: CreditCard, color: "bg-green-100 text-green-600" },
  { name: "Accounts", icon: Building2, color: "bg-purple-100 text-purple-600" },
  { name: "Corporate Cards", icon: CreditCard, color: "bg-orange-100 text-orange-600" },
  { name: "KYC & Compliance", icon: Shield, color: "bg-red-100 text-red-600" },
  { name: "API Documentation", icon: Key, color: "bg-gray-100 text-gray-600" },
];

const categories = [
  { name: "Getting Started", icon: Zap, count: 12, color: "bg-blue-50 border-blue-200" },
  { name: "Payments", icon: CreditCard, count: 24, color: "bg-green-50 border-green-200" },
  { name: "Accounts", icon: Building2, count: 18, color: "bg-purple-50 border-purple-200" },
  { name: "Corporate Cards", icon: CreditCard, count: 14, color: "bg-orange-50 border-orange-200" },
  { name: "KYC & Security", icon: Shield, count: 20, color: "bg-red-50 border-red-200" },
  { name: "Contact & Support", icon: Phone, count: 8, color: "bg-gray-50 border-gray-200" },
];

const mostViewedArticles = [
  { title: "How to Create a Payment", helpful: 95, views: 248, rating: 5 },
  { title: "Understanding Your Account Balance", helpful: 92, views: 156, rating: 5 },
  { title: "Setting Up Corporate Cards", helpful: 88, views: 198, rating: 4 },
  { title: "Troubleshooting Transaction Errors", helpful: 94, views: 312, rating: 5 },
  { title: "KYC Documentation Requirements", helpful: 87, views: 145, rating: 4 },
];

const tickets: Ticket[] = [
  { id: "TKT-001", subject: "Unable to process international transfer", status: "open", priority: "high", created: "2026-02-20", updated: "2026-02-21" },
  { id: "TKT-002", subject: "Question about API rate limits", status: "pending", priority: "medium", created: "2026-02-19", updated: "2026-02-20" },
  { id: "TKT-003", subject: "Card delivery issue", status: "resolved", priority: "low", created: "2026-02-15", updated: "2026-02-18" },
];

export default function HelpPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("knowledge");
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketPriority, setTicketPriority] = useState("medium");
  const [chatMessage, setChatMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hello! I'm here to help. What questions do you have?" }
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
    }
  };

  const handleCreateTicket = () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Support ticket created successfully");
    setTicketSubject("");
    setTicketDescription("");
    setActiveSection("tickets");
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages([...chatMessages, { from: "user", text: chatMessage }]);
    setChatMessage("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: "bot", text: "Thanks for your message! A support agent will be with you shortly." }]);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "resolved": return "bg-green-100 text-green-700";
      case "closed": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700";
      case "high": return "bg-orange-100 text-orange-700";
      case "medium": return "bg-blue-100 text-blue-700";
      case "low": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const navItems = [
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "tickets", label: "Support Tickets", icon: Ticket },
    { id: "chat", label: "Live Chat", icon: MessageCircle },
    { id: "docs", label: "Documentation", icon: FileText },
    { id: "videos", label: "Video Tutorials", icon: Video },
    { id: "faq", label: "FAQ", icon: QuestionIcon },
    { id: "contact", label: "Contact Support", icon: Phone },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers, get support, and learn how to use Instance Cloud
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Left Sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as Section)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeSection === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Need More Help?</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveSection("contact")}>
                <Mail className="h-4 w-4" />
                Email Support
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setChatOpen(true)}>
                <MessageCircle className="h-4 w-4" />
                Live Chat
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Knowledge Base */}
          {activeSection === "knowledge" && (
            <div className="space-y-6">
              {/* Hero Search */}
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">How can we help you?</h2>
                  <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search articles, FAQs, features..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-base"
                      />
                      <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2">
                        Search
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Popular Topics */}
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">Popular Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTopics.map((topic) => (
                      <button
                        key={topic.name}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border hover:bg-muted transition-colors text-sm"
                      >
                        <topic.icon className={cn("h-4 w-4", topic.color.replace("bg-", "text-"))} />
                        {topic.name}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Articles Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {knowledgeBaseArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs">{article.category}</Badge>
                            <h4 className="font-medium">{article.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{article.views.toLocaleString()} views</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Browse by Category */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Browse Articles by Category</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {categories.map((cat) => (
                    <Card key={cat.name} className={cn("hover:shadow-md transition-shadow cursor-pointer border-2", cat.color)}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", cat.color.replace("border-", "bg-").replace("50", "100"))}>
                          <cat.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">{cat.name}</h4>
                          <p className="text-sm text-muted-foreground">{cat.count} articles</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Most Viewed Articles */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Most Helpful Articles</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {mostViewedArticles.map((article, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-muted-foreground">{i + 1}.</span>
                              <h4 className="font-medium">{article.title}</h4>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <Star key={j} className={cn("h-3 w-3", j < article.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                                ))}
                              </div>
                              <span className="text-muted-foreground">({article.views} views, {article.helpful}% helpful)</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Support Tickets */}
          {activeSection === "tickets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Support Tickets</h2>
                  <p className="text-muted-foreground">Create and manage your support requests</p>
                </div>
                <Button>
                  <Ticket className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </div>

              {/* Create Ticket Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Ticket</CardTitle>
                  <CardDescription>Submit a support request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input 
                        placeholder="Brief description of your issue" 
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      placeholder="Provide detailed information about your issue..." 
                      rows={4}
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </Button>
                    <Button onClick={handleCreateTicket}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets List */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                          </div>
                          <p className="font-medium">{ticket.subject}</p>
                          <p className="text-sm text-muted-foreground">Created: {ticket.created} • Updated: {ticket.updated}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Live Chat */}
          {activeSection === "chat" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Live Chat</h2>
                <p className="text-muted-foreground">Chat with our support team in real-time</p>
              </div>

              <Card className="h-[500px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                      <div>
                        <CardTitle className="text-base">Support Chat</CardTitle>
                        <CardDescription>Available now</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Online</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      msg.from === "bot" ? "bg-muted" : "bg-primary text-primary-foreground ml-auto"
                    )}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  ))}
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Documentation */}
          {activeSection === "docs" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Documentation</h2>
                <p className="text-muted-foreground">Technical documentation and integration guides</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Key className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">API Reference</h4>
                        <p className="text-sm text-muted-foreground">Complete API documentation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Authentication Guide</h4>
                        <p className="text-sm text-muted-foreground">Secure your API calls</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Webhooks</h4>
                        <p className="text-sm text-muted-foreground">Real-time event notifications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Integration Guides</h4>
                        <p className="text-sm text-muted-foreground">Step-by-step tutorials</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Video Tutorials */}
          {activeSection === "videos" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Video Tutorials</h2>
                <p className="text-muted-foreground">Watch step-by-step guides</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium">Getting Started</h4>
                    <p className="text-sm text-muted-foreground">Learn the basics of Instance Cloud</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium">Creating Payments</h4>
                    <p className="text-sm text-muted-foreground">How to send payments</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium">Managing Cards</h4>
                    <p className="text-sm text-muted-foreground">Issue and control corporate cards</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium">API Integration</h4>
                    <p className="text-sm text-muted-foreground">Connect with our API</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeSection === "faq" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Quick answers to common questions</p>
              </div>

              <div className="space-y-4">
                {faqData.map((faq, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <QuestionIcon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <CardTitle className="text-base">{faq.question}</CardTitle>
                          <Badge variant="outline" className="mt-2">{faq.category}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support */}
          {activeSection === "contact" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Contact Support</h2>
                <p className="text-muted-foreground">Get in touch with our team</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-sm text-muted-foreground mt-1">support@instance.cloud</p>
                    <p className="text-xs text-muted-foreground mt-2">Response in 24h</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold">Live Chat</h4>
                    <p className="text-sm text-muted-foreground mt-1">Available 24/7</p>
                    <Button className="mt-4" onClick={() => setChatOpen(true)}>Start Chat</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-sm text-muted-foreground mt-1">+1 (555) 123-4567</p>
                    <p className="text-xs text-muted-foreground mt-2">Mon-Fri 9am-6pm</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>We'll get back to you as soon as possible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input placeholder="your@email.com" type="email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Describe your issue..." rows={5} />
                  </div>
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Chat Widget (Floating) */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-background border rounded-xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-semibold">Live Chat</span>
            </div>
            <button onClick={() => setChatOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={cn(
                "max-w-[85%] rounded-lg p-3 text-sm",
                msg.from === "bot" ? "bg-muted" : "bg-primary text-primary-foreground ml-auto"
              )}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button (when closed) */}
      {!chatOpen && (
        <Button
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
          onClick={() => setChatOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
