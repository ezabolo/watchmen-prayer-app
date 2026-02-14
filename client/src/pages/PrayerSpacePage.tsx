import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Globe, Users, Calendar, Clock, MapPin, Eye, CheckCircle, Gift } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
      
      <section 
        className="relative min-h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${missionPrayingImg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: 'white',
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              marginBottom: '1.5rem',
              animation: 'slow-blink 4s ease-in-out infinite'
            }}
          >
            UNITE IN PRAYER
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join prayer warriors around the world in intercession, worship, and spiritual warfare. 
            Together we stand in the gap for the nations.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wide">
              Join Prayer Event
            </Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold">
              View All Events
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 mr-2 text-yellow-400" />
                <span className="text-3xl font-bold text-white">156</span>
              </div>
              <p className="text-sm text-gray-300">Countries Reached</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 mr-2 text-yellow-400" />
                <span className="text-3xl font-bold text-white">12,483</span>
              </div>
              <p className="text-sm text-gray-300">Active Watchmen</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 mr-2 text-yellow-400" />
                <span className="text-3xl font-bold text-white">24/7</span>
              </div>
              <p className="text-sm text-gray-300">Prayer Coverage</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 sm:mb-6">
              OUR PRAYER FOCUS
            </h2>
            <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl text-blue-800 font-medium leading-relaxed">
                Standing in the gap for the nations through united intercession, worship, and spiritual warfare
              </p>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            <div className="space-y-8 mb-12 lg:mb-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    INTERCESSION FOR ALL NATIONS
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "I exhort therefore, that, first of all, supplications, prayers, intercessions, and giving of thanks, be made for all men"
                    <span className="font-medium"> 1 Timothy 2:1</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    SPIRITUAL WARFARE AND REVIVAL
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "For the weapons of our warfare are not carnal, but mighty through God to the pulling down of strong holds"
                    <span className="font-medium"> 2 Corinthians 10:4</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    UNITY OF THE BODY OF CHRIST
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "That they all may be one; as thou, Father, art in me, and I in thee, that they also may be one in us"
                    <span className="font-medium"> John 17:21</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    THE RETURN OF THE LORD JESUS CHRIST
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "He which testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus"
                    <span className="font-medium"> Revelation 22:20</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-8">
              <div className="shadow-2xl">
                <img
                  src={missionPrayingImg}
                  alt="Prayer gathering with people from different nations"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              UPCOMING EVENTS
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-lg">
              Join us for transformative prayer gatherings, worship sessions, and spiritual growth opportunities. 
              Connect with fellow believers and experience the power of united prayer across our global community.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading events...</p>
            </div>
          ) : Array.isArray(events) && events.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="group">
                    <div className="bg-white overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        {event.image_url ? (
                          <div 
                            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                            style={{ backgroundImage: `url(${event.image_url})` }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600" />
                        )}
                        <div className="absolute top-4 left-4 bg-yellow-400 text-blue-900 px-3 py-2 text-center min-w-[60px] font-bold">
                          <div className="text-xs font-medium">
                            {formatSafeDate(event.start_date, "MMM")}
                          </div>
                          <div className="text-lg font-bold">
                            {formatSafeDate(event.start_date, "d")}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
                          {event.title}
                        </h3>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                          {formatSafeDate(event.start_date, "h:mm a")} to {formatSafeDate(event.end_date, "h:mm a")}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">No Events Scheduled</h3>
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
