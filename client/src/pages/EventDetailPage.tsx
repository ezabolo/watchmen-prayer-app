import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { format } from "date-fns";
// import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";
import { formatSafeDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ContactOrganizerDialog from "@/components/ContactOrganizerDialog";

export default function EventDetailPage() {
  const [, params] = useRoute("/events/:id");
  const eventId = params?.id;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });

  // Check if user is already registered
  const { data: registration, isLoading: isCheckingRegistration } = useQuery({
    queryKey: [`/api/events/${eventId}/registration`],
    enabled: !!eventId && !!user,
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/events/${eventId}/register`, 'POST', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/registration`] });
      toast({
        title: "Registration Successful!",
        description: "You've successfully registered for this event. The organizer will be notified.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for the event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Debug removed - event loading successfully

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Link href="/prayer-space">
            <Button>Back to Prayer Space</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Helmet removed temporarily to fix TypeScript errors */}

      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        {event.image_url ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${event.image_url})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link href="/prayer-space">
                <Button variant="ghost" className="text-white hover:bg-white/20 mb-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Prayer Space
                </Button>
              </Link>
              
              <div className="text-white">
                <Badge className="mb-4 bg-teal-500 hover:bg-teal-600">
                  {event.category?.replace('_', ' ') || 'Prayer Event'}
                </Badge>
                
                <h1 
                  style={{
                    fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
                    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: '800',
                    letterSpacing: '-0.02em',
                    color: 'white',
                    lineHeight: '1.1',
                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    marginBottom: '2rem',
                    animation: 'slow-blink 4s ease-in-out infinite'
                  }}
                >
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap gap-6 text-lg opacity-90">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {formatSafeDate(event.start_date, "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {formatSafeDate(event.start_date, "h:mm a")} - {formatSafeDate(event.end_date, "h:mm a")}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                  <div className="prose prose-gray max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {event.description || "Join us for this special prayer gathering as we unite in intercession and worship."}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Content */}
              {event.content && (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
                    <div className="prose prose-gray max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: event.content }} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Media Gallery */}
              {event.media_urls && event.media_urls.length > 0 && (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Media</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.media_urls.map((mediaUrl: string, index: number) => (
                        <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          {mediaUrl.includes('.mp4') || mediaUrl.includes('.mov') ? (
                            <video 
                              src={mediaUrl} 
                              controls 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img 
                              src={mediaUrl} 
                              alt={`Event media ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Join Event Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                      <Users className="w-8 h-8 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Join This Event</h3>
                    <p className="text-sm text-gray-600">
                      Be part of this prayer gathering and experience the power of united intercession.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {user ? (
                      <>
                        {registration ? (
                          <div className="text-center py-3">
                            <div className="flex items-center justify-center text-green-600 mb-2">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              <span className="font-medium">You're Registered!</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              You've successfully registered for this event.
                            </p>
                          </div>
                        ) : (
                          <Button 
                            className="w-full bg-teal-600 hover:bg-teal-700" 
                            onClick={() => registerMutation.mutate()}
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? "Registering..." : "Register to Join"}
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-sm text-gray-600 mb-3">
                          Please log in to register for this event.
                        </p>
                        <Link href="/login">
                          <Button className="w-full bg-teal-600 hover:bg-teal-700">
                            Login to Register
                          </Button>
                        </Link>
                      </div>
                    )}
                    <Button variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Event
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Event Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date & Time
                      </div>
                      <p className="font-medium">
                        {formatSafeDate(event.start_date, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatSafeDate(event.start_date, "h:mm a")} - {formatSafeDate(event.end_date, "h:mm a")}
                      </p>
                    </div>
                    
                    {event.location && (
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4 mr-2" />
                          Location
                        </div>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Users className="w-4 h-4 mr-2" />
                        Category
                      </div>
                      <Badge variant="outline">
                        {event.category?.replace('_', ' ') || 'Prayer Event'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Have questions about this event? Contact our prayer team for assistance.
                  </p>
                  <ContactOrganizerDialog event={event}>
                    <Button variant="outline" className="w-full">
                      Contact Organizers
                    </Button>
                  </ContactOrganizerDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}