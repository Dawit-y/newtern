"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Eye,
  Check,
  Star,
  Calendar,
  FileText,
  Search,
  DownloadCloud,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const evaluationData = [
  {
    internshipId: 1,
    internshipName: "Frontend Developer Intern",
    interns: [
      {
        internId: "intern-1",
        name: "Sarah Chen",
        avatar: "SC",
        submissions: [
          {
            submissionId: "sub-1",
            taskId: "task-1",
            taskName: "Create Landing Page Design",
            taskDescription:
              "Design a modern landing page for our new product launch",
            submittedAt: "Nov 18, 2024",
            status: "SUBMITTED",
            textContent: null,
            fileUrl: "landing-page-design.pdf",
            url: null,
            evaluation: null,
          },
          {
            submissionId: "sub-2",
            taskId: "task-2",
            taskName: "Build Contact Form",
            taskDescription: "Create a functional contact form with validation",
            submittedAt: "Nov 15, 2024",
            status: "SUBMITTED",
            textContent: null,
            fileUrl: "contact-form.zip",
            url: null,
            evaluation: {
              score: 88,
              feedback:
                "Great implementation! Consider adding email notifications.",
              evaluatedAt: "Nov 16, 2024",
            },
          },
        ],
      },
      {
        internId: "intern-2",
        name: "Mike Johnson",
        avatar: "MJ",
        submissions: [
          {
            submissionId: "sub-3",
            taskId: "task-1",
            taskName: "Create Landing Page Design",
            taskDescription:
              "Design a modern landing page for our new product launch",
            submittedAt: "Nov 17, 2024",
            status: "SUBMITTED",
            textContent: null,
            fileUrl: "landing-page-v2.pdf",
            url: "https://landingpage-mike.vercel.app",
            evaluation: {
              score: 92,
              feedback:
                "Excellent work! The design is clean and responsive. Perfect implementation.",
              evaluatedAt: "Nov 18, 2024",
            },
          },
        ],
      },
    ],
  },
  {
    internshipId: 2,
    internshipName: "Data Analyst Intern",
    interns: [
      {
        internId: "intern-3",
        name: "Alex Rodriguez",
        avatar: "AR",
        submissions: [
          {
            submissionId: "sub-4",
            taskId: "task-4",
            taskName: "Data Analysis Report",
            taskDescription:
              "Analyze customer behavior data and create insights report",
            submittedAt: "Nov 19, 2024",
            status: "SUBMITTED",
            textContent:
              "The analysis reveals three key customer segments with distinct purchasing patterns...",
            fileUrl: "analysis-report.xlsx",
            url: null,
            evaluation: null,
          },
        ],
      },
    ],
  },
];

type Submission = (typeof evaluationData)[0]["interns"][0]["submissions"][0];
type Evaluation = {
  score: number;
  feedback: string;
};

type EvaluationDialogProps = {
  submission: Submission;
  isOpen: boolean;
  onClose: () => void;
  onSave: (evaluation: { score: number; feedback: string }) => void;
};

