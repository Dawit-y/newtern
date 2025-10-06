"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useOrganizationProfile } from "@/hooks/use-profile";
import { format } from "date-fns";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Search,
  Filter,
  Clock,
} from "lucide-react";

// Utility functions for badge colors
const getTypeColor = (type: string) => {
  if (type === "PAID") return "secondary";
  if (type === "UNPAID") return "outline";
  if (type === "STIPEND") return "default";
  return "secondary";
};
const getStatusColor = (published: boolean, approved: boolean) => {
  if (!published) return "secondary"; // Draft
  if (published && !approved) return "outline"; // Pending approval
  if (published && approved) return "default"; // Active
  return "secondary";
};

export default function InternshipsPage() {
  const { organizationId, isLoading: isProfileLoading } =
    useOrganizationProfile();

  const { data, isLoading, isError } =
    api.internships.byOrganizationId.useQuery(organizationId ?? "", {
      enabled: !!organizationId && !isProfileLoading,
    });

  const [searchTerm, setSearchTerm] = useState("");

  // Derived data
  const filteredInternships = useMemo(() => {
    if (!data) return [];
    return data.filter((internship) =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const stats = useMemo(() => {
    if (!data) return { total: 0, published: 0, tasks: 0 };
    const total = data.length;
    const published = data.filter((i) => i.published).length;
    const totalTasks = data.reduce((sum, i) => sum + i.tasks.length, 0);
    return { total, published, tasks: totalTasks };
  }, [data]);

  if (isLoading || isProfileLoading) {
    return (
      <div className="text-muted-foreground flex h-screen items-center justify-center">
        Loading internships...
      </div>
    );
  }

  if (isError || !data?.length) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold">No internships found</p>
        <p className="text-muted-foreground">
          Create your first internship to get started.
        </p>
        <Link href="/dashboard/organization/internships/create">
          <Button className="mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Create Internship
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Internships</h1>
          <p className="text-muted-foreground">
            Manage your internship programs and track progress
          </p>
        </div>
        <Link href="/dashboard/organization/internships/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Internship
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Internships
            </CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">
              {stats.published} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks}</div>
            <p className="text-muted-foreground text-xs">
              Across all internships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Last updated{" "}
              {data?.[0]?.updatedAt
                ? format(data[0].updatedAt, "MMM dd, yyyy")
                : "Never"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search internships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Internships Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Internships</CardTitle>
          <CardDescription>
            A list of all your created internship programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInternships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{internship.title}</div>
                      <p className="text-muted-foreground max-w-xs truncate text-sm">
                        {internship.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusColor(
                        internship.published,
                        internship.approved,
                      )}
                    >
                      {!internship.published
                        ? "Draft"
                        : internship.approved
                          ? "Active"
                          : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeColor(internship.type)}>
                      {internship.type.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="text-muted-foreground h-4 w-4" />
                      {internship.tasks.length}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      {format(new Date(internship.deadline), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>{internship.duration}</TableCell>
                  <TableCell>
                    {format(internship.createdAt, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/organization/internships/${internship.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/organization/internships/${internship.id}/edit`}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
