import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, BookOpen, Heart, Star } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Helmet } from "react-helmet";
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

export default function BooksPage() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = librariesBackground;
  }, []);

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books'],
  });

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

  const categories = ['all', ...Array.from(new Set(books.map(book => book.category)))];

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div 
          className="relative min-h-[70vh] bg-cover bg-center bg-no-repeat text-white flex items-center justify-center"
          style={{ backgroundImage: `url(${librariesBackground})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
              <Skeleton className="h-6 w-[600px] mx-auto bg-white/20" />
            </div>
          </div>
        </div>
        
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
    <div className="min-h-screen">
      <Helmet>
        <title>Books | Prayer Watchman</title>
        <meta name="description" content="Discover our collection of inspiring books on prayer, intercession, and spiritual warfare from Prayer Watchman." />
      </Helmet>

      <section 
        className="relative min-h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: imageLoaded ? `url(${librariesBackground})` : 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
        }}
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
            PRAYER WATCHMAN BOOKS
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover our collection of inspiring books on prayer, intercession, and spiritual warfare. 
            Equip yourself with wisdom from seasoned prayer warriors.
          </p>
          <div className="flex items-center justify-center space-x-8 text-lg text-white">
            <div className="flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-400" />
              <span>Inspiring Content</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-6 w-6 mr-2 text-yellow-400" />
              <span>Life-Changing</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-yellow-400" />
              <span>Biblical Foundation</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              BROWSE BY CATEGORY
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`capitalize ${selectedCategory === category ? 'bg-blue-900 hover:bg-blue-800 text-white' : 'border-blue-900 text-blue-900 hover:bg-blue-50'}`}
                >
                  {category === 'all' ? 'All Books' : category}
                </Button>
              ))}
            </div>
          </div>

          {selectedCategory === 'all' && books.filter(book => book.is_featured).length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">FEATURED BOOKS</h2>
              <div className="space-y-6">
                {books.filter(book => book.is_featured).map((book) => (
                  <div key={book.id} className="bg-white rounded-lg shadow-lg border-l-4 border-yellow-400 p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative w-48 h-64 mx-auto lg:mx-0">
                          <ImageWithFallback
                            src={book.front_cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            fallbackClassName="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-300"
                          />
                          <Badge className="absolute top-2 right-2 bg-yellow-500 text-black font-bold">
                            Featured
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-blue-900 mb-1">{book.title}</h3>
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
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
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

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              {selectedCategory === 'all' ? 'ALL BOOKS' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Books`.toUpperCase()}
            </h2>
            
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">No Books Found</h3>
                <p className="text-gray-500">
                  {selectedCategory === 'all' 
                    ? 'No books are available at the moment.' 
                    : `No books found in the ${selectedCategory} category.`}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-6 p-6">
                      <div className="flex-shrink-0">
                        <div className="relative w-64 h-80 mx-auto lg:mx-0">
                          <ImageWithFallback
                            src={book.front_cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            fallbackClassName="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"
                          />
                          {book.is_featured && (
                            <Badge className="absolute top-2 right-2 bg-yellow-500 text-black font-bold">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-blue-900 mb-2">{book.title}</h3>
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
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 text-lg"
                            onClick={() => handlePurchase(book.amazon_url)}
                          >
                            <ExternalLink className="h-5 w-5 mr-2" />
                            Purchase on Amazon
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-blue-900 text-blue-900 hover:bg-blue-50 px-6 py-3"
                            onClick={() => handlePurchase(book.amazon_url)}
                          >
                            Buy Now
                          </Button>
                        </div>

                        <div className="text-sm text-gray-600 pt-2">
                          <p className="flex items-center gap-1"><span className="text-yellow-500">&#10003;</span> Available for immediate delivery</p>
                          <p className="flex items-center gap-1"><span className="text-yellow-500">&#10003;</span> Secure purchase through Amazon</p>
                          {book.amazon_url && <p className="flex items-center gap-1"><span className="text-yellow-500">&#10003;</span> Customer reviews and ratings available</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
