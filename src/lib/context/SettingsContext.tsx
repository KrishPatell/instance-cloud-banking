"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface NotificationSettings {
  email: boolean;
  paymentConfirm: boolean;
  failedAlert: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Viewer";
  status: "Active" | "Invited" | "Suspended";
  avatar: string;
}

export interface AppPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  dateFormat: string;
  currencyDisplay: string;
  notifications: NotificationSettings;
}

interface SettingsContextType {
  appPreferences: AppPreferences;
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
  billingEmail: string | null;
  billingSetup: boolean;
  setBillingEmail: (email: string) => void;
  setBillingSetup: (setup: boolean) => void;
  teamMembers: TeamMember[];
  updateTeamMember: (id: number, updates: Partial<TeamMember>) => void;
  removeMember: (id: number) => void;
  addTeamMember: (member: TeamMember) => void;
}

const defaultPreferences: AppPreferences = {
  theme: "light",
  language: "en",
  timezone: "UTC",
  dateFormat: "DD/MM/YYYY",
  currencyDisplay: "symbol",
  notifications: {
    email: true,
    paymentConfirm: true,
    failedAlert: true,
    weeklyDigest: true,
    securityAlerts: true,
  },
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [appPreferences, setAppPreferences] = useState<AppPreferences>(defaultPreferences);
  const [billingEmail, setBillingEmail] = useState<string | null>(null);
  const [billingSetup, setBillingSetup] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: "Krish Patel", email: "krish@instance.cloud", role: "Admin", status: "Active", avatar: "🔵" },
    { id: 2, name: "Alice Manager", email: "alice@instance.cloud", role: "Manager", status: "Active", avatar: "🟢" },
    { id: 3, name: "Bob Developer", email: "bob@instance.cloud", role: "Manager", status: "Active", avatar: "🟡" },
    { id: 4, name: "Diana Viewer", email: "diana@instance.cloud", role: "Viewer", status: "Invited", avatar: "🟣" },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("appPreferences");
      if (saved) {
        setAppPreferences(JSON.parse(saved));
      }
      const savedBilling = localStorage.getItem("billingEmail");
      if (savedBilling) {
        setBillingEmail(savedBilling);
        setBillingSetup(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("appPreferences", JSON.stringify(appPreferences));
    }
  }, [appPreferences]);

  useEffect(() => {
    if (typeof window !== "undefined" && billingEmail) {
      localStorage.setItem("billingEmail", billingEmail);
    }
  }, [billingEmail]);

  const updatePreferences = (prefs: Partial<AppPreferences>) => {
    setAppPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const updateTeamMember = (id: number, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const removeMember = (id: number) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addTeamMember = (member: TeamMember) => {
    setTeamMembers((prev) => [...prev, member]);
  };

  return (
    <SettingsContext.Provider
      value={{
        appPreferences,
        updatePreferences,
        billingEmail,
        billingSetup,
        setBillingEmail,
        setBillingSetup,
        teamMembers,
        updateTeamMember,
        removeMember,
        addTeamMember,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
