import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  CheckCircle,
  Globe,
  Briefcase,
  Trophy,
  ArrowRight,
  Star,
  Clock,
  Target,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/nav-bar";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#for-interns", label: "For Interns" },
  { href: "#for-organizations", label: "For Organizations" },
  { href: "#pricing", label: "Pricing" },
];

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Header */}
      <Header links={navLinks} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="from-primary/5 via-background to-secondary/5 w-full bg-gradient-to-br py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-start space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    Virtual Internship Platform
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Bridge the Gap Between
                    <span className="text-primary"> Learning</span> and
                    <span className="text-primary"> Working</span>
                  </h1>
                  <p className="text-muted-foreground max-w-[600px] md:text-xl">
                    Newtern connects ambitious interns with forward-thinking
                    organizations through virtual internships. Complete
                    real-world tasks, build your portfolio, and launch your
                    career from anywhere.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="h-12 px-8" asChild>
                    <Link href={"/internships"}>
                      Find Internships <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Post Internships
                  </Button>
                </div>
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>10,000+ Active Interns</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>500+ Organizations</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/hero-section-image.png"
                  width="600"
                  height="600"
                  alt="Newtern Platform Dashboard"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Platform Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need for Virtual Internships
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive platform provides all the tools needed for
                  successful virtual internship experiences.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card>
                <CardHeader>
                  <Globe className="text-primary h-10 w-10" />
                  <CardTitle>Global Accessibility</CardTitle>
                  <CardDescription>
                    Connect with opportunities worldwide. Work remotely from
                    anywhere.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle className="text-primary h-10 w-10" />
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>
                    Structured task-based internships with clear deliverables
                    and deadlines.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Trophy className="text-primary h-10 w-10" />
                  <CardTitle>Skill Validation</CardTitle>
                  <CardDescription>
                    Earn certificates and build a portfolio of completed
                    projects.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="text-primary h-10 w-10" />
                  <CardTitle>Flexible Scheduling</CardTitle>
                  <CardDescription>
                    Work at your own pace with flexible deadlines and
                    scheduling.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="text-primary h-10 w-10" />
                  <CardTitle>Secure Platform</CardTitle>
                  <CardDescription>
                    Enterprise-grade security for all submissions and
                    communications.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Target className="text-primary h-10 w-10" />
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Real-time progress tracking and feedback from mentors.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* For Interns Section */}
        <section
          id="for-interns"
          className="bg-muted/50 w-full py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <Image
                src="/student-internship-dashboard.png"
                width="600"
                height="500"
                alt="Intern Dashboard"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary">For Interns</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Launch Your Career with Real Experience
                  </h2>
                  <p className="text-muted-foreground max-w-[600px] md:text-xl/relaxed">
                    Discover internships that match your skills and interests.
                    Complete meaningful tasks and build a portfolio that stands
                    out.
                  </p>
                </div>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>
                      Browse thousands of virtual internship opportunities
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>
                      Complete task-based projects with real-world impact
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>Submit work online and receive instant feedback</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>
                      Build a portfolio of completed internship projects
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>Earn certificates and recommendations</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/auth/signup">
                      <span>Start Your Journey</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    View Sample Tasks
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Organizations Section */}
        <section
          id="for-organizations"
          className="w-full py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[500px_1fr] lg:gap-12 xl:grid-cols-[600px_1fr]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary">For Organizations</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Find Top Talent and Scale Your Team
                  </h2>
                  <p className="text-muted-foreground max-w-[600px] md:text-xl/relaxed">
                    Post internships with multiple tasks, evaluate candidates
                    through real work, and build a pipeline of qualified talent.
                  </p>
                </div>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>
                      Create structured internships with multiple tasks
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>Access a global pool of talented interns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>Review and evaluate submissions online</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>
                      Track progress and provide feedback in real-time
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>Identify and recruit top performers</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">
                    Post Internships
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    See Success Stories
                  </Button>
                </div>
              </div>
              <Image
                src="/internship-candidate-dashboard.png"
                width="600"
                height="500"
                alt="Organization Dashboard"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-muted/50 w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">How It Works</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Simple Steps to Success
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started with Newtern in just a few simple steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="bg-primary text-primary-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
                    1
                  </div>
                  <CardTitle>Sign Up & Create Profile</CardTitle>
                  <CardDescription>
                    Create your account and build a comprehensive profile
                    showcasing your skills and interests.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="bg-primary text-primary-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
                    2
                  </div>
                  <CardTitle>Find & Apply</CardTitle>
                  <CardDescription>
                    Browse internships, review task requirements, and apply to
                    opportunities that match your goals.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="bg-primary text-primary-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
                    3
                  </div>
                  <CardTitle>Complete & Submit</CardTitle>
                  <CardDescription>
                    Work on assigned tasks, submit your deliverables online, and
                    receive feedback from mentors.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Testimonials</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  What Our Community Says
                </h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className="fill-primary text-primary h-4 w-4"
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    &quot;Newtern helped me land my dream job! The virtual
                    internships gave me real-world experience and a portfolio
                    that impressed employers.&quot;
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-8 w-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Sarah Chen</p>
                      <p className="text-muted-foreground text-xs">
                        Software Engineering Intern
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className="fill-primary text-primary h-4 w-4"
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    &quot;As a startup, Newtern allowed us to tap into global
                    talent and find amazing interns who contributed meaningfully
                    to our projects.&quot;
                  </CardDescription>

                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-8 w-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Michael Rodriguez</p>
                      <p className="text-muted-foreground text-xs">
                        CTO, TechStart Inc.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-primary-foreground/80 mx-auto max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of interns and organizations already using
                  Newtern to build the future of work.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-primary-foreground text-primary max-w-lg flex-1"
                  />
                  <Button type="submit" variant="secondary">
                    Get Started
                  </Button>
                </form>
                <p className="text-primary-foreground/60 text-xs">
                  Start your free trial today. No credit card required.
                </p>
              </div>
            </div>
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
            Terms of Service
          </Link>
          <Link href="#" className="text-xs underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs underline-offset-4 hover:underline">
            Contact
          </Link>
          <Link href="#" className="text-xs underline-offset-4 hover:underline">
            Help Center
          </Link>
        </nav>
      </footer>
    </div>
  );
}
