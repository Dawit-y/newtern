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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Building2,
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  Award,
  CheckCircle,
  Calendar,
  Download,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/nav-bar";

// Mock data
const internships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechStart Inc.",
    location: "Remote",
    duration: "3 months",
    tasks: 5,
    applicants: 23,
    deadline: "Dec 15, 2024",
    description:
      "Work on React components and user interfaces for our main product.",
    skills: ["React", "TypeScript", "CSS"],
    type: "Paid",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "DataCorp",
    location: "New York, NY",
    duration: "4 months",
    tasks: 8,
    applicants: 45,
    deadline: "Dec 20, 2024",
    description: "Analyze customer data and build predictive models.",
    skills: ["Python", "Machine Learning", "SQL"],
    type: "Paid",
  },
  {
    id: 3,
    title: "Marketing Intern",
    company: "GrowthCo",
    location: "Remote",
    duration: "2 months",
    tasks: 4,
    applicants: 12,
    deadline: "Dec 10, 2024",
    description: "Create content and manage social media campaigns.",
    skills: ["Content Creation", "Social Media", "Analytics"],
    type: "Unpaid",
  },
];

const myInternships = [
  {
    id: 1,
    title: "UI/UX Design Intern",
    company: "DesignHub",
    status: "completed",
    progress: 100,
    tasksCompleted: 6,
    totalTasks: 6,
    startDate: "Sep 2024",
    endDate: "Nov 2024",
    certificate: true,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Backend Developer Intern",
    company: "CodeBase",
    status: "in-progress",
    progress: 60,
    tasksCompleted: 3,
    totalTasks: 5,
    startDate: "Nov 2024",
    endDate: "Jan 2025",
    certificate: false,
    rating: null,
  },
];

const navLinks = [
  { href: "#browse", label: "Browse" },
  { href: "#my-internships", label: "My Internships" },
  { href: "#achievements", label: "Achievements" },
];

export default function InternDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("browse");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header links={navLinks} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="from-primary/5 via-background to-secondary/5 w-full bg-gradient-to-br py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Welcome back, John! 👋
                </h1>
                <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl">
                  Continue your journey with new internship opportunities and
                  track your progress.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Applications
                    </CardTitle>
                    <Briefcase className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-muted-foreground text-xs">
                      +2 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed Tasks
                    </CardTitle>
                    <CheckCircle className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">9</div>
                    <p className="text-muted-foreground text-xs">
                      Across 2 internships
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Certificates Earned
                    </CardTitle>
                    <Award className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-muted-foreground text-xs">
                      With 4.8★ rating
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto py-12 md:w-3/4 md:py-16">
          <div className="container px-4 md:px-6">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browse">Browse Internships</TabsTrigger>
                <TabsTrigger value="my-internships">My Internships</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              {/* Browse Internships Tab */}
              <TabsContent value="browse" className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input
                      placeholder="Search internships..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>

                <div className="grid gap-6">
                  {internships.map((internship) => (
                    <Card
                      key={internship.id}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl">
                              {internship.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {internship.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {internship.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {internship.duration}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              internship.type === "Paid"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {internship.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          {internship.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {internship.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-muted-foreground flex items-center justify-between text-sm">
                          <span>{internship.tasks} tasks</span>
                          <span>{internship.applicants} applicants</span>
                          <span>Deadline: {internship.deadline}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1">Apply Now</Button>
                          <Button variant="outline">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* My Internships Tab */}
              <TabsContent value="my-internships" className="space-y-6">
                <div className="grid gap-6">
                  {myInternships.map((internship) => (
                    <Card key={internship.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl">
                              {internship.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {internship.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {internship.startDate} - {internship.endDate}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              internship.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {internship.status === "completed"
                              ? "Completed"
                              : "In Progress"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {internship.tasksCompleted}/
                              {internship.totalTasks} tasks
                            </span>
                          </div>
                          <Progress
                            value={internship.progress}
                            className="w-full"
                          />
                        </div>

                        {internship.status === "completed" && (
                          <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium">
                                Internship Completed!
                              </span>
                              {internship.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">
                                    {internship.rating}
                                  </span>
                                </div>
                              )}
                            </div>
                            {internship.certificate && (
                              <Button size="sm" variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Certificate
                              </Button>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            View Details
                          </Button>
                          {internship.status === "in-progress" && (
                            <Button>Continue Tasks</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Certificates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Certificates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h4 className="font-medium">
                            UI/UX Design Completion
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            DesignHub • Nov 2024
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Skills Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>React Development</span>
                          <span>Advanced</span>
                        </div>
                        <Progress value={85} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>UI/UX Design</span>
                          <span>Intermediate</span>
                        </div>
                        <Progress value={70} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Project Management</span>
                          <span>Beginner</span>
                        </div>
                        <Progress value={40} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Achievement Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle>Achievement Badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="rounded-lg border p-4 text-center">
                        <Award className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
                        <h4 className="text-sm font-medium">
                          First Completion
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          Completed first internship
                        </p>
                      </div>
                      <div className="rounded-lg border p-4 text-center opacity-50">
                        <Star className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <h4 className="text-sm font-medium">5-Star Rating</h4>
                        <p className="text-muted-foreground text-xs">
                          Earn 5-star rating
                        </p>
                      </div>
                      <div className="rounded-lg border p-4 text-center opacity-50">
                        <Users className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <h4 className="text-sm font-medium">Team Player</h4>
                        <p className="text-muted-foreground text-xs">
                          Complete team project
                        </p>
                      </div>
                      <div className="rounded-lg border p-4 text-center opacity-50">
                        <CheckCircle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <h4 className="text-sm font-medium">Streak Master</h4>
                        <p className="text-muted-foreground text-xs">
                          7-day completion streak
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <Briefcase className="text-primary h-6 w-6" />
          <span className="text-sm font-medium">Newtern</span>
        </div>
        <p className="text-muted-foreground text-xs">
          © 2024 Newtern. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link href="#" className="text-xs underline-offset-4 hover:underline">
            Help Center
          </Link>
          <Link href="#" className="text-xs underline-offset-4 hover:underline">
            Settings
          </Link>
          <Link href="#" className="text-xs underline-offset-4 hover:underline">
            Feedback
          </Link>
        </nav>
      </footer>
    </div>
  );
}
