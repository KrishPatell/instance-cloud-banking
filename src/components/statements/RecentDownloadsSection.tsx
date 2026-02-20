"use client";

import * as React from "react";
import { FileText, ChevronDown, ChevronUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StatementDownload } from "@/types/statements";

interface RecentDownloadsSectionProps {
  downloads: StatementDownload[];
}

export function RecentDownloadsSection({ downloads }: RecentDownloadsSectionProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const recentDownloads = downloads.slice(0, 5);

  return (
    <div className="border rounded-lg p-4 mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full hover:text-foreground text-left"
      >
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
        <span className="font-medium">Recent Downloads</span>
        <span className="text-muted-foreground text-sm">({recentDownloads.length})</span>
      </button>
      
      {isOpen && (
        <div className="mt-3 space-y-3">
          {recentDownloads.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              No recent downloads
            </p>
          ) : (
            recentDownloads.map((download) => (
              <div
                key={download.id}
                className="flex items-start gap-3 border-b border-border pb-3 last:border-0"
              >
                <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{download.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    Generated: {new Date(download.generatedAt).toLocaleDateString()} at{' '}
                    {new Date(download.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
                <button className="text-primary text-sm hover:underline">
                  Download again
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
