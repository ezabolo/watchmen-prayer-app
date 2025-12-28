import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import RootLayout from "@/layouts/RootLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import WatchmanPage from "@/pages/WatchmanPage";
import PartnerPage from "@/pages/PartnerPage";
import DonatePage from "@/pages/DonatePage";
import StripeCheckoutPage from "@/pages/StripeCheckoutPage";
import DonateSuccessPage from "@/pages/DonateSuccessPage";
import BooksPage from "@/pages/BooksPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";

import PrayerSpacePage from "@/pages/PrayerSpacePage";
import TrainingPage from "@/pages/TrainingPage";
import TrainingDetailPage from "@/pages/TrainingDetailPage";
import SectionContentPage from "@/pages/SectionContentPage";
import VideoPlayerPage from "@/pages/VideoPlayerPage";
import TrainingContentViewer from "@/pages/TrainingContentViewer";
import EventDetailPage from "@/pages/EventDetailPage";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardOverview from "@/pages/dashboard/Overview";
import WatchmanDashboard from "@/pages/dashboard/WatchmanDashboard";
import PartnerDashboard from "@/pages/dashboard/PartnerDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import AdminUsersPage from "@/pages/dashboard/AdminUsersPage";
import AdminEventsPage from "@/pages/dashboard/AdminEventsPage";
import AdminTrainingPage from "@/pages/dashboard/AdminTrainingPage";
import AdminRequestsPage from "@/pages/dashboard/AdminRequestsPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import { useAuth } from "./hooks/useAuth";

function Router() {
  const { user } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={() => (
        <RootLayout>
          <HomePage />
        </RootLayout>
      )} />
      
      <Route path="/login" component={() => (
        <RootLayout>
          <LoginPage />
        </RootLayout>
      )} />
      
      <Route path="/register" component={() => (
        <RootLayout>
          <RegisterPage />
        </RootLayout>
      )} />
      
      <Route path="/watchman" component={() => (
        <RootLayout>
          <WatchmanPage />
        </RootLayout>
      )} />
      
      <Route path="/partner" component={() => (
        <RootLayout>
          <PartnerPage />
        </RootLayout>
      )} />
      
      <Route path="/donate" component={() => (
        <RootLayout>
          <DonatePage />
        </RootLayout>
      )} />
      
      <Route path="/stripe-checkout" component={() => (
        <RootLayout>
          <StripeCheckoutPage />
        </RootLayout>
      )} />
      
      <Route path="/donate/success" component={() => (
        <RootLayout>
          <DonateSuccessPage />
        </RootLayout>
      )} />
      
      <Route path="/books" component={() => (
        <RootLayout>
          <BooksPage />
        </RootLayout>
      )} />
      
      <Route path="/cart" component={() => (
        <RootLayout>
          <CartPage />
        </RootLayout>
      )} />
      
      <Route path="/checkout" component={() => (
        <RootLayout>
          <CheckoutPage />
        </RootLayout>
      )} />
      
      <Route path="/prayer-space" component={() => (
        <RootLayout>
          <PrayerSpacePage />
        </RootLayout>
      )} />
      
      <Route path="/training" component={() => (
        <RootLayout>
          <TrainingPage />
        </RootLayout>
      )} />
      
      <Route path="/projects" component={() => (
        <RootLayout>
          <ProjectsPage />
        </RootLayout>
      )} />
      
      <Route path="/training/:id" component={() => (
        <RootLayout>
          <TrainingDetailPage />
        </RootLayout>
      )} />
      
      <Route path="/events/:id" component={() => (
        <RootLayout>
          <EventDetailPage />
        </RootLayout>
      )} />
      
      <Route path="/training/:id/chapter/:chapterId/section/:sectionId" component={() => (
        <SectionContentPage />
      )} />
      
      <Route path="/training/:trainingId/player" component={() => (
        <VideoPlayerPage />
      )} />
      
      {/* Dashboard routes (always available, authentication handled in components) */}
      <Route path="/dashboard" component={() => (
        <DashboardLayout>
          {user?.role === 'admin' ? <AdminDashboard /> : 
           user?.role === 'partner' ? <PartnerDashboard /> : 
           <WatchmanDashboard />}
        </DashboardLayout>
      )} />

      <Route path="/dashboard/users" component={() => (
        <DashboardLayout>
          {user?.role === 'admin' || user?.role === 'regional_leader' ? <AdminUsersPage /> : <WatchmanDashboard />}
        </DashboardLayout>
      )} />
      <Route path="/dashboard/events" component={() => (
        <DashboardLayout>
          {user?.role === 'admin' ? <AdminEventsPage /> : <WatchmanDashboard />}
        </DashboardLayout>
      )} />
      <Route path="/dashboard/requests" component={() => (
        <DashboardLayout>
          {user?.role === 'admin' ? <AdminRequestsPage /> : <WatchmanDashboard />}
        </DashboardLayout>
      )} />
      <Route path="/dashboard/training" component={() => (
        <DashboardLayout>
          {user?.role === 'admin' ? <AdminTrainingPage /> : <WatchmanDashboard />}
        </DashboardLayout>
      )} />
      <Route path="/dashboard/reports" component={() => (
        <DashboardLayout>
          {user?.role === 'admin' ? <AdminDashboard /> : 
           user?.role === 'partner' ? <PartnerDashboard /> : 
           <WatchmanDashboard />}
        </DashboardLayout>
      )} />
      <Route path="/dashboard/settings" component={() => (
        <DashboardLayout>
          {user?.role === 'admin' ? <AdminDashboard /> : 
           user?.role === 'partner' ? <PartnerDashboard /> : 
           <WatchmanDashboard />}
        </DashboardLayout>
      )} />
      <Route path="/dashboard/watchman" component={() => (
        <DashboardLayout>
          <WatchmanDashboard />
        </DashboardLayout>
      )} />
      <Route path="/dashboard/partner" component={() => (
        <DashboardLayout>
          <PartnerDashboard />
        </DashboardLayout>
      )} />
      <Route path="/dashboard/admin" component={() => (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      )} />
      <Route path="/admin/dashboard" component={() => (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      )} />
      <Route path="/admin/settings" component={() => (
        <AdminSettingsPage />
      )} />
      
      {/* Fallback to 404 */}
      <Route component={() => (
        <RootLayout>
          <NotFound />
        </RootLayout>
      )} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
