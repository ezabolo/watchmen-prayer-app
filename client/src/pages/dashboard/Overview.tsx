import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import WatchmanDashboard from "./WatchmanDashboard";
import PartnerDashboard from "./PartnerDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardOverview() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Route to appropriate dashboard based on user role
  return (
    <>
      <Helmet>
        <title>Dashboard | Prayer Watchman</title>
        <meta name="description" content="Your Prayer Watchman dashboard. Monitor your progress and impact in the global prayer movement." />
      </Helmet>
      
      <div className="container px-4 mx-auto">
        {user.role === 'admin' ? (
          <AdminDashboard />
        ) : user.role === 'partner' ? (
          <PartnerDashboard />
        ) : (
          <WatchmanDashboard />
        )}
      </div>
    </>
  );
}
