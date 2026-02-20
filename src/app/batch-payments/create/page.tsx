"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { FileDropZone } from "@/components/shared/FileDropZone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateBatchPaymentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (file: File) => {
    setIsSubmitting(true);

    // Simulate upload/processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Reset state and show success
    setIsSubmitting(false);
    setSelectedFile(null);
    
    toast.success("Batch payment submitted", {
      description: `Your file "${file.name}" has been queued for processing.`,
    });

    // Optionally redirect to batch payments list
    // router.push("/batch-payments");
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Upload payment batch file"
        subtitle="Upload a CSV file to process multiple payments at once"
        icon={Layers}
        breadcrumb={{
          label: "Back to Batch Payments",
          href: "/batch-payments",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="pt-6">
            <FileDropZone
              onFileSelect={handleFileSelect}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              maxSizeMB={5}
            />
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-6 flex justify-start">
        <Link href="/batch-payments">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Batch Payments
          </Button>
        </Link>
      </div>
    </div>
  );
}
