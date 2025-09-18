"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { OrderDocument } from "@/types/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Download, File, FileImage, Loader2, Upload } from "lucide-react";

interface DocumentsManagerProps {
  documents: OrderDocument[];
  onUpload?: (files: File[]) => Promise<void> | void;
  onDelete?: (documentId: string) => Promise<void> | void;
}

export function DocumentsManager({ documents, onUpload, onDelete }: DocumentsManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      await onUpload?.(acceptedFiles);
      setIsUploading(false);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const renderPreview = (doc: OrderDocument) => {
    if (doc.file_name.toLowerCase().endsWith(".pdf")) {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-red-100 text-red-600">
          <File className="h-8 w-8" />
        </div>
      );
    }
    if (/(png|jpg|jpeg|gif)$/i.test(doc.file_name)) {
      return <FileImage className="h-20 w-20 text-slate-400" />;
    }
    return <File className="h-10 w-10 text-slate-400" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => console.log("Download all")}> 
          <Download className="mr-2 h-4 w-4" /> Download all
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-primary"
        >
          <input {...getInputProps()} aria-label="Upload documents" />
          {isUploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <Upload className="h-8 w-8 text-slate-400" />}
          <p className="mt-2 text-sm text-slate-600">Drag & drop files or click to upload</p>
          <p className="text-xs text-slate-400">Supports PDF, DOCX, and images up to 25MB.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              {renderPreview(doc)}
              <div className="flex-1">
                <p className="text-sm font-semibold">{doc.file_name}</p>
                <p className="text-xs text-slate-500">
                  {doc.document_type} • {Math.round(doc.file_size / 1024)}KB • Uploaded {format(new Date(doc.uploaded_at), "MMM d, yyyy")}
                </p>
                <div className="mt-2 flex gap-2 text-xs">
                  <Button variant="outline" size="sm" onClick={() => window.open(doc.file_url, "_blank")}>Preview</Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete?.(doc.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
