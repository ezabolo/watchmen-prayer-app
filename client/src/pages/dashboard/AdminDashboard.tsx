import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, BookOpen, Users, BarChart3, Plus, Edit, Book, ShoppingCart, Settings } from "lucide-react";
import { Link } from "wouter";
import EventFormDialog from "@/components/admin/EventFormDialog";
import StructuredTrainingDialog from "@/components/admin/StructuredTrainingDialog";
import BookFormDialogSimple from "@/components/admin/BookFormDialogSimple";
import AdminProjectsPage from "@/pages/admin/AdminProjectsPage";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [trainingFormOpen, setTrainingFormOpen] = useState(false);
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [editingTraining, setEditingTraining] = useState<any>(null);

  const { data: events = [] } = useQuery({
    queryKey: ['/api/events'],
  });

  const { data: trainings = [] } = useQuery({
    queryKey: ['/api/trainings'],
  });

  const { data: users = [] } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const { data: prayerRequests = [] } = useQuery({
    queryKey: ['/api/admin/prayer-requests'],
  });

  const { data: books = [] } = useQuery({
    queryKey: ['/api/books'],
  });

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setEventFormOpen(true);
  };

  const handleCloseEventForm = () => {
    setEventFormOpen(false);
    setEditingEvent(null);
  };

  const handleEditBook = (book: any) => {
    setEditingBook(book);
    setBookFormOpen(true);
  };

  const handleCloseBookForm = () => {
    setBookFormOpen(false);
    setEditingBook(null);
  };

  const handleCreateNewTraining = () => {
    setEditingTraining(null);
    setTrainingFormOpen(true);
  };

  const handleCloseTrainingForm = () => {
    setTrainingFormOpen(false);
    setEditingTraining(null);
  };

  const stats = [
    {
      title: "Total Users",
      value: (users as any[]).length,
      icon: Users,
      description: "Registered members"
    },
    {
      title: "Active Trainings",
      value: (trainings as any[]).length,
      icon: BookOpen,
      description: "Available courses"
    },
    {
      title: "Prayer Events",
      value: (events as any[]).length,
      icon: CalendarDays,
      description: "Published events"
    },
    {
      title: "Prayer Requests",
      value: (prayerRequests as any[]).length,
      icon: BarChart3,
      description: "Active requests"
    },
    {
      title: "Books Available",
      value: (books as any[]).length,
      icon: Book,
      description: "Books in store"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage content, users, and prayer activities</p>
        </div>
        <Link href="/admin/settings">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Management Tabs */}
      <Tabs defaultValue="books" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="events" className="text-xs lg:text-sm">Events</TabsTrigger>
          <TabsTrigger value="trainings" className="text-xs lg:text-sm">Training</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs lg:text-sm">Projects</TabsTrigger>
          <TabsTrigger value="books" className="text-xs lg:text-sm">Books</TabsTrigger>
          <TabsTrigger value="users" className="text-xs lg:text-sm">Users</TabsTrigger>
          <TabsTrigger value="requests" className="text-xs lg:text-sm">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Prayer Events</h2>
            <Button onClick={() => setEventFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(events as any[]).map((event: any) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                      className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200"
                      title="Edit Event"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Category:</strong> {event.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <AdminProjectsPage />
        </TabsContent>

        <TabsContent value="trainings" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Training Content</h2>
            <Button onClick={handleCreateNewTraining}>
              <Plus className="w-4 h-4 mr-2" />
              Create Training
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(trainings as any[]).map((training: any) => (
              <Card key={training.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{training.title}</CardTitle>
                  <CardDescription>{training.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Type:</strong> {training.type}</p>
                    <p><strong>Duration:</strong> {training.duration} minutes</p>
                    <p><strong>Created:</strong> {new Date(training.created_at).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <h2 className="text-xl font-semibold">User Management</h2>
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>Manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(users as any[]).map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.region}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <h2 className="text-xl font-semibold">Prayer Requests</h2>
          <Card>
            <CardHeader>
              <CardTitle>Recent Prayer Requests</CardTitle>
              <CardDescription>Review and manage prayer requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(prayerRequests as any[]).map((request: any) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{request.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      </div>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full ml-4">
                        {request.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>Submitted: {new Date(request.submitted_at).toLocaleDateString()}</span>
                      <span>{request.is_public ? 'Public' : 'Private'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Books Management</h2>
            <Button 
              onClick={() => {
                console.log('Add Book button clicked', bookFormOpen);
                setBookFormOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </div>
          


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(books as any[]).map((book: any) => (
              <Card key={book.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <CardDescription>by {book.author}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBook(book)}
                      className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200"
                      title="Edit Book"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Price:</strong> ${book.price}</p>
                    <p><strong>Category:</strong> {book.category}</p>
                    <p><strong>Stock:</strong> {book.stock_quantity}</p>
                    {book.is_featured && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  {book.front_cover_url && (
                    <div className="mt-3">
                      <img 
                        src={book.front_cover_url} 
                        alt={book.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EventFormDialog 
        open={eventFormOpen} 
        onOpenChange={handleCloseEventForm}
        editingEvent={editingEvent}
      />
      <StructuredTrainingDialog 
        open={trainingFormOpen} 
        onOpenChange={(open) => {
          setTrainingFormOpen(open);
          if (!open) {
            setEditingTraining(null);
          }
        }}
        training={editingTraining}
      />
      {bookFormOpen && (
        <BookFormDialogSimple 
          open={bookFormOpen} 
          onOpenChange={handleCloseBookForm}
          book={editingBook}
        />
      )}
    </div>
  );
}