"use client";

import { api } from "@/trpc/react";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function InternDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("browse");
  const router = useRouter();

  const { data: session } = useSession();
  const { data: internships } = api.internships.listPublic.useQuery();
  const { data: myInternships } = api.internships.listForIntern.useQuery();

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="from-primary/5 via-background to-secondary/5 w-full bg-gradient-to-br py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Welcome back, {session?.user.name}! 👋
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
              <TabsList className="mb-6 grid w-full grid-cols-3">
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
                  {internships?.map((internship) => (
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
                                {internship.organization.organizationName}
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
                              internship.type === "PAID"
                                ? "default"
                                : internship.type === "UNPAID"
                                  ? "outline"
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
                          <span>{internship._count.tasks} tasks</span>
                          <span>
                            {internship._count.applications} applicants
                          </span>
                          <span>
                            Deadline: {internship.deadline.toISOString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <Button
                            className="w-50"
                            onClick={() =>
                              router.push(
                                `/dashboard/intern/internship/${internship.id}/apply`,
                              )
                            }
                          >
                            Apply Now
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/dashboard/intern/internship/${internship.id}/`,
                              )
                            }
                          >
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
                  {myInternships?.length === 0 && (
                    <p className="text-muted-foreground text-center">
                      You have not applied to any internships yet.
                    </p>
                  )}
                  {myInternships?.map((internship) => (
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
                                {internship.organization.organizationName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {internship.deadline.toISOString()}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              internship.internshipProgress?.status ===
                              "COMPLETED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {internship.internshipProgress?.status ===
                            "COMPLETED"
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
                              {(internship.internshipProgress?.progress ??
                                0 / 100) * internship._count.tasks}
                              /{internship._count.tasks} tasks
                            </span>
                          </div>
                          <Progress
                            value={internship.internshipProgress?.progress}
                            className="w-full"
                          />
                        </div>

                        {internship.internshipProgress?.status ===
                          "COMPLETED" && (
                          <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium">
                                Internship Completed!
                              </span>
                              {/* {internship.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">
                                    {internship.rating}
                                  </span>
                                </div>
                              )} */}
                              {
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{5}</span>
                                </div>
                              }
                            </div>
                            {
                              <Button size="sm" variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Certificate
                              </Button>
                            }
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            View Details
                          </Button>
                          {internship.internshipProgress?.status ===
                            "IN_PROGRESS" && <Button>Continue Tasks</Button>}
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
    </>
  );
}
