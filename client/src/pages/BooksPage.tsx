import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, BookOpen, Heart, Star } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import librariesBackground from '@assets/Libraries_1755400945741.jpeg';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  front_cover_url: string | null;
  back_cover_url: string | null;
  amazon_url: string | null;
  stock_quantity: number;
  is_featured: boolean;
  created_at: string;
}

interface CartItem {
  id: number;
  user_id: number;
  book_id: number;
  quantity: number;
}

export default function BooksPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the hero background image for faster loading
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = librariesBackground;
  }, []);

  // Fetch books
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books'],
  });

  // Fetch user's cart
  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
    retry: false,
  });

  // Handle Amazon purchase
  const handlePurchase = (amazonUrl: string | null) => {
    if (amazonUrl) {
      window.open(amazonUrl, '_blank');
    } else {
      toast({
        title: "Purchase Link Unavailable",
        description: "This book's purchase link is not available at the moment.",
        variant: "destructive",
      });
    }
  };

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(books.map(book => book.category)))];

  // Filter books by category
  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section Skeleton */}
        <div 
          className="relative h-[60vh] min-h-[500px] bg-cover bg-center bg-no-repeat text-white flex items-center"
          style={{
            backgroundImage: `url(${librariesBackground})`
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
              <Skeleton className="h-6 w-[600px] mx-auto bg-white/20" />
            </div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div 
        className={`relative h-[60vh] min-h-[500px] bg-cover bg-center bg-no-repeat text-white flex items-center overflow-hidden transition-all duration-700 ${
          imageLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        style={{
          backgroundImage: imageLoaded ? `url(${librariesBackground})` : 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4 text-center">
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
              className="mb-6"
            >
              PRAYER WATCHMAN BOOKS
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover our collection of inspiring books on prayer, intercession, and spiritual warfare. 
              Equip yourself with wisdom from seasoned prayer warriors and deepen your relationship with God.
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg">
              <div className="flex items-center">
                <Star className="h-6 w-6 mr-2 text-yellow-400" />
                <span>Inspiring Content</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-6 w-6 mr-2 text-red-400" />
                <span>Life-Changing</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-green-400" />
                <span>Biblical Foundation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Books' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Books */}
        {selectedCategory === 'all' && books.filter(book => book.is_featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Books</h2>
            <div className="space-y-6">
              {books.filter(book => book.is_featured).map((book) => (
                <div key={book.id} className="bg-yellow-50 rounded-lg shadow-lg border-2 border-yellow-200 p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                      <div className="relative w-48 h-64 mx-auto lg:mx-0">
                        <ImageWithFallback
                          src={book.front_cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover rounded-lg shadow-lg"
                          fallbackClassName="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-300"
                        />
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                          Featured
                        </Badge>
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-lg text-blue-600">by {book.author}</p>
                        <Badge variant="secondary" className="capitalize mt-2">
                          {book.category}
                        </Badge>
                      </div>

                      <p className="text-gray-700 leading-relaxed line-clamp-3">
                        {book.description}
                      </p>

                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-orange-600">
                          ${parseFloat(book.price.toString()).toFixed(2)}
                        </span>
                      </div>

                      <Button 
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                        onClick={() => handlePurchase(book.amazon_url)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Purchase on Amazon
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Books - Amazon Style Layout */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {selectedCategory === 'all' ? 'All Books' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Books`}
          </h2>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Books Found</h3>
              <p className="text-gray-500">
                {selectedCategory === 'all' 
                  ? 'No books are available at the moment.' 
                  : `No books found in the ${selectedCategory} category.`}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Book Cover - Left Side */}
                    <div className="flex-shrink-0">
                      <div className="relative w-64 h-80 mx-auto lg:mx-0">
                        <ImageWithFallback
                          src={book.front_cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover rounded-lg shadow-lg"
                          fallbackClassName="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"
                        />
                        {book.is_featured && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Book Details - Right Side */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h3>
                        <p className="text-lg text-blue-600 mb-1">by {book.author}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="capitalize">
                            {book.category}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(book.created_at).getFullYear()}
                          </span>
                        </div>
                      </div>

                      <div className="text-gray-700 leading-relaxed">
                        <p>{book.description}</p>
                      </div>

                      <div className="flex items-center gap-4 py-4">
                        <span className="text-3xl font-bold text-orange-600">
                          ${parseFloat(book.price.toString()).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">List Price</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button 
                          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 text-lg"
                          onClick={() => handlePurchase(book.amazon_url)}
                        >
                          <ExternalLink className="h-5 w-5 mr-2" />
                          Purchase on Amazon
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3"
                          onClick={() => handlePurchase(book.amazon_url)}
                        >
                          Buy Now
                        </Button>
                      </div>

                      <div className="text-sm text-gray-600 pt-2">
                        <p>✓ Available for immediate delivery</p>
                        <p>✓ Secure purchase through Amazon</p>
                        {book.amazon_url && <p>✓ Customer reviews and ratings available</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}