import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@shared/schema";

export default function CurrentCampaigns() {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });
  
  // Get the last 3 prayer events created by admin
  const recentEvents = events && Array.isArray(events) ? events.slice(-3).reverse() : [];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">
            CURRENT PRAYER REVIVALS
          </h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join ongoing prayer movements targeting specific nations and regions around the world
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentEvents.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {recentEvents.map((event: Event) => (
              <Card key={event.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    className="h-64 w-full object-cover" 
                    src={event.image_url || "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&h=384"} 
                    alt={event.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&h=384";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-teal-500 text-white text-center px-3 py-2 rounded-lg text-sm font-semibold">
                      <div className="text-xs uppercase">
                        {event.start_date && !isNaN(new Date(event.start_date).getTime()) 
                          ? new Date(event.start_date).toLocaleDateString('en', { month: 'short' })
                          : 'TBD'
                        }
                      </div>
                      <div className="text-lg font-bold">
                        {event.start_date && !isNaN(new Date(event.start_date).getTime()) 
                          ? new Date(event.start_date).getDate()
                          : '?'
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {event.category && event.category.charAt(0).toUpperCase() + event.category.slice(1)} Prayer
                    </span>
                    {event.location && (
                      <span>📍 {event.location}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🙏</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Prayer Campaigns Yet</h3>
            <p className="text-gray-500">Prayer events created by admins will appear here</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 text-lg">
            <Link to="/prayer-space">
              VIEW ALL PRAYER CAMPAIGNS
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
