# Newtern 🚀

**Newtern** (New Intern) is a modern virtual internship platform that connects organizations with talented interns. Organizations can create and host online internships, which are reviewed and approved by administrators. Interns can discover opportunities, apply, and work on projects once accepted.

## ✨ Features

### 👥 For Interns

- **Browse Opportunities**: Discover approved internships with detailed information
- **Apply with Ease**: Submit applications with resume and cover letter uploads
- **Track Progress**: Monitor application status and internship progress
- **Task Management**: Complete tasks, submit work, and track your progress
- **Profile Management**: Build a comprehensive profile with skills, education, and portfolio links
- **Dashboard**: Centralized view of applications, active internships, and completed work

### 🏢 For Organizations

- **Create Internships**: Multi-step wizard to create detailed internship postings
- **Task Creation**: Build structured tasks with resources, videos, and submission instructions
- **Application Management**: Review, accept, or reject intern applications
- **Intern Management**: Track intern progress and engagement
- **Publishing Control**: Publish internships for admin review before they go live
- **Analytics**: Monitor application metrics and intern performance

### 👨‍💼 For Administrators

- **Approval System**: Review and approve internship postings before they're published
- **Platform Oversight**: Manage the quality and integrity of listed opportunities
- **User Management**: Monitor platform users and their activities

## 🛠️ Tech Stack

This project is built with the **[T3 Stack](https://create.t3.gg/)** - a modern, full-stack TypeScript solution:

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Database**: [PostgreSQL](https://www.postgresql.org) with [Prisma ORM](https://www.prisma.io)
- **Authentication**: [Better Auth](https://www.better-auth.com) with Google OAuth
- **API Layer**: [tRPC](https://trpc.io) for end-to-end type-safe APIs
- **Styling**: [Tailwind CSS](https://tailwindcss.com) with [Radix UI](https://www.radix-ui.com) components
- **Form Management**: [React Hook Form](https://react-hook-form.com) with [Zod](https://zod.dev) validation
- **State Management**: [TanStack Query](https://tanstack.com/query) for server state
- **Package Manager**: [pnpm](https://pnpm.io)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io/installation) 10.5.2+
- [PostgreSQL](https://www.postgresql.org/download/) 14+ (or Docker for local development)
- [Git](https://git-scm.com/downloads)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd newtern
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/newtern?schema=public"

# Authentication
AUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Node Environment
NODE_ENV="development"
```

**Note**:

- Generate `AUTH_SECRET` using: `openssl rand -base64 32`
- Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)

### 4. Set Up Database

#### Option A: Using Docker (Recommended for Development)

```bash
# Make the script executable (Linux/macOS)
chmod +x start-database.sh

# Run the script
./start-database.sh
```

For Windows, use WSL or run the Docker commands manually.

#### Option B: Local PostgreSQL

Create a database and update your `DATABASE_URL` accordingly.

### 5. Run Database Migrations

```bash
pnpm db:generate
pnpm db:push
```

### 6. (Optional) Seed the Database

```bash
pnpm db:seed
```

This will create sample data including organizations, interns, internships, and applications.

### 7. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
newtern/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Database seed script
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/                # API routes
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── admin/          # Admin dashboard
│   │   │   ├── intern/         # Intern dashboard
│   │   │   └── organization/   # Organization dashboard
│   │   └── internships/        # Public internship listings
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboards/         # Dashboard components
│   │   ├── intern/             # Intern-specific components
│   │   ├── organization/       # Organization-specific components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and configs
│   │   ├── validation/         # Zod validation schemas
│   │   ├── auth.ts             # Authentication setup
│   │   └── utils.ts            # Utility functions
│   ├── server/                 # Server-side code
│   │   ├── api/                # tRPC routers
│   │   │   └── routers/        # API route handlers
│   │   └── db.ts               # Prisma client
│   ├── styles/                 # Global styles
│   └── trpc/                   # tRPC client setup
├── uploads/                    # User-uploaded files (gitignored)
└── README.md
```

## 🎯 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format:check` - Check code formatting
- `pnpm format:write` - Format code
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm db:generate` - Generate Prisma migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed the database

## 🔐 Authentication & Authorization

The platform uses role-based access control (RBAC) with three user roles:

- **INTERN**: Default role for students seeking internships
- **ORGANIZATION**: For companies creating internship opportunities
- **ADMIN**: Platform administrators with approval powers

Authentication is handled via Better Auth with Google OAuth support. Session management and user profiles are managed through Prisma.

## 📝 Database Schema Highlights

Key models in the database:

- **User**: Base user authentication and role management
- **InternProfile**: Extended profile for intern users
- **OrganizationProfile**: Extended profile for organization users
- **Internship**: Internship postings with approval workflow
- **Task**: Individual tasks within internships
- **Application**: Intern applications to internships
- **TaskProgress**: Tracking of intern task completion
- **InternshipProgress**: Overall internship completion tracking
- **Resource**: Files and URLs attached to tasks

## 🚢 Deployment

This application can be deployed to various platforms:

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

The Vercel deployment guide for T3 Stack can be found [here](https://create.t3.gg/en/deployment/vercel).

### Other Platforms

- [Netlify Deployment Guide](https://create.t3.gg/en/deployment/netlify)
- [Docker Deployment Guide](https://create.t3.gg/en/deployment/docker)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's linting and formatting standards.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [create-t3-app](https://create.t3.gg/)
- UI components from [Radix UI](https://www.radix-ui.com)
- Icons from [Lucide](https://lucide.dev)

---

**Made with ❤️ for connecting talent with opportunity**
