import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import backgroundImage from "@assets/MainImage3_1750388994861.jpg";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
      
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for joining our prayer community newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      className="relative py-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Subscribe to Our Newsletter
          </h2>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Stay connected with the global prayer movement. Receive updates on prayer campaigns, 
            training opportunities, and inspiring testimonies from around the world.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 text-gray-900 bg-white/95 border-0 focus:ring-2 focus:ring-yellow-400"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          
          <p className="text-sm text-white/80 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}