"use client";

import { useState, useMemo } from "react";
import { api } from "@/trpc/react";
import { useSession } from "@/lib/auth-client";
import { format } from "date-fns";
import {
  Briefcase,
  CheckCircle,
  Award,
  TrendingUp,
  Search,
  Filter,
  Star,
  Download,
  ArrowRight,
  Trophy,
  Target,
  Zap,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import InternshipCard from "@/components/intern/internship-card";
import MyInternshipCard from "@/components/intern/my-internship-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function InternDashboard() {
  const { data: session } = useSession();
  const [page, setPage] = useState(0);
  const take = 10;

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("browse");

  // Data
  const { data: internships, isLoading: loadingPublic } =
    api.internships.listForIntern.useQuery({
      skip: page * take,
      take,
    });
  const { data: myInternships, isLoading: loadingMy } =
    api.internships.myInternships.useQuery();

  const totalPages = Math.ceil((internships?.total ?? 0) / take);

  // Derived Stats
  const stats = useMemo(() => {
    if (!myInternships) return { active: 0, completed: 0, tasks: 0, rating: 0 };

    const active = myInternships.filter(
      (i) => i.internshipProgress?.status === "IN_PROGRESS",
    ).length;
    const completed = myInternships.filter(
      (i) => i.internshipProgress?.status === "COMPLETED",
    ).length;
    const tasks = myInternships.reduce(
      (sum, i) => sum + (i.internshipProgress?.progress ?? 0),
      0,
    );
    const avgRating =
      myInternships
        .filter(
          (i) => i.internshipProgress?.status === "COMPLETED" && i?.rating,
        )
        .reduce((sum, i) => sum + (i?.rating ?? 0), 0) / completed || 0;

    return { active, completed, tasks, rating: avgRating.toFixed(1) };
  }, [myInternships]);

  // Filter internships
  const filteredInternships = useMemo(() => {
    if (!internships) return [];
    return internships.items.filter(
      (i) =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ??
        i.organization.organizationName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [internships, searchTerm]);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="from-primary/5 via-background to-secondary/5 border-b bg-gradient-to-br">
        <div className="container px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Welcome back,{" "}
              <span className="text-primary">{session?.user.name}</span>!
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Track your progress, apply to new roles, and earn certificates.
            </p>

            {/* Stats Grid */}
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              <StatCard
                icon={<Briefcase className="h-5 w-5" />}
                label="Active Applications"
                value={stats.active}
                trend="+2 this month"
              />
              <StatCard
                icon={<CheckCircle className="h-5 w-5" />}
                label="Tasks Completed"
                value={stats.tasks}
                trend="Across all internships"
              />
              <StatCard
                icon={<Award className="h-5 w-5" />}
                label="Certificates"
                value={stats.completed}
                trend={
                  (stats.rating as number) > 0
                    ? `${stats.rating} average rating`
                    : "Keep going!"
                }
              />
              <StatCard
                icon={<Trophy className="h-5 w-5" />}
                label="Badges"
                value="3"
                trend="2 more to unlock"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container px-4 py-8">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-3">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="my-internships">My Internships</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search roles, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>

            {loadingPublic ? (
              <InternshipGridSkeleton />
            ) : filteredInternships.length === 0 ? (
              <EmptyState
                title="No internships found"
                description="Try adjusting your search or filters."
              />
            ) : (
              <div className="flex-col space-y-5">
                <div className="mb-4 grid gap-6 md:grid-cols-2">
                  {filteredInternships.map((internship) => (
                    <InternshipCard
                      key={internship.id}
                      internship={internship}
                    />
                  ))}
                </div>
                <Pagination>
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage((p) => Math.max(0, p - 1));
                        }}
                      />
                    </PaginationItem>

                    {/* Numbered Pages */}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={page === i}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page + 1 < totalPages) setPage(page + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>

          {/* My Internships Tab */}
          <TabsContent value="my-internships" className="space-y-6">
            {loadingMy ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }, (_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="mt-2 h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myInternships?.length === 0 ? (
              <EmptyState
                title="No applications yet"
                description="Browse internships and apply to get started!"
                action={
                  <Button onClick={() => setSelectedTab("browse")}>
                    Browse Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {myInternships?.map((internship) => (
                  <MyInternshipCard
                    key={internship.id}
                    internship={internship}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificates Earned
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myInternships
                    ?.filter(
                      (i) => i.internshipProgress?.status === "COMPLETED",
                    )
                    .slice(0, 3)
                    .map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <h4 className="font-medium">{i.title}</h4>
                          <p className="text-muted-foreground text-sm">
                            {i.organization.organizationName} •{" "}
                            {format(new Date(i.deadline), "MMM yyyy")}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )) ?? (
                    <p className="text-muted-foreground text-center">
                      Complete an internship to earn your first certificate!
                    </p>
                  )}
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
                  {["React", "UI/UX", "Node.js", "Teamwork"].map((skill, i) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{skill}</span>
                        <span className="font-medium">
                          {[85, 70, 60, 90][i]}%
                        </span>
                      </div>
                      <Progress value={[85, 70, 60, 90][i]} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Achievement Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <BadgeItem
                    icon={<Zap className="h-8 w-8 text-yellow-500" />}
                    title="First Win"
                    desc="Applied to first internship"
                    active
                  />
                  <BadgeItem
                    icon={<Target className="h-8 w-8 text-blue-500" />}
                    title="On Time"
                    desc="Completed 3 tasks on time"
                    active
                  />
                  <BadgeItem
                    icon={<Trophy className="h-8 w-8 text-purple-500" />}
                    title="Top Performer"
                    desc="5-star rating"
                    active
                  />
                  <BadgeItem
                    icon={<Star className="h-8 w-8 text-gray-400" />}
                    title="Streak Master"
                    desc="7-day streak"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

// Reusable Components
function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground text-xs">{trend}</p>
      </CardContent>
    </Card>
  );
}

function BadgeItem({
  icon,
  title,
  desc,
  active = false,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 text-center transition-opacity ${active ? "" : "opacity-50"}`}
    >
      {icon}
      <h4 className="mt-2 text-sm font-medium">{title}</h4>
      <p className="text-muted-foreground mt-1 text-xs">{desc}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="p-12 text-center">
      <div className="text-muted-foreground mx-auto mb-4 h-12 w-12">
        <Briefcase className="h-full w-full" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}

function InternshipGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <Skeleton className="mt-4 h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
