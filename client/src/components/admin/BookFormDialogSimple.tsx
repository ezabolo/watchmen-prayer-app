import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: any;
}

export default function BookFormDialogSimple({ open, onOpenChange, book }: BookFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const frontCoverInputRef = useRef<HTMLInputElement>(null);
  const backCoverInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    description: book?.description || '',
    price: book?.price || '',
    category: book?.category || '',
    amazon_url: book?.amazon_url || '',
    stock_quantity: book?.stock_quantity || '',
    is_featured: book?.is_featured || false,
  });
  
  const [selectedFrontCover, setSelectedFrontCover] = useState<File | null>(null);
  const [selectedBackCover, setSelectedBackCover] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'front') {
        setSelectedFrontCover(file);
      } else {
        setSelectedBackCover(file);
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      setUploading(true);
      try {
        const formDataToSend = new FormData();
        
        Object.keys(data).forEach(key => {
          const val = data[key];
          if (val !== undefined && val !== null && val !== '') {
            formDataToSend.append(key, String(val));
          }
        });
        
        if (selectedFrontCover) {
          formDataToSend.append('front_cover', selectedFrontCover);
        }
        
        if (selectedBackCover) {
          formDataToSend.append('back_cover', selectedBackCover);
        }

        const url = book ? `/api/books/${book.id}` : '/api/books';
        const method = book ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save book');
        }

        return response.json();
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: book ? "Book updated successfully!" : "Book created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      onOpenChange(false);
      // Reset form
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        category: '',
        stock_quantity: '',
        is_featured: false,
      });
      setSelectedFrontCover(null);
      setSelectedBackCover(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save book",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.price || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Title, Author, Description, Price)",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      ...formData,
      description: formData.description || "No description provided", // Ensure description is never empty
      price: parseFloat(formData.price) || 0,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      category: formData.category || "Prayer & Intercession", // Default category
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Create New Book'}</DialogTitle>
          <DialogDescription>
            {book ? 'Update the book information below.' : 'Fill in the details to add a new book to the store.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter book description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amazon_url">Amazon Purchase URL</Label>
            <Input
              id="amazon_url"
              type="url"
              value={formData.amazon_url}
              onChange={(e) => setFormData({ ...formData, amazon_url: e.target.value })}
              placeholder="https://amazon.com/your-book-link"
            />
            <p className="text-xs text-gray-500">
              Enter the Amazon link where users can purchase this book
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prayer & Intercession">Prayer & Intercession</SelectItem>
                  <SelectItem value="Spiritual Warfare">Spiritual Warfare</SelectItem>
                  <SelectItem value="Christian Living">Christian Living</SelectItem>
                  <SelectItem value="Ministry & Leadership">Ministry & Leadership</SelectItem>
                  <SelectItem value="Bible Study">Bible Study</SelectItem>
                  <SelectItem value="Devotional">Devotional</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Front Cover */}
            <div className="space-y-2">
              <Label htmlFor="front_cover">Front Cover Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  ref={frontCoverInputRef}
                  id="front_cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => frontCoverInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFrontCover ? selectedFrontCover.name : (book?.front_cover_url ? 'Change Front Cover' : 'Upload Front Cover')}
                </Button>
              </div>
              {selectedFrontCover && (
                <p className="text-sm text-green-600">
                  New file: {selectedFrontCover.name}
                </p>
              )}
              {book?.front_cover_url && !selectedFrontCover && (
                <p className="text-sm text-gray-600">
                  Current: {book.front_cover_url.split('/').pop()}
                </p>
              )}
            </div>

            {/* Back Cover */}
            <div className="space-y-2">
              <Label htmlFor="back_cover">Back Cover Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  ref={backCoverInputRef}
                  id="back_cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'back')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => backCoverInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedBackCover ? selectedBackCover.name : (book?.back_cover_url ? 'Change Back Cover' : 'Upload Back Cover')}
                </Button>
              </div>
              {selectedBackCover && (
                <p className="text-sm text-green-600">
                  New file: {selectedBackCover.name}
                </p>
              )}
              {book?.back_cover_url && !selectedBackCover && (
                <p className="text-sm text-gray-600">
                  Current: {book.back_cover_url.split('/').pop()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
            <Label htmlFor="is_featured">Featured Book</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending || uploading}>
              {(mutation.isPending || uploading) ? 'Saving...' : (book ? 'Update Book' : 'Create Book')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}