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
  Users,
  Briefcase,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  UserCheck,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

// Mock data
const internships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    status: "active",
    applicants: 23,
    selected: 2,
    tasks: 5,
    deadline: "Dec 15, 2024",
    created: "Nov 1, 2024",
    duration: "3 months",
    type: "paid",
  },
  {
    id: 2,
    title: "Data Analyst Intern",
    status: "draft",
    applicants: 0,
    selected: 0,
    tasks: 8,
    deadline: "Dec 20, 2024",
    created: "Nov 10, 2024",
    duration: "4 months",
    type: "paid",
  },
  {
    id: 3,
    title: "Marketing Intern",
    status: "completed",
    applicants: 12,
    selected: 1,
    tasks: 4,
    deadline: "Nov 30, 2024",
    created: "Oct 15, 2024",
    duration: "2 months",
    type: "unpaid",
  },
  {
    id: 4,
    title: "UI/UX Design Intern",
    status: "paused",
    applicants: 8,
    selected: 0,
    tasks: 6,
    deadline: "Jan 15, 2025",
    created: "Nov 5, 2024",
    duration: "3 months",
    type: "paid",
  },
];

export default function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "completed":
        return "outline";
      case "paused":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "paid" ? "default" : "secondary";
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Internships</h1>
          <p className="text-muted-foreground">
            Manage your internship programs and track applications
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Internships
            </CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internships.length}</div>
            <p className="text-muted-foreground text-xs">
              {internships.filter((i) => i.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {internships.reduce((sum, i) => sum + i.applicants, 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              Across all internships
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Selected Interns
            </CardTitle>
            <UserCheck className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {internships.reduce((sum, i) => sum + i.selected, 0)}
            </div>
            <p className="text-muted-foreground text-xs">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {internships.reduce((sum, i) => sum + i.tasks, 0)}
            </div>
            <p className="text-muted-foreground text-xs">Created tasks</p>
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
            A list of all your internship programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Selected</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {internships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{internship.title}</div>
                      <div className="text-muted-foreground text-sm">
                        {internship.duration} • Created {internship.created}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(internship.status)}>
                      {internship.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeColor(internship.type)}>
                      {internship.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="text-muted-foreground h-4 w-4" />
                      {internship.applicants}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <UserCheck className="text-muted-foreground h-4 w-4" />
                      {internship.selected}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="text-muted-foreground h-4 w-4" />
                      {internship.tasks}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      {internship.deadline}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Applications
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
