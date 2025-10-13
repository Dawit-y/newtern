"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  Award,
  Play,
  ChevronRight,
  Building2,
  Target,
  Download,
  ExternalLink,
  Upload,
  LinkIcon,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import TaskSubmissionForm from "@/components/intern/task-submission-form";
import InternshipDetailView from "@/components/intern/internship-detail-view";

// Mock data for the internship
const internshipData = {
  id: 1,
  title: "Frontend Developer Intern",
  company: "TechStart Inc.",
  companyLogo: "/placeholder.svg?height=80&width=80",
  location: "Remote",
  type: "Paid",
  duration: "3 months",
  deadline: "Dec 15, 2024",
  description:
    "Work on real-world React projects and build modern web applications. You'll be part of our frontend team, contributing to our main product and learning from experienced developers.",
  responsibilities: [
    "Develop and maintain React components for our main application",
    "Collaborate with the design team to implement pixel-perfect UI/UX",
    "Write clean, maintainable, and well-documented code",
    "Participate in code reviews and daily standup meetings",
    "Learn and apply modern web development best practices",
    "Debug and troubleshoot issues across different browsers",
    "Contribute to team discussions and brainstorming sessions",
  ],
  requirements: [
    "Currently enrolled in Computer Science or related field",
    "Basic knowledge of React and JavaScript",
    "Understanding of HTML/CSS fundamentals",
    "Familiarity with Git and version control",
    "Good communication skills and team player",
    "Willingness to learn and adapt to new technologies",
    "Ability to work independently and meet deadlines",
  ],
  skills: ["React", "TypeScript", "CSS", "JavaScript", "Git", "Tailwind CSS"],
  tasks: 5,
  applicants: 23,
  salary: "$1,500/month",
  benefits: [
    "Flexible working hours",
    "Remote work opportunity",
    "Mentorship from senior developers",
    "Real-world project experience",
    "Certificate upon completion",
    "Letter of recommendation",
    "Potential for full-time offer",
    "Access to learning resources",
  ],
  aboutCompany:
    "TechStart Inc. is a fast-growing startup focused on building innovative web solutions for modern businesses. We're a team of passionate developers who believe in learning by doing and fostering a collaborative environment.",
  learningOutcomes: [
    "Master React and modern JavaScript frameworks",
    "Build production-ready, scalable web applications",
    "Understand agile development methodologies",
    "Learn to work with RESTful APIs and state management",
    "Gain experience with testing and deployment pipelines",
    "Develop soft skills through team collaboration",
  ],
  // Application status: 'not-applied' | 'pending' | 'rejected' | 'accepted'
  applicationStatus: "rejected" as const, // Change this to test different views
  // If accepted, show workspace data
  workspaceData: {
    status: "active",
    startDate: "Nov 1, 2024",
    endDate: "Feb 1, 2025",
    progress: 60,
    tasksCompleted: 3,
    totalTasks: 5,
    mentor: {
      name: "John Doe",
      role: "Senior Developer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tasks: [
      {
        id: 1,
        title: "Setup Development Environment",
        status: "completed",
        overview:
          "Install required tools and configure your local development environment",
        description:
          "In this task, you'll set up Node.js, VS Code, Git, and clone our project repository. This is essential groundwork for all future tasks.",
        background:
          "A proper development environment is crucial for productivity. We use modern tooling that's standard in the industry.",
        instructions: `1. Install Node.js (version 18 or later)
2. Install Visual Studio Code
3. Install Git and configure your credentials
4. Clone the project repository
5. Run npm install to install dependencies
6. Start the development server with npm run dev
7. Take a screenshot of your running application`,
        resources: [
          {
            type: "link",
            name: "Node.js Installation Guide",
            url: "https://nodejs.org",
          },
          {
            type: "link",
            name: "VS Code Setup",
            url: "https://code.visualstudio.com",
          },
          { type: "document", name: "Project README", url: "#" },
        ],
        submissionType: ["file", "text"],
        submissionInstructions:
          "Submit a screenshot of your running development server and briefly describe any challenges you faced.",
        dueDate: "Nov 5, 2024",
        completedDate: "Nov 4, 2024",
        score: 95,
        feedback: "Excellent setup! Your environment is configured correctly.",
      },
      {
        id: 2,
        title: "Create Component Library",
        status: "completed",
        overview: "Build reusable React components following our design system",
        description:
          "Create a set of reusable UI components including buttons, cards, and form elements that will be used throughout the application.",
        background:
          "Component libraries ensure consistency across the application and make development faster. We follow atomic design principles.",
        instructions: `1. Review the design system documentation
2. Create a components folder structure
3. Build Button component with variants
4. Build Card component
5. Build Input and Form components
6. Add TypeScript types for all props
7. Write basic tests for each component
8. Document usage examples`,
        resources: [
          { type: "document", name: "Design System", url: "#" },
          { type: "link", name: "React Component Patterns", url: "#" },
          { type: "file", name: "Figma Designs", url: "#" },
        ],
        submissionType: ["url", "file"],
        submissionInstructions:
          "Submit a link to your GitHub branch and a video walkthrough of your components in action.",
        dueDate: "Nov 12, 2024",
        completedDate: "Nov 11, 2024",
        score: 88,
        feedback:
          "Great work! Components are well-structured. Consider adding more TypeScript types.",
      },
      {
        id: 3,
        title: "Build User Dashboard",
        status: "completed",
        overview: "Create a responsive dashboard page with data visualization",
        description:
          "Design and implement a user dashboard that displays key metrics, charts, and user information in an intuitive layout.",
        background:
          "Dashboards are critical for user engagement. This task will test your ability to work with data visualization libraries and create responsive layouts.",
        instructions: `1. Study the dashboard mockup
2. Create the page layout structure
3. Implement responsive grid system
4. Integrate chart library (Recharts)
5. Connect to mock API endpoints
6. Add loading states and error handling
7. Implement responsive design for mobile
8. Add smooth transitions and animations`,
        resources: [
          { type: "document", name: "Dashboard Mockup", url: "#" },
          {
            type: "link",
            name: "Recharts Documentation",
            url: "https://recharts.org",
          },
          { type: "document", name: "API Documentation", url: "#" },
        ],
        submissionType: ["url", "file"],
        submissionInstructions:
          "Submit a link to the deployed preview and your pull request.",
        dueDate: "Nov 20, 2024",
        completedDate: "Nov 19, 2024",
        score: 92,
        feedback:
          "Outstanding! The dashboard looks professional and handles edge cases well.",
      },
      {
        id: 4,
        title: "Create Landing Page Design",
        status: "in-progress",
        overview:
          "Design and implement a modern landing page for our new product",
        description:
          "Create a compelling landing page that showcases our product's key features with smooth animations and responsive design.",
        background:
          "Landing pages are crucial for conversions. This task combines design, development, and performance optimization skills.",
        instructions: `1. Review product requirements and target audience
2. Create wireframes for desktop and mobile
3. Design high-fidelity mockups in Figma
4. Implement HTML structure with semantic elements
5. Style with Tailwind CSS
6. Add scroll animations and micro-interactions
7. Optimize images and performance
8. Ensure accessibility compliance
9. Test across different browsers
10. Deploy to Vercel`,
        resources: [
          { type: "document", name: "Product Brief", url: "#" },
          {
            type: "link",
            name: "Animation Library",
            url: "https://www.framer.com/motion/",
          },
          { type: "link", name: "Landing Page Inspiration", url: "#" },
          { type: "document", name: "Brand Guidelines", url: "#" },
        ],
        submissionType: ["url", "file", "text"],
        submissionInstructions:
          "Submit: 1) Link to live preview, 2) Figma design file, 3) Brief explanation of your design decisions",
        dueDate: "Nov 30, 2024",
        timeRemaining: "5 days",
      },
      {
        id: 5,
        title: "API Integration & State Management",
        status: "locked",
        overview: "Integrate REST APIs and implement global state management",
        description:
          "Connect the frontend to our backend APIs and implement a robust state management solution using React Context or Zustand.",
        background:
          "Modern applications require efficient data fetching and state management. You'll learn industry best practices in this task.",
        instructions: "Complete the previous task to unlock this task.",
        resources: [],
        submissionType: ["url", "file"],
        submissionInstructions: "",
        dueDate: "Dec 10, 2024",
      },
    ],
  },
};

