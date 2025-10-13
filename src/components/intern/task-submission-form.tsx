"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, LinkIcon, FileText, X, Plus, Loader2 } from "lucide-react";

interface Task {
  id: number;
  title: string;
  submissionType: string[];
}

interface TaskSubmissionFormProps {
  task: Task;
  onClose: () => void;
  onSubmit: (data: SubmissionData) => void;
}

interface SubmissionData {
  taskId: number;
  files?: File[];
  urls?: string[];
  text?: string;
}

export default function TaskSubmissionForm({
  task,
  onClose,
  onSubmit,
}: TaskSubmissionFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([""]);
  const [textSubmission, setTextSubmission] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const addUrl = () => {
    setUrls([...urls, ""]);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const submissionData: SubmissionData = {
      taskId: task.id,
      files: files.length > 0 ? files : undefined,
      urls:
        urls.filter((url) => url.trim() !== "").length > 0
          ? urls.filter((url) => url.trim() !== "")
          : undefined,
      text: textSubmission.trim() !== "" ? textSubmission : undefined,
    };

    onSubmit(submissionData);
    setIsSubmitting(false);
  };

  const canSubmit =
    files.length > 0 ||
    urls.some((url) => url.trim() !== "") ||
    textSubmission.trim() !== "";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Task: {task.title}</DialogTitle>
          <DialogDescription>
            Upload your work and provide any necessary information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload */}
          {task.submissionType.includes("file") && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </Label>
              <div className="border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                <Upload className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary text-sm hover:underline">
                    Click to upload
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {" "}
                    or drag and drop
                  </span>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png"
                  />
                </Label>
                <p className="text-muted-foreground mt-2 text-xs">
                  PDF, DOC, ZIP, or images up to 10MB each
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                        <span className="truncate text-sm">{file.name}</span>
                        <span className="text-muted-foreground shrink-0 text-xs">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* URL Links */}
          {task.submissionType.includes("url") && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Project Links
              </Label>
              <div className="space-y-2">
                {urls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="https://github.com/your-repo or https://your-deployment.com"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      className="flex-1"
                    />
                    {urls.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeUrl(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addUrl}
                className="w-full bg-transparent"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Link
              </Button>
            </div>
          )}

          {/* Text Submission */}
          {task.submissionType.includes("text") && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Written Response
              </Label>
              <Textarea
                placeholder="Describe your approach, challenges faced, and what you learned..."
                value={textSubmission}
                onChange={(e) => setTextSubmission(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Task"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
