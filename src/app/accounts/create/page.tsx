"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccounts } from "@/lib/context/AccountsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Building2, Save } from "lucide-react";
import Link from "next/link";
import { Account } from "@/lib/mock-data/accounts";

interface FormErrors {
  name?: string;
  externalId?: string;
  currency?: string;
  accountOwner?: string;
}

export default function CreateAccountPage() {
  const router = useRouter();
  const { addAccount } = useAccounts();

  const [formData, setFormData] = useState({
    name: "",
    externalId: "",
    currency: "USD",
    accountOwner: "",
    wireAccountNumber: "",
    routingNumber: "",
    isPrimary: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Account name is required";
    }

    if (!formData.externalId.trim()) {
      newErrors.externalId = "External ID is required";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.externalId)) {
      newErrors.externalId = "External ID can only contain letters, numbers, hyphens, and underscores";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.accountOwner.trim()) {
      newErrors.accountOwner = "Account owner is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newAccount: Omit<Account, "id"> = {
        name: formData.name.trim(),
        externalId: formData.externalId.trim(),
        currency: formData.currency,
        status: "pending",
        availableBalance: 0,
        currentBalance: 0,
        isPrimary: formData.isPrimary,
        wireAccountNumber: formData.wireAccountNumber.trim(),
        routingNumber: formData.routingNumber.trim(),
        accountOwner: formData.accountOwner.trim(),
      };

      addAccount(newAccount);
      router.push("/accounts");
    } catch (error) {
      console.error("Failed to create account:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/accounts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            Add a new business account to your portfolio.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Account Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., USD Operating Account"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalId">
                  External ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="externalId"
                  placeholder="e.g., ext_usd_001"
                  value={formData.externalId}
                  onChange={(e) => handleInputChange("externalId", e.target.value)}
                  className={errors.externalId ? "border-red-500" : ""}
                />
                {errors.externalId && (
                  <p className="text-sm text-red-500">{errors.externalId}</p>
                )}
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Unique identifier from your banking system
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountOwner">
                  Account Owner <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="accountOwner"
                  placeholder="e.g., Tom Trading"
                  value={formData.accountOwner}
                  onChange={(e) => handleInputChange("accountOwner", e.target.value)}
                  className={errors.accountOwner ? "border-red-500" : ""}
                />
                {errors.accountOwner && (
                  <p className="text-sm text-red-500">{errors.accountOwner}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">
                  Currency <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange("currency", value)}
                >
                  <SelectTrigger id="currency" className={errors.currency ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && <p className="text-sm text-red-500">{errors.currency}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => handleInputChange("isPrimary", checked)}
                />
                <Label htmlFor="isPrimary" className="text-sm font-normal">
                  Set as primary account
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Banking Information */}
          <Card>
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wireAccountNumber">Wire Account Number</Label>
                <Input
                  id="wireAccountNumber"
                  placeholder="e.g., 123456789"
                  value={formData.wireAccountNumber}
                  onChange={(e) => handleInputChange("wireAccountNumber", e.target.value)}
                />
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Can be added later
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  placeholder="e.g., 021000021"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange("routingNumber", e.target.value)}
                />
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="text-sm font-medium mb-2">Note</h4>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Banking information is optional during account creation. You can add wire
                  account and routing numbers once the account is activated.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link href="/accounts">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