export default function InternshipPage() {
  const [selectedTask, setSelectedTask] = useState(
    internshipData.workspaceData?.tasks.find(
      (t) => t.status === "in-progress",
    ) || internshipData.workspaceData?.tasks[0],
  );
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const getTaskIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Play className="h-5 w-5 text-blue-600" />;
      case "locked":
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "locked":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "link":
        return <ExternalLink className="h-4 w-4" />;
      case "file":
        return <Download className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Determine which view to show based on application status
  const isAccepted = internshipData.applicationStatus === "accepted";

  return (
    <>
      <main className="from-background to-muted/20 flex-1 bg-gradient-to-b">
        <div className="container px-4 py-8 md:px-6">
          <Link href="/dashboard/intern">
            <Button variant="ghost" className="mb-6 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Conditional Rendering: Detail View or Workspace View */}
          {!isAccepted ? (
            // Show Detail/Preview View for non-accepted interns
            <InternshipDetailView internship={internshipData} />
          ) : (
            // Show Workspace View for accepted interns
            <>
              {/* Internship Header */}
              <div className="bg-background rounded-t-lg border-b">
                <div className="container px-4 py-8 md:px-6">
                  <div className="flex flex-col items-start gap-6 md:flex-row">
                    <Avatar className="h-20 w-20 rounded-lg">
                      <AvatarImage
                        src={internshipData.companyLogo || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        <Building2 className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <h1 className="text-3xl font-bold">
                            {internshipData.title}
                          </h1>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <p className="text-muted-foreground text-lg">
                          {internshipData.company}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted-foreground h-4 w-4" />
                          <span>
                            {internshipData.workspaceData.startDate} -{" "}
                            {internshipData.workspaceData.endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="text-muted-foreground h-4 w-4" />
                          <span>
                            {internshipData.workspaceData.tasksCompleted} of{" "}
                            {internshipData.workspaceData.totalTasks} tasks
                            completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={
                                internshipData.workspaceData.mentor.avatar ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>M</AvatarFallback>
                          </Avatar>
                          <span>
                            Mentor: {internshipData.workspaceData.mentor.name} (
                            {internshipData.workspaceData.mentor.role})
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Overall Progress</span>
                          <span className="text-muted-foreground">
                            {internshipData.workspaceData.progress}%
                          </span>
                        </div>
                        <Progress
                          value={internshipData.workspaceData.progress}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Task List Sidebar */}
                <div className="space-y-6 lg:col-span-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tasks</CardTitle>
                      <CardDescription>
                        Complete tasks to finish your internship
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {internshipData.workspaceData.tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() =>
                            task.status !== "locked" && setSelectedTask(task)
                          }
                          disabled={task.status === "locked"}
                          className={`w-full rounded-lg border p-4 text-left transition-all ${
                            selectedTask?.id === task.id
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "hover:bg-muted border-border"
                          } ${task.status === "locked" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                              {getTaskIcon(task.status)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-start justify-between gap-2">
                                <h4 className="line-clamp-2 text-sm font-medium">
                                  {task.title}
                                </h4>
                                {selectedTask?.id === task.id && (
                                  <ChevronRight className="h-4 w-4 shrink-0" />
                                )}
                              </div>
                              <p className="text-muted-foreground mb-2 line-clamp-1 text-xs">
                                {task.overview}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant={getTaskStatusColor(task.status)}
                                  className="text-xs"
                                >
                                  {task.status === "in-progress"
                                    ? "In Progress"
                                    : task.status === "completed"
                                      ? "Completed"
                                      : "Locked"}
                                </Badge>
                                {task.status === "completed" && task.score && (
                                  <div className="flex items-center gap-1">
                                    <Award className="h-3 w-3 text-yellow-500" />
                                    <span className="text-xs font-medium">
                                      {task.score}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Completion Rate
                        </span>
                        <span className="text-2xl font-bold">
                          {internshipData.workspaceData.progress}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Tasks Completed
                        </span>
                        <span className="text-2xl font-bold">
                          {internshipData.workspaceData.tasksCompleted}/
                          {internshipData.workspaceData.totalTasks}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Average Score
                        </span>
                        <span className="text-2xl font-bold">
                          {Math.round(
                            internshipData.workspaceData.tasks
                              .filter((t) => t.score)
                              .reduce((sum, t) => sum + (t.score || 0), 0) /
                              internshipData.workspaceData.tasks.filter(
                                (t) => t.score,
                              ).length,
                          )}
                          %
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Task Details */}
                <div className="lg:col-span-8">
                  {selectedTask ? (
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h2 className="text-2xl font-bold">
                                {selectedTask.title}
                              </h2>
                              <Badge
                                variant={getTaskStatusColor(
                                  selectedTask.status,
                                )}
                              >
                                {selectedTask.status === "in-progress"
                                  ? "In Progress"
                                  : selectedTask.status === "completed"
                                    ? "Completed"
                                    : "Locked"}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {selectedTask.overview}
                            </p>
                          </div>
                          {selectedTask.status === "completed" &&
                            selectedTask.score && (
                              <div className="text-right">
                                <div className="mb-1 flex items-center justify-end gap-2">
                                  <Award className="h-5 w-5 text-yellow-500" />
                                  <span className="text-2xl font-bold">
                                    {selectedTask.score}%
                                  </span>
                                </div>
                                <span className="text-muted-foreground text-sm">
                                  Your Score
                                </span>
                              </div>
                            )}
                        </div>

                        {selectedTask.status === "in-progress" && (
                          <div className="flex items-center gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="text-muted-foreground h-4 w-4" />
                              <span>Due: {selectedTask.dueDate}</span>
                            </div>
                            {selectedTask.timeRemaining && (
                              <Badge variant="secondary">
                                {selectedTask.timeRemaining} remaining
                              </Badge>
                            )}
                          </div>
                        )}

                        {selectedTask.status === "completed" && (
                          <div className="text-muted-foreground flex items-center gap-2 pt-4 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Completed on {selectedTask.completedDate}
                            </span>
                          </div>
                        )}
                      </CardHeader>

                      <CardContent>
                        {selectedTask.status === "locked" ? (
                          <div className="py-12 text-center">
                            <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                            <h3 className="mb-2 text-lg font-semibold">
                              Task Locked
                            </h3>
                            <p className="text-muted-foreground">
                              Complete the previous task to unlock this one
                            </p>
                          </div>
                        ) : (
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="overview">
                                Overview
                              </TabsTrigger>
                              <TabsTrigger value="instructions">
                                Instructions
                              </TabsTrigger>
                              <TabsTrigger value="resources">
                                Resources
                              </TabsTrigger>
                              <TabsTrigger value="submission">
                                Submission
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent
                              value="overview"
                              className="mt-6 space-y-6"
                            >
                              <div>
                                <h3 className="mb-3 font-semibold">
                                  Description
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                  {selectedTask.description}
                                </p>
                              </div>

                              {selectedTask.background && (
                                <div>
                                  <h3 className="mb-3 font-semibold">
                                    Background & Context
                                  </h3>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {selectedTask.background}
                                  </p>
                                </div>
                              )}

                              <div>
                                <h3 className="mb-3 font-semibold">
                                  Submission Types
                                </h3>
                                <div className="flex gap-2">
                                  {selectedTask.submissionType.map((type) => (
                                    <Badge key={type} variant="outline">
                                      {type === "file" && (
                                        <Upload className="mr-1 h-3 w-3" />
                                      )}
                                      {type === "url" && (
                                        <LinkIcon className="mr-1 h-3 w-3" />
                                      )}
                                      {type === "text" && (
                                        <FileText className="mr-1 h-3 w-3" />
                                      )}
                                      {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {selectedTask.feedback && (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                                  <div className="flex items-start gap-2">
                                    <MessageSquare className="mt-0.5 h-5 w-5 text-green-600" />
                                    <div>
                                      <h3 className="mb-1 font-semibold text-green-900 dark:text-green-100">
                                        Mentor Feedback
                                      </h3>
                                      <p className="text-green-800 dark:text-green-200">
                                        {selectedTask.feedback}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent
                              value="instructions"
                              className="mt-6 space-y-4"
                            >
                              <div>
                                <h3 className="mb-4 font-semibold">
                                  Step-by-Step Instructions
                                </h3>
                                <div className="space-y-3">
                                  {selectedTask.instructions
                                    .split("\n")
                                    .map((instruction, index) => {
                                      if (!instruction.trim()) return null;
                                      return (
                                        <div key={index} className="flex gap-3">
                                          <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                                            {instruction.match(/^\d+/)
                                              ? instruction.match(/^\d+/)![0]
                                              : index + 1}
                                          </div>
                                          <p className="text-muted-foreground pt-0.5">
                                            {instruction.replace(
                                              /^\d+\.\s*/,
                                              "",
                                            )}
                                          </p>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="resources"
                              className="mt-6 space-y-4"
                            >
                              <div>
                                <h3 className="mb-4 font-semibold">
                                  Helpful Resources
                                </h3>
                                {selectedTask.resources.length > 0 ? (
                                  <div className="space-y-3">
                                    {selectedTask.resources.map(
                                      (resource, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                              {getResourceIcon(resource.type)}
                                            </div>
                                            <div>
                                              <h4 className="font-medium">
                                                {resource.name}
                                              </h4>
                                              <p className="text-muted-foreground text-sm capitalize">
                                                {resource.type}
                                              </p>
                                            </div>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                          >
                                            <a
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {resource.type === "link"
                                                ? "Open"
                                                : "Download"}
                                            </a>
                                          </Button>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground">
                                    No resources available for this task.
                                  </p>
                                )}
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="submission"
                              className="mt-6 space-y-6"
                            >
                              {selectedTask.status === "completed" ? (
                                <div className="space-y-6">
                                  <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
                                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
                                    <h3 className="mb-2 text-xl font-semibold text-green-900 dark:text-green-100">
                                      Task Completed!
                                    </h3>
                                    <p className="mb-4 text-green-800 dark:text-green-200">
                                      You submitted this task on{" "}
                                      {selectedTask.completedDate}
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                      <Award className="h-5 w-5 text-yellow-500" />
                                      <span className="text-2xl font-bold">
                                        {selectedTask.score}%
                                      </span>
                                    </div>
                                  </div>

                                  {selectedTask.feedback && (
                                    <div className="rounded-lg border p-4">
                                      <h4 className="mb-2 font-semibold">
                                        Mentor Feedback
                                      </h4>
                                      <p className="text-muted-foreground">
                                        {selectedTask.feedback}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  <div>
                                    <h3 className="mb-3 font-semibold">
                                      Submission Guidelines
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                      {selectedTask.submissionInstructions}
                                    </p>
                                  </div>

                                  <Separator />

                                  <div>
                                    <Button
                                      onClick={() =>
                                        setShowSubmissionForm(true)
                                      }
                                      className="w-full"
                                      size="lg"
                                    >
                                      Submit Your Work
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                        <h3 className="mb-2 text-lg font-semibold">
                          No Task Selected
                        </h3>
                        <p className="text-muted-foreground">
                          Select a task from the left sidebar to view details
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Submission Form Dialog */}
      {showSubmissionForm && selectedTask && (
        <TaskSubmissionForm
          task={selectedTask}
          onClose={() => setShowSubmissionForm(false)}
          onSubmit={(data) => {
            console.log("Submission data:", data);
            setShowSubmissionForm(false);
          }}
        />
      )}
    </>
  );
}
