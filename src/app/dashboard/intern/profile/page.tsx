"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  GraduationCap,
  Briefcase,
  LinkIcon,
  FileText,
  Save,
  Upload,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function InternProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Mock profile data - replace with actual data fetching
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate computer science student with a focus on web development and UI/UX design. Love creating beautiful, functional applications that solve real-world problems.",
    university: "Stanford University",
    major: "Computer Science",
    graduationYear: "2025",
    gpa: 3.8,
    skills: "React, TypeScript, Node.js, Python, Figma, Git",
    experience:
      "Frontend Developer Intern at TechCorp (Summer 2023)\n- Built responsive web applications using React and TypeScript\n- Collaborated with design team to implement UI components\n- Improved page load times by 40%\n\nWeb Development Club - President\n- Led team of 15 students in building web projects\n- Organized workshops and hackathons",
    resume: "/uploads/sarah-johnson-resume.pdf",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    github: "https://github.com/sarahjohnson",
    portfolio: "https://sarahjohnson.dev",
  });

  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  console.log("resumeFile", resumeFile);

  const handleInputChange = (field: string, value: string | number) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      // In production, upload to server and get URL
      setProfile({ ...profile, resume: `/uploads/${file.name}` });
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = profile.skills ? profile.skills.split(", ") : [];
      if (!currentSkills.includes(newSkill.trim())) {
        setProfile({
          ...profile,
          skills: [...currentSkills, newSkill.trim()].join(", "),
        });
      }
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = profile.skills ? profile.skills.split(", ") : [];
    const updatedSkills = currentSkills.filter(
      (skill) => skill !== skillToRemove,
    );
    setProfile({ ...profile, skills: updatedSkills.join(", ") });
  };

  const skillsList = profile.skills
    ? profile.skills.split(", ").filter((s) => s.trim())
    : [];

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience & Skills", icon: Briefcase },
    { id: "links", label: "Links & Resume", icon: LinkIcon },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Profile Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your personal information and keep your profile up to date
          </p>
        </div>

        {/* Save Success Message */}
        {saveSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="font-medium text-green-800 dark:text-green-200">
              Profile updated successfully!
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar with Profile Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="mb-4 h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl">
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {profile.major || "Student"}
                  </p>
                  <Badge variant="secondary" className="mt-3">
                    Class of {profile.graduationYear || "N/A"}
                  </Badge>
                </div>

                <Separator className="my-6" />

                {/* Navigation */}
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {tabs.find((t) => t.id === activeTab)?.label}
                </CardTitle>
                <CardDescription>
                  {activeTab === "personal" &&
                    "Update your personal information and contact details"}
                  {activeTab === "education" &&
                    "Add your educational background and academic achievements"}
                  {activeTab === "experience" &&
                    "Showcase your experience, skills, and expertise"}
                  {activeTab === "links" &&
                    "Add links to your professional profiles and upload your resume"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Info Tab */}
                {activeTab === "personal" && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="bg-gray-50 dark:bg-gray-800"
                      />
                      <p className="text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          placeholder="City, State/Country"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        placeholder="Write a brief introduction about yourself..."
                        rows={4}
                        className="resize-none"
                      />
                      <p className="text-xs text-gray-500">
                        {profile.bio?.length || 0}/500 characters
                      </p>
                    </div>
                  </>
                )}

                {/* Education Tab */}
                {activeTab === "education" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="university">
                        University/College{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="university"
                        value={profile.university}
                        onChange={(e) =>
                          handleInputChange("university", e.target.value)
                        }
                        placeholder="Enter your institution name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="major">Major/Field of Study</Label>
                      <Input
                        id="major"
                        value={profile.major || ""}
                        onChange={(e) =>
                          handleInputChange("major", e.target.value)
                        }
                        placeholder="e.g., Computer Science, Business Administration"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">
                          Expected Graduation
                        </Label>
                        <Input
                          id="graduationYear"
                          value={profile.graduationYear || ""}
                          onChange={(e) =>
                            handleInputChange("graduationYear", e.target.value)
                          }
                          placeholder="e.g., 2025"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA (Optional)</Label>
                        <Input
                          id="gpa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="4.0"
                          value={profile.gpa || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "gpa",
                              Number.parseFloat(e.target.value),
                            )
                          }
                          placeholder="e.g., 3.75"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                      <div className="flex gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Academic Information
                          </p>
                          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                            Your educational background helps organizations
                            understand your qualifications and academic
                            achievements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Experience & Skills Tab */}
                {activeTab === "experience" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="experience">
                        Work Experience & Projects
                      </Label>
                      <Textarea
                        id="experience"
                        value={profile.experience || ""}
                        onChange={(e) =>
                          handleInputChange("experience", e.target.value)
                        }
                        placeholder="Describe your relevant work experience, internships, projects, and leadership roles..."
                        rows={8}
                        className="resize-none font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        Include company names, roles, dates, and key
                        accomplishments
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Skills & Technologies</Label>

                      {/* Add Skill Input */}
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill (e.g., React, Python, Design)"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={addSkill}
                          variant="secondary"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add
                        </Button>
                      </div>

                      {/* Skills Display */}
                      {skillsList.length > 0 ? (
                        <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                          {skillsList.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="py-1.5 pr-1 pl-3 text-sm"
                            >
                              {skill}
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 rounded-full p-0.5 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No skills added yet. Add your first skill above!
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        Add relevant programming languages, frameworks, tools,
                        and soft skills
                      </p>
                    </div>
                  </>
                )}

                {/* Links & Resume Tab */}
                {activeTab === "links" && (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          type="url"
                          value={profile.linkedin || ""}
                          onChange={(e) =>
                            handleInputChange("linkedin", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub Profile</Label>
                        <Input
                          id="github"
                          type="url"
                          value={profile.github || ""}
                          onChange={(e) =>
                            handleInputChange("github", e.target.value)
                          }
                          placeholder="https://github.com/yourusername"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio Website</Label>
                        <Input
                          id="portfolio"
                          type="url"
                          value={profile.portfolio || ""}
                          onChange={(e) =>
                            handleInputChange("portfolio", e.target.value)
                          }
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Resume Upload */}
                    <div className="space-y-3">
                      <Label>Resume/CV</Label>

                      {profile.resume ? (
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="rounded bg-blue-100 p-2 dark:bg-blue-900/20">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {profile.resume.split("/").pop()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Uploaded resume
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={profile.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setProfile({ ...profile, resume: "" })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 dark:border-gray-700">
                          <div className="text-center">
                            <Upload className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                            <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                              Upload your resume
                            </p>
                            <p className="mb-4 text-xs text-gray-500">
                              PDF, DOC, or DOCX (Max 5MB)
                            </p>
                            <label htmlFor="resume-upload">
                              <Button variant="outline" size="sm" asChild>
                                <span>Choose File</span>
                              </Button>
                              <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        Your resume will be shared with organizations when you
                        apply for internships
                      </p>
                    </div>
                  </>
                )}

                {/* Save Button */}
                <div className="flex justify-end border-t pt-6">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="lg"
                    className="min-w-[150px]"
                  >
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
