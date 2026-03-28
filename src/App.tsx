import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { LoginForm } from "@/components/auth/LoginForm"
import { AdminLoadingSpinner } from "@/components/admin/AdminLoadingSpinner"
import { lazy, Suspense, useEffect } from "react"
import { useAuthStore } from "@/stores/useAuthStore"

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./pages/admin/DashboardPage").then(module => ({ default: module.DashboardPage })))
const ProjectsManagement = lazy(() => import("./pages/admin/ProjectsPage").then(module => ({ default: module.ProjectsPage })))
const CertificatesManagement = lazy(() => import("./pages/admin/CertificatesPage").then(module => ({ default: module.CertificatesPage })))
const WorkExperienceManagement = lazy(() => import("./pages/admin/WorkExperiencePage").then(module => ({ default: module.WorkExperiencePage })))
const ToolsManagement = lazy(() => import("./pages/admin/ToolsPage").then(module => ({ default: module.ToolsPage })))
const ContactManagement = lazy(() => import("./pages/admin/ContactPage").then(module => ({ default: module.ContactPage })))
const AnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage").then(module => ({ default: module.AnalyticsPage })))
const HeroSettingsPage = lazy(() => import("./pages/admin/HeroSettingsPage").then(module => ({ default: module.HeroSettingsPage })))
const AboutSectionPage = lazy(() => import("./pages/admin/AboutSectionPage").then(module => ({ default: module.AboutSectionPage })))
const SkillsPage = lazy(() => import("./pages/admin/SkillsPage").then(module => ({ default: module.SkillsPage })))

const queryClient = new QueryClient()

const App = () => {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<LoginForm />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <AdminDashboard />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/hero" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <HeroSettingsPage />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/about" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <AboutSectionPage />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/skills" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <SkillsPage />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <ProjectsManagement />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/certificates" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <CertificatesManagement />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/work-experience" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <WorkExperienceManagement />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/tools" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <ToolsManagement />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/contact" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <ContactManagement />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <AnalyticsPage />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Catch-all redirect to admin */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App

