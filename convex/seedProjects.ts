/**
 * Convex seed mutation — populates the projects table.
 *
 * Run from Jumawan_Portfolio-Admin/:
 *   npx convex run seedProjects:seed
 *
 * To wipe and re-seed at any time just run the command again.
 */
import { internalMutation } from "./_generated/server";

const GRADIENTS = [
  "from-sky-400 to-blue-600",
  "from-blue-600 to-indigo-700",
  "from-cyan-400 to-sky-600",
  "from-indigo-400 to-blue-600",
  "from-emerald-400 to-cyan-600",
  "from-violet-400 to-purple-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-600",
] as const;

type ProjectSeed = {
  title: string;
  description: string;
  about: string;
  category: string;
  year: string;
  gradient: string;
  technologies: string[];
  featured: boolean;
  is_active: boolean;
  image_url?: string;
  live_url?: string;
  github_url?: string;
};

const PROJECTS: ProjectSeed[] = [
  {
    title: "Hopelink v2",
    category: "Web App",
    year: "2026",
    description:
      "Community-driven donation management platform connecting donors, recipients, and volunteers.",
    about:
      "A full-stack donation platform with smart matching algorithm, logistics tracking, community events, analytics dashboards, and geospatial integration. Built for real-world impact.",
    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Supabase",
      "Express.js",
      "Zustand",
      "Framer Motion",
    ],
    gradient: GRADIENTS[0],
    featured: true,
    is_active: true,
  },
  {
    title: "LDCU Clinic",
    category: "Web App",
    year: "2026",
    description:
      "Full-stack medical and dental appointment management system for Liceo de Cagayan University.",
    about:
      "Online booking, multi-campus support, 7 user roles with Row-Level Security, schedule management, nurse assignment, and audit logs. Deployed on Vercel with Supabase backend.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Zustand",
      "Zod",
    ],
    gradient: GRADIENTS[4],
    featured: true,
    is_active: true,
  },
  {
    title: "MSEUF Library Portal",
    category: "Web App",
    year: "2026",
    description:
      "AI-powered academic library portal with embedded chatbot for Manuel S. Enverga University Foundation.",
    about:
      "Combines a Next.js website, Convex backend, Google Drive-synced digital catalog, and an AI librarian chatbot (ROSe) powered by Google Gemini for intelligent book search and recommendations.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Convex",
      "Google Gemini AI",
      "Tailwind CSS",
      "Zustand",
    ],
    gradient: GRADIENTS[5],
    featured: true,
    is_active: true,
  },
  {
    title: "EduCatch Lite",
    category: "Web App",
    year: "2026",
    description:
      "Simplified catch-up planner for students who miss classes due to competitions.",
    about:
      "Track missed lessons, generate study schedules, and monitor progress with auto-generated timelines. Built with Next.js and Convex for real-time data sync.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Convex", "Zustand"],
    gradient: GRADIENTS[3],
    featured: true,
    is_active: true,
  },
  {
    title: "MCA Portal",
    category: "Web App",
    year: "2025",
    description:
      "Full-stack school management system handling enrollment, grades, attendance, and multi-role access.",
    about:
      "Built for MCA Montessori School with Laravel and MySQL. Supports Admin, Instructor, and Student roles with secure authentication. Deployed on Hostinger.",
    technologies: ["PHP", "Laravel", "MySQL", "Bootstrap", "Blade", "JavaScript"],
    gradient: GRADIENTS[1],
    featured: false,
    is_active: true,
  },
  {
    title: "FakeGPS — Nodare GeoSec",
    category: "Mobile App",
    year: "2026",
    description:
      "Native Android GPS security and dispatch management app for field operations.",
    about:
      "Features 5-layer fake GPS detection, real-time tracking, route deviation monitoring, and role-based access control. Built with Kotlin, Firebase, and Google Maps SDK.",
    technologies: [
      "Kotlin",
      "Firebase",
      "Google Maps SDK",
      "Hilt",
      "Room",
      "Retrofit",
      "WorkManager",
    ],
    gradient: GRADIENTS[6],
    featured: false,
    is_active: true,
  },
  {
    title: "PCMonitoring",
    category: "Mobile App",
    year: "2026",
    description:
      "React Native mobile app for monitoring computer usage in an organizational environment.",
    about:
      "Real-time dashboards, session tracking, notifications, reports with charts, offline support, and a Python PC agent for Windows. Cross-platform with Expo.",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Firebase",
      "Python",
      "React Navigation",
    ],
    gradient: GRADIENTS[2],
    featured: false,
    is_active: true,
  },
  {
    title: "LDCU Tabulation",
    category: "Web App",
    year: "2026",
    description:
      "Dynamic tabulation system supporting scoring-based and ranking-based events.",
    about:
      "Admin panel with dual tabulation modes, drag-and-drop ranking, image overlays, and responsive design. Powered by Supabase for real-time updates.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Supabase",
    ],
    gradient: GRADIENTS[0],
    featured: false,
    is_active: true,
  },
  {
    title: "Liceo Attendance Scanner",
    category: "Web App",
    year: "2026",
    description: "QR-based attendance scanning system for LDCU built with SvelteKit.",
    about:
      "Uses Svelte with TypeScript, Tailwind CSS, and Bun as the runtime. Fast, lightweight attendance tracking with QR code scanning.",
    technologies: ["Svelte", "SvelteKit", "TypeScript", "Tailwind CSS", "Bun"],
    gradient: GRADIENTS[4],
    featured: false,
    is_active: true,
  },
  {
    title: "School Management System",
    category: "Web App",
    year: "2026",
    description:
      "Comprehensive web-based school management system with role-based access control.",
    about:
      "Manages attendance, grades, schedules, subjects, courses, and excuse letters. Supports admins, deans, coordinators, instructors, and students.",
    technologies: [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Radix UI",
      "MySQL",
      "Vercel",
    ],
    gradient: GRADIENTS[3],
    featured: false,
    is_active: true,
  },
  {
    title: "Mapping",
    category: "Web App",
    year: "2026",
    description:
      "Cemetery mapping and plot management web application with interactive maps.",
    about:
      "Built with React, Vite, Supabase, and Leaflet for interactive geospatial mapping. Manage plots, records, and locations visually.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Leaflet"],
    gradient: GRADIENTS[2],
    featured: false,
    is_active: true,
  },
  {
    title: "DreamHome",
    category: "Web App",
    year: "2025",
    description:
      "Flask-based real estate management system for properties, customers, and transactions.",
    about:
      "Multi-branch property management across Cagayan de Oro with multi-database MySQL architecture. Handles appointments, customers, and transaction records.",
    technologies: ["Python", "Flask", "MySQL", "Jinja2", "HTML", "CSS"],
    gradient: GRADIENTS[7],
    featured: false,
    is_active: true,
  },
  {
    title: "ClaimIT",
    category: "Mobile App",
    year: "2025",
    description: "Expo-based cross-platform mobile application with file-based routing.",
    about:
      "Built with create-expo-app for cross-platform development targeting Android, iOS, and web from a single codebase.",
    technologies: ["TypeScript", "JavaScript", "Expo", "React Native"],
    gradient: GRADIENTS[1],
    featured: false,
    is_active: true,
  },
  {
    title: "AppomodoroTimer",
    category: "Mobile App",
    year: "2025",
    description:
      "Pomodoro timer mobile app built with React Native CLI for Android and iOS.",
    about:
      "A productivity timer app using the Pomodoro technique. Supports both platforms with Metro bundler for hot-reloading during development.",
    technologies: ["React Native", "JavaScript", "TypeScript", "Kotlin", "Swift"],
    gradient: GRADIENTS[6],
    featured: false,
    is_active: true,
  },
  {
    title: "AugustOne",
    category: "Web App",
    year: "2025",
    description: "A TypeScript-based web project built with modern frontend tooling.",
    about: "Web application built with TypeScript, CSS, and JavaScript. Deployed on Vercel.",
    technologies: ["TypeScript", "CSS", "JavaScript"],
    gradient: GRADIENTS[5],
    featured: false,
    is_active: true,
  },
  {
    title: "Hearts",
    category: "Web App",
    year: "2026",
    description: "A web project built with Vite, React, shadcn-ui, and Tailwind CSS.",
    about:
      "Modern React application with shadcn-ui component library and Tailwind CSS for styling. Built with Vite for fast development.",
    technologies: ["TypeScript", "React", "Vite", "shadcn-ui", "Tailwind CSS"],
    gradient: GRADIENTS[6],
    featured: false,
    is_active: true,
  },
  {
    title: "ITISDEV MVPc",
    category: "Web App",
    year: "2026",
    description:
      "Application development project built with JavaScript and Handlebars templating.",
    about:
      "Course project for ITISDEV using server-rendered Handlebars templates with JavaScript, HTML, and CSS.",
    technologies: ["JavaScript", "HTML", "Handlebars", "CSS"],
    gradient: GRADIENTS[7],
    featured: false,
    is_active: true,
  },
  {
    title: "LibraryMS",
    category: "Web App",
    year: "2025",
    description: "Library management system built with React, shadcn-ui, and Tailwind CSS.",
    about:
      "A library management application using Vite, TypeScript, React, and the shadcn-ui component library for a polished UI.",
    technologies: ["TypeScript", "React", "Vite", "shadcn-ui", "Tailwind CSS"],
    gradient: GRADIENTS[0],
    featured: false,
    is_active: true,
  },
  {
    title: "mini-love-game",
    category: "Web App",
    year: "2026",
    description: "A small web game exploring simple game mechanics around choices and outcomes.",
    about:
      "Built with React and Vite, featuring interactive game mechanics with affection systems and branching outcomes.",
    technologies: ["TypeScript", "React", "Vite", "shadcn-ui", "Tailwind CSS"],
    gradient: GRADIENTS[6],
    featured: false,
    is_active: true,
  },
  {
    title: "GBTAC",
    category: "Web App",
    year: "2026",
    description: "A JavaScript and Python full-stack application.",
    about:
      "Full-stack project combining JavaScript frontend with Python backend services.",
    technologies: ["JavaScript", "Python", "CSS"],
    gradient: GRADIENTS[4],
    featured: false,
    is_active: true,
  },
  {
    title: "Fitness Tracker",
    category: "Desktop App",
    year: "2026",
    description: "Desktop fitness tracking application built with Java Swing and MySQL.",
    about:
      "Demonstrates OOP, data structures (QuickSort, Binary Search), and database integration for workout and meal tracking. Built with Maven.",
    technologies: ["Java", "Java Swing", "Maven", "MySQL"],
    gradient: GRADIENTS[2],
    featured: false,
    is_active: true,
  },
  {
    title: "PayrollProject",
    category: "Backend",
    year: "2025",
    description: "A Python-based payroll computation system.",
    about:
      "Backend payroll system handling employee salary calculations, deductions, and reporting. Built entirely in Python.",
    technologies: ["Python"],
    gradient: GRADIENTS[7],
    featured: false,
    is_active: true,
  },
  {
    title: "Umelec",
    category: "Mobile App",
    year: "2025",
    description: "A native Android application built with Kotlin.",
    about:
      "Native Android project using Kotlin for the core application logic with some JavaScript integration.",
    technologies: ["Kotlin", "JavaScript"],
    gradient: GRADIENTS[5],
    featured: false,
    is_active: true,
  },
];

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    // 1. Wipe existing projects
    const existing = await ctx.db.query("projects").collect();
    await Promise.all(existing.map((p) => ctx.db.delete(p._id)));
    console.log(`Deleted ${existing.length} existing projects.`);

    // 2. Insert fresh seed data
    for (let i = 0; i < PROJECTS.length; i++) {
      const p = PROJECTS[i];
      await ctx.db.insert("projects", {
        title: p.title,
        description: p.description,
        about: p.about,
        category: p.category,
        year: p.year,
        gradient: p.gradient,
        technologies: p.technologies,
        featured: p.featured,
        is_active: p.is_active,
        order_index: i + 1,
        image_url: p.image_url,
        live_url: p.live_url,
        github_url: p.github_url,
      });
      console.log(`  ✓ [${i + 1}/${PROJECTS.length}] ${p.title}`);
    }

    console.log(`\n✅ Seeded ${PROJECTS.length} projects into Convex.`);
    return { seeded: PROJECTS.length };
  },
});
