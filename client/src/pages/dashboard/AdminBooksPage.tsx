import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, ShoppingBag, DollarSign, Tag } from "lucide-react";
import BookFormDialogSimple from "@/components/admin/BookFormDialogSimple";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminBooksPage() {
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: books = [] } = useQuery<any[]>({
    queryKey: ['/api/books'],
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (bookId: number) => {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete book');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete book",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setBookFormOpen(true);
  };

  const handleDelete = (bookId: number) => {
    deleteBookMutation.mutate(bookId);
  };

  const handleCloseForm = () => {
    setBookFormOpen(false);
    setEditingBook(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
          <p className="text-gray-600">Add, edit, and remove books from the store</p>
        </div>
        <Button onClick={() => { setEditingBook(null); setBookFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      {books.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No books yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first book to the store
            </p>
            <Button onClick={() => { setEditingBook(null); setBookFormOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Book
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: any) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{book.title}</CardTitle>
                    <CardDescription>by {book.author}</CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(book)}
                      className="p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="p-2 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Book</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{book.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(book.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {book.front_cover_url && (
                  <div className="mb-3">
                    <img
                      src={book.front_cover_url}
                      alt={book.title}
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>${parseFloat(book.price).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="w-4 h-4 mr-2" />
                    <span>{book.category || 'Uncategorized'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    <span>Stock: {book.stock_quantity || 0}</span>
                  </div>
                  {book.is_featured && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {bookFormOpen && (
        <BookFormDialogSimple
          open={bookFormOpen}
          onOpenChange={handleCloseForm}
          book={editingBook}
        />
      )}
    </div>
  );
}
