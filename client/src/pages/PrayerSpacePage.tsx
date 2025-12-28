import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Globe, Users, Calendar, Clock, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import type { Event } from "@shared/schema";
import missionPrayingImg from "@assets/Mission-praying_1749698677648.png";
import { formatSafeDate } from "@/lib/utils";

export default function PrayerSpacePage() {
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });
  
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Prayer Space | Prayer Watchman</title>
        <meta name="description" content="Explore prayer events and gatherings around the world. Join virtual or in-person prayer meetings and see the global impact of prayer." />
      </Helmet>
      
      {/* Hero Section with Image Background */}
      <div className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${missionPrayingImg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 
                style={{
                  fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
                  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: '800',
                  letterSpacing: '-0.02em',
                  color: 'white',
                  lineHeight: '1.1',
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  marginBottom: '3rem',
                  animation: 'slow-blink 4s ease-in-out infinite'
                }}
              >
                UNITE IN PRAYER
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                Join prayer warriors around the world in intercession, worship, and spiritual warfare. 
                Together we stand in the gap for the nations.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 shadow-xl">
                  Join Prayer Event
                </Button>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 shadow-xl">
                  View All Events
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="w-6 h-6 mr-2" />
                    <span className="text-3xl font-bold">156</span>
                  </div>
                  <p className="text-sm opacity-80">Countries Reached</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 mr-2" />
                    <span className="text-3xl font-bold">12,483</span>
                  </div>
                  <p className="text-sm opacity-80">Active Watchmen</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 mr-2" />
                    <span className="text-3xl font-bold">24/7</span>
                  </div>
                  <p className="text-sm opacity-80">Prayer Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Upcoming Events at Prayer Watchman</h2>
            <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join us for transformative prayer gatherings, worship sessions, and spiritual growth opportunities. 
              Connect with fellow believers and experience the power of united prayer across our global community.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : Array.isArray(events) && events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white overflow-hidden">
                    {/* Date Badge */}
                    <div className="relative">
                      {event.image_url && (
                        <div className="h-48 bg-gray-200 bg-cover bg-center" 
                             style={{ backgroundImage: `url(${event.image_url})` }}
                             onError={(e) => {
                               const target = e.target as HTMLDivElement;
                               target.style.backgroundImage = 'url(https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&h=384)';
                             }} />
                      )}
                      {!event.image_url && (
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600" />
                      )}
                      
                      <div className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-2 text-center min-w-[60px]">
                        <div className="text-xs font-medium">
                          {formatSafeDate(event.start_date, "MMM")}
                        </div>
                        <div className="text-lg font-bold">
                          {formatSafeDate(event.start_date, "d")}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatSafeDate(event.start_date, "h:mm a")} to {formatSafeDate(event.end_date, "h:mm a")}
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Scheduled</h3>
                <p className="text-gray-500">
                  Check back soon for upcoming prayer gatherings and spiritual events.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}