"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Search,
  Filter,
  X,
  ExternalLink,
  Briefcase,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type InternshipPaymentType } from "@/lib/validation/internships";

// Types
type Duration = "1-3 months" | "3-6 months" | "6+ months";

export default function InternDashboard() {
  const router = useRouter();

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<InternshipPaymentType[]>(
    [],
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<Duration | "">("");
  const [minStipend, setMinStipend] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch internships
  const { data: internships, isLoading } =
    api.internships.listPublic.useQuery();

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    if (!internships) return { locations: [], skills: [] };

    const locations = Array.from(
      new Set(internships.map((i) => i.location)),
    ).sort();
    const skills = Array.from(
      new Set(internships.flatMap((i) => i.skills)),
    ).sort();

    return { locations, skills };
  }, [internships]);

  // Filter logic
  const filteredInternships = useMemo(() => {
    if (!internships) return [];

    return internships.filter((internship) => {
      const matchesSearch =
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.organization.organizationName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(internship.type);

      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.includes(internship.location);

      const matchesDuration =
        !selectedDuration ||
        (selectedDuration === "1-3 months" &&
          parseInt(internship.duration) <= 3) ||
        (selectedDuration === "3-6 months" &&
          parseInt(internship.duration) > 3 &&
          parseInt(internship.duration) <= 6) ||
        (selectedDuration === "6+ months" && parseInt(internship.duration) > 6);

      const matchesStipend =
        !minStipend ||
        (internship.type === "PAID" &&
          internship.amount &&
          internship.amount >= parseInt(minStipend));

      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.some((skill) => internship.skills.includes(skill));

      return (
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesDuration &&
        matchesStipend &&
        matchesSkills
      );
    });
  }, [
    internships,
    searchTerm,
    selectedTypes,
    selectedLocations,
    selectedDuration,
    minStipend,
    selectedSkills,
  ]);

  // Toggle filter selection
  const toggleType = (type: InternshipPaymentType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location],
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSelectedDuration("");
    setMinStipend("");
    setSelectedSkills([]);
  };

  const totalFilters =
    selectedTypes.length +
    selectedLocations.length +
    (selectedDuration ? 1 : 0) +
    (minStipend ? 1 : 0) +
    selectedSkills.length;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="from-muted/20 to-background border-b bg-gradient-to-b">
        <div className="container px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Find Your Dream Internship
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              Explore {internships?.length ?? 0}+ opportunities from top
              companies. Apply with ease.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                placeholder="Search by role, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10 text-base"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1/2 right-1 -translate-y-1/2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {totalFilters > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5">
                    {totalFilters}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:col-span-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-1 h-4 w-4" /> Clear
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Type */}
                  <div>
                    <h3 className="mb-3 font-medium">Internship Type</h3>
                    <div className="space-y-2">
                      {(["PAID", "UNPAID", "STIPEND"] as const).map((type) => (
                        <Label
                          key={type}
                          className="flex cursor-pointer items-center space-x-2"
                        >
                          <Checkbox
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => toggleType(type)}
                          />
                          <span className="flex items-center gap-1">
                            {type === "PAID" && (
                              <DollarSign className="h-3.5 w-3.5" />
                            )}
                            {type}
                          </span>
                        </Label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Location */}
                  <div>
                    <h3 className="mb-3 font-medium">Location</h3>
                    <div className="max-h-48 space-y-2 overflow-y-auto">
                      {filterOptions.locations.slice(0, 8).map((location) => (
                        <Label
                          key={location}
                          className="flex cursor-pointer items-center space-x-2"
                        >
                          <Checkbox
                            checked={selectedLocations.includes(location)}
                            onCheckedChange={() => toggleLocation(location)}
                          />
                          <span>{location}</span>
                        </Label>
                      ))}
                      {filterOptions.locations.length > 8 && (
                        <p className="text-muted-foreground text-sm">
                          +{filterOptions.locations.length - 8} more
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Duration */}
                  <div>
                    <h3 className="mb-3 font-medium">Duration</h3>
                    <Select
                      value={selectedDuration}
                      onValueChange={(val) =>
                        setSelectedDuration(val as Duration | "")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any duration</SelectItem>
                        <SelectItem value="1-3 months">1–3 months</SelectItem>
                        <SelectItem value="3-6 months">3–6 months</SelectItem>
                        <SelectItem value="6+ months">6+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stipend */}
                  <div>
                    <h3 className="mb-3 font-medium">Min Stipend (₹)</h3>
                    <Input
                      type="number"
                      placeholder="e.g. 10000"
                      value={minStipend}
                      onChange={(e) => setMinStipend(e.target.value)}
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="mb-3 font-medium">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.skills.slice(0, 10).map((skill) => (
                        <Badge
                          key={skill}
                          variant={
                            selectedSkills.includes(skill)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                      {filterOptions.skills.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{filterOptions.skills.length - 10}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Internship List */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing <strong>{filteredInternships.length}</strong> of{" "}
                <strong>{internships?.length ?? 0}</strong> internships
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters {totalFilters > 0 && `(${totalFilters})`}
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredInternships.length === 0 && (
              <Card className="p-12 text-center">
                <Briefcase className="text-muted-foreground mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">
                  No internships found
                </h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or search term.
                </p>
                <Button className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Card>
            )}

            {/* Internship Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredInternships.map((internship) => (
                <Card
                  key={internship.id}
                  className="group transition-all duration-200 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="group-hover:text-primary text-xl transition-colors">
                          {internship.title}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {internship.organization.organizationName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {internship.location}
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
                    <p className="text-muted-foreground line-clamp-2">
                      {internship.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {internship.skills.slice(0, 4).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {internship.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{internship.skills.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {internship.duration} months
                      </span>
                      {internship.type === "PAID" && internship.amount && (
                        <span className="text-foreground flex items-center gap-1 font-medium">
                          <DollarSign className="h-3.5 w-3.5" />₹
                          {internship.amount.toLocaleString()}/mo
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Apply by{" "}
                        {format(new Date(internship.deadline), "MMM d")}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => router.push("/auth/signin")}
                      >
                        Sign in to Apply
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/internships/${internship.slug}`)
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
