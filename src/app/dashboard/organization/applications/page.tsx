"use client";

import { useState } from "react";
import { api, type RouterOutputs } from "@/trpc/react";
import { type ApplicationStatus } from "@/lib/validation/applications";
import { getInternFullName } from "@/server/lib/helpers/intern";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Eye,
  Check,
  X,
  Calendar,
  FileText,
  Search,
  Download,
  Mail,
  Clock,
} from "lucide-react";

type Application = RouterOutputs["applications"]["list"][number];

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: applications = [],
    isLoading,
    isError,
  } = api.applications.list.useQuery();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    // In a real app, this would make an API call
    console.log(`Changing application ${applicationId} status to ${newStatus}`);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.intern.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.internship.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "PENDING").length,
    accepted: applications.filter((app) => app.status === "ACCEPTED").length,
    rejected: applications.filter((app) => app.status === "REJECTED").length,
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-screen items-center justify-center">
        Loading applications...
      </div>
    );
  }

  if (isError || !applications?.length) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold">No applications found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Review and manage internship applications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-muted-foreground text-xs">Awaiting decision</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <Check className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
            <p className="text-muted-foreground text-xs">Approved candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-muted-foreground text-xs">Not selected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            Review and manage candidate applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Internship</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {application.intern.firstName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {getInternFullName(application.intern)}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {application.intern.university}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {application.internship.title}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {application.internship.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      {application.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto sm:max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                              Review {getInternFullName(application.intern)}
                              &apos;s application for{" "}
                              {application.internship.title}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedApplication && (
                            <div className="space-y-6">
                              {/* Candidate Info */}
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">
                                      Candidate Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-12 w-12">
                                        <AvatarFallback className="text-lg">
                                          {selectedApplication.intern.firstName
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="text-lg font-semibold">
                                          {getInternFullName(
                                            selectedApplication.intern,
                                          )}
                                        </h3>
                                        <p className="text-muted-foreground">
                                          {selectedApplication.intern.major}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Mail className="text-muted-foreground h-4 w-4" />
                                        <span className="text-sm">
                                          {
                                            selectedApplication.intern.user
                                              .email
                                          }
                                        </span>
                                      </div>
                                      {/* <div className="flex items-center gap-2">
                                        <Phone className="text-muted-foreground h-4 w-4" />
                                        <span className="text-sm">
                                          {selectedApplication.intern.user.phone}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="text-muted-foreground h-4 w-4" />
                                        <span className="text-sm">
                                          {selectedApplication.intern.location}
                                        </span>
                                      </div> */}
                                      {/* <div className="flex items-center gap-2">
                                        <GraduationCap className="text-muted-foreground h-4 w-4" />
                                        <span className="text-sm">
                                          {selectedApplication.intern.university} •
                                          Class of{" "}
                                          {selectedApplication.intern.graduationYear}
                                        </span>
                                      </div> */}
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">
                                      Application Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    {/* <div>
                                      <Label className="text-sm font-medium">
                                        GPA
                                      </Label>
                                      <p className="text-muted-foreground text-sm">
                                        {selectedApplication.intern.gpa}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Experience Level
                                      </Label>
                                      <p className="text-muted-foreground text-sm">
                                        {selectedApplication.intern.experience}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Availability
                                      </Label>
                                      <p className="text-muted-foreground text-sm">
                                        {selectedApplication.availability}
                                      </p>
                                    </div> */}
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Skills
                                      </Label>
                                      {/* <div className="mt-1 flex flex-wrap gap-1">
                                        {selectedApplication.intern?.skills?.map(
                                          (skill: string) => (
                                            <Badge
                                              key={skill}
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              {skill}
                                            </Badge>
                                          ),
                                        )}
                                      </div> */}
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {selectedApplication.intern?.skills}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Cover Letter */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">
                                    Cover Letter
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm leading-relaxed">
                                    {selectedApplication.coverLetter}
                                  </p>
                                </CardContent>
                              </Card>

                              {/* Documents */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">
                                    Documents & Links
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      <span className="text-sm font-medium">
                                        Resume
                                      </span>
                                    </div>
                                    <Button variant="outline" size="sm">
                                      <Download className="mr-2 h-4 w-4" />
                                      Download
                                    </Button>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-2">
                                      <Eye className="h-4 w-4" />
                                      <span className="text-sm font-medium">
                                        Portfolio
                                      </span>
                                    </div>
                                    {/* <Button variant="outline" size="sm" asChild>
                                      <a
                                        href={selectedApplication.intern.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View
                                      </a>
                                    </Button> */}
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-end gap-3 border-t pt-4">
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleStatusChange(
                                      selectedApplication.id,
                                      "REJECTED",
                                    )
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleStatusChange(
                                      selectedApplication.id,
                                      "ACCEPTED",
                                    )
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Check className="h-4 w-4" />
                                  Accept
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {application.status === "PENDING" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(application.id, "ACCEPTED")
                            }
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(application.id, "REJECTED")
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