function EvaluationDialog({
  submission,
  isOpen,
  onClose,
  onSave,
}: EvaluationDialogProps) {
  const [score, setScore] = useState(submission?.evaluation?.score ?? 50);
  const [feedback, setFeedback] = useState(
    submission?.evaluation?.feedback ?? "",
  );

  const handleSave = () => {
    onSave({ score, feedback });
    setScore(50);
    setFeedback("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Evaluate Submission</DialogTitle>
          <DialogDescription>
            Score this submission out of 100 and provide feedback
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Score</Label>
              <div className="flex items-center gap-2">
                <div className="text-primary text-3xl font-bold">{score}</div>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>
            <Slider
              value={[score]}
              onValueChange={(value) => setScore(value[0] ?? 0)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>0 - Poor</span>
              <span>50 - Average</span>
              <span>100 - Excellent</span>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-base font-semibold">
              Feedback
            </Label>
            <Textarea
              id="feedback"
              placeholder="Provide constructive feedback on this submission..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-muted-foreground text-xs">
              {feedback.length}/500 characters
            </p>
          </div>

          {/* Score Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <Card
              className={
                score >= 80
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : ""
              }
            >
              <CardContent className="pt-4 text-center">
                <div className="text-sm font-medium">Excellent</div>
                <div className="text-muted-foreground text-xs">80-100</div>
              </CardContent>
            </Card>
            <Card
              className={
                score >= 60 && score < 80
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                  : ""
              }
            >
              <CardContent className="pt-4 text-center">
                <div className="text-sm font-medium">Good</div>
                <div className="text-muted-foreground text-xs">60-79</div>
              </CardContent>
            </Card>
            <Card
              className={
                score < 60 ? "border-red-500 bg-red-50 dark:bg-red-950/20" : ""
              }
            >
              <CardContent className="pt-4 text-center">
                <div className="text-sm font-medium">Needs Work</div>
                <div className="text-muted-foreground text-xs">0-59</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              Save Evaluation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EvaluationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isEvalDialogOpen, setIsEvalDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleEvaluationSave = (evaluation: Evaluation) => {
    console.log(
      "Evaluation saved:",
      evaluation,
      "for submission:",
      selectedSubmission,
    );
    setIsEvalDialogOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "SUBMITTED" ? "secondary" : "outline";
  };

  const getStatusIcon = (status: string) => {
    return status === "SUBMITTED" ? (
      <AlertCircle className="h-4 w-4" />
    ) : (
      <CheckCircle2 className="h-4 w-4" />
    );
  };

  const stats = {
    totalSubmissions: evaluationData.reduce(
      (sum, internship) =>
        sum +
        internship.interns.reduce(
          (iSum, intern) => iSum + intern.submissions.length,
          0,
        ),
      0,
    ),
    pending: evaluationData.reduce(
      (sum, internship) =>
        sum +
        internship.interns.reduce(
          (iSum, intern) =>
            iSum +
            intern.submissions.filter((s: Submission) => !s.evaluation).length,
          0,
        ),
      0,
    ),
    evaluated: evaluationData.reduce(
      (sum, internship) =>
        sum +
        internship.interns.reduce(
          (iSum, intern) =>
            iSum +
            intern.submissions.filter((s: Submission) => s.evaluation).length,
          0,
        ),
      0,
    ),
  };

  const filteredData = evaluationData
    .map((internship) => ({
      ...internship,
      interns: internship.interns
        .map((intern) => ({
          ...intern,
          submissions: intern.submissions.filter((sub: Submission) => {
            const matchesSearch =
              intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              internship.internshipName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              sub.taskName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
              statusFilter === "all" ||
              (statusFilter === "pending" && !sub.evaluation) ||
              (statusFilter === "evaluated" && sub.evaluation);
            return matchesSearch && matchesStatus;
          }),
        }))
        .filter((intern) => intern.submissions.length > 0),
    }))
    .filter((internship) => internship.interns.length > 0);

  return (
    <>
      <>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
              <p className="text-muted-foreground">
                Review and evaluate submitted tasks from interns
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Submissions
                </CardTitle>
                <FileText className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalSubmissions}
                </div>
                <p className="text-muted-foreground text-xs">All submissions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Evaluation
                </CardTitle>
                <Clock className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <p className="text-muted-foreground text-xs">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluated</CardTitle>
                <Check className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.evaluated}
                </div>
                <p className="text-muted-foreground text-xs">
                  Already reviewed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Search by intern, task, or internship..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="evaluated">Evaluated</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Submissions Grouped by Internship and Intern */}
          <div className="space-y-6">
            {filteredData.map((internship) => (
              <Card key={internship.internshipId}>
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="text-primary h-5 w-5" />
                        {internship.internshipName}
                      </CardTitle>
                    </div>
                    <Badge variant="outline">
                      {internship.interns.reduce(
                        (sum, i) => sum + i.submissions.length,
                        0,
                      )}{" "}
                      submissions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {internship.interns.map((intern) => (
                      <div
                        key={intern.internId}
                        className="border-b last:border-b-0"
                      >
                        {/* Intern Header */}
                        <div className="bg-background/50 flex items-center gap-4 p-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {intern.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{intern.name}</h4>
                            <p className="text-muted-foreground text-sm">
                              {intern.submissions.length} submission
                              {intern.submissions.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>

                        {/* Submissions */}
                        <div className="space-y-3 p-4">
                          {intern.submissions.map((submission) => (
                            <Card
                              key={submission.submissionId}
                              className="border-l-primary/50 border-l-4"
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-3">
                                    {/* Task Info */}
                                    <div>
                                      <h5 className="font-semibold">
                                        {submission.taskName}
                                      </h5>
                                      <p className="text-muted-foreground text-sm">
                                        {submission.taskDescription}
                                      </p>
                                    </div>

                                    {/* Submission Details */}
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                      <div className="space-y-1">
                                        <Label className="text-muted-foreground text-xs font-medium">
                                          Status
                                        </Label>
                                        <Badge
                                          variant={getStatusBadgeVariant(
                                            submission.status,
                                          )}
                                          className="w-fit"
                                        >
                                          {getStatusIcon(submission.status)}
                                          <span className="ml-1">
                                            {submission.status}
                                          </span>
                                        </Badge>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-muted-foreground text-xs font-medium">
                                          Submitted
                                        </Label>
                                        <div className="flex items-center gap-1 text-sm">
                                          <Calendar className="text-muted-foreground h-3 w-3" />
                                          {submission.submittedAt}
                                        </div>
                                      </div>

                                      {/* Submission Type Indicators */}
                                      <div className="space-y-1">
                                        <Label className="text-muted-foreground text-xs font-medium">
                                          Content Type
                                        </Label>
                                        <div className="flex gap-1">
                                          {submission.fileUrl && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              <DownloadCloud className="mr-1 h-3 w-3" />
                                              File
                                            </Badge>
                                          )}
                                          {submission.url && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              <Copy className="mr-1 h-3 w-3" />
                                              Link
                                            </Badge>
                                          )}
                                          {submission.textContent && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              <FileText className="mr-1 h-3 w-3" />
                                              Text
                                            </Badge>
                                          )}
                                        </div>
                                      </div>

                                      {/* Score Display */}
                                      <div className="space-y-1">
                                        <Label className="text-muted-foreground text-xs font-medium">
                                          Score
                                        </Label>
                                        {submission.evaluation ? (
                                          <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                              <span className="font-semibold">
                                                {submission.evaluation.score}
                                              </span>
                                            </div>
                                            <span className="text-muted-foreground">
                                              /100
                                            </span>
                                          </div>
                                        ) : (
                                          <Badge variant="secondary">
                                            Not scored
                                          </Badge>
                                        )}
                                      </div>
                                    </div>

                                    {/* Existing Evaluation */}
                                    {submission.evaluation && (
                                      <div className="mt-3 space-y-2 border-t pt-3">
                                        <div className="space-y-1">
                                          <Label className="text-muted-foreground text-xs font-medium">
                                            Feedback
                                          </Label>
                                          <p className="text-foreground text-sm">
                                            {submission.evaluation.feedback}
                                          </p>
                                        </div>
                                        <div className="text-muted-foreground text-xs">
                                          Evaluated on{" "}
                                          {submission.evaluation.evaluatedAt}
                                        </div>
                                      </div>
                                    )}

                                    {/* Text Content Preview */}
                                    {submission.textContent && (
                                      <div className="mt-3 space-y-1 border-t pt-3">
                                        <Label className="text-muted-foreground text-xs font-medium">
                                          Submission Content
                                        </Label>
                                        <p className="text-foreground line-clamp-2 text-sm">
                                          {submission.textContent}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-col gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedSubmission(submission);
                                        setIsEvalDialogOpen(true);
                                      }}
                                    >
                                      <Star className="h-4 w-4" />
                                    </Button>
                                    {submission.fileUrl || submission.url ? (
                                      <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    ) : null}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredData.length === 0 && (
              <Card className="py-12 text-center">
                <CardContent className="space-y-3">
                  <AlertCircle className="text-muted-foreground mx-auto h-12 w-12" />
                  <div>
                    <h3 className="font-semibold">No submissions found</h3>
                    <p className="text-muted-foreground text-sm">
                      Try adjusting your search or filters to find submissions
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Evaluation Dialog */}
          {selectedSubmission && (
            <EvaluationDialog
              submission={selectedSubmission}
              isOpen={isEvalDialogOpen}
              onClose={() => setIsEvalDialogOpen(false)}
              onSave={handleEvaluationSave}
            />
          )}
        </div>
      </>
    </>
  );
}
