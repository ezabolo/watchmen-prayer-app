import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckIcon } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { useState } from "react";
import SubscriptionForm from "@/components/SubscriptionForm";
import partnerHeroImage from "@assets/image_1750379440665.png";
import teamImage from "@assets/image_1750382387190.png";
import fijiImage1 from "@assets/Fiki_Im7_1750385549207.jpg";
import fijiImage2 from "@assets/Fiji_im3_1750385575095.jpg";
import fijiImage3 from "@assets/Fiji_im4_1750385582358.jpg";
import fijiImage4 from "@assets/Fiji_im5_1750385591975.jpg";
import fijiImage5 from "@assets/Fiji_Im6_1750385599008.jpg";
import fijiImage6 from "@assets/Fiji_im8_1750385609040.jpg";
import fijiImage7 from "@assets/Fiji2_1750385618080.jpg";
import fijiImage8 from "@assets/Fiki_Im7_1750385626390.jpg";
import indiaImage1 from "@assets/India9_1750385950904.jpg";
import indiaImage2 from "@assets/India1_1750385967692.jpg";
import indiaImage3 from "@assets/India2_1750385994133.jpg";
import indiaImage4 from "@assets/India5_1750386030855.jpg";
import indiaImage5 from "@assets/India8_1750386039835.jpg";
import indiaImage6 from "@assets/India9_1750386048894.jpg";
import indiaImage7 from "@assets/India6_1750386062753.jpg";
import indiaImage8 from "@assets/India10_1750386088725.jpg";
import kenyaImage1 from "@assets/Keny4_1750386264651.jpg";
import kenyaImage2 from "@assets/Kenya1_1750386283094.jpg";
import kenyaImage3 from "@assets/Kenya2_1750386289049.jpg";
import prayerCenterImage1 from "@assets/The-Watchmen-on-the-Walls-Prayer-Houses-for-the-Nations-pictures-0-13-screenshot-1024x576_1750386305086.png";
import kenyaImage4 from "@assets/Kenya2_1750386331990.jpg";
import kenyaImage5 from "@assets/Keny3_1750386348466.jpg";
import southSudanImage1 from "@assets/South_Sudan1_1750386729791.jpg";
import southSudanImage2 from "@assets/South_Sudan2_1750386750214.jpg";
import southSudanImage3 from "@assets/South_Sudan3 - Copy_1750386768768.jpg";
import southSudanImage4 from "@assets/South_Sudan4_1750386775877.jpg";
import southSudanImage5 from "@assets/South_sudan5_1750386784430.jpg";
import southSudanImage6 from "@assets/South_sudan6_1750386791949.jpg";
import southSudanImage7 from "@assets/South_sudan7_1750386834311.jpg";
import southSudanImage8 from "@assets/South_sudan8_1750386809366.jpg";
import southSudanImage9 from "@assets/South_sudan11_1750386841168.jpg";
import southSudanImage10 from "@assets/South_sudan11_1750386848798.jpg";
import southSudanImage11 from "@assets/South_sudan12_1750386863031.jpg";
import southSudanImage12 from "@assets/South_sudan9_1750386880002.jpg";
import maliImage1 from "@assets/Mali1_1750387238485.jpg";
import maliImage2 from "@assets/Mali2_1750387250054.jpg";
import maliImage3 from "@assets/Mali3_1750387260054.jpg";
import maliImage4 from "@assets/Mali4_1750387266902.jpg";
import maliImage5 from "@assets/Mali5_1750387275510.jpg";
import maliImage6 from "@assets/Mali6_1750387282101.jpg";
import maliImage7 from "@assets/Mali7_1750387289567.jpg";
import maliImage8 from "@assets/Mali8_1750387297870.jpg";
import newsletterBgImage from "@assets/MainImage3_1750389959641.jpg";

export default function PartnerPage() {
  const { user } = useAuth();
  const [selectedGallery, setSelectedGallery] = useState(null);

  // Gallery data - placeholder URLs should be replaced with actual event photos
  const galleries = [
    {
      id: 1,
      title: "Supporting Orphans in India",
      thumbnail: indiaImage1,
      images: [
        indiaImage1,
        indiaImage2,
        indiaImage3,
        indiaImage4,
        indiaImage5,
        indiaImage6,
        indiaImage7,
        indiaImage8
      ]
    },
    {
      id: 2,
      title: "Supporting Homeless in Fiji",
      thumbnail: fijiImage7,
      images: [
        fijiImage1,
        fijiImage2,
        fijiImage3,
        fijiImage4,
        fijiImage5,
        fijiImage6,
        fijiImage7,
        fijiImage8
      ]
    },
    {
      id: 3,
      title: "Supporting Orphans in Kenya",
      thumbnail: kenyaImage1,
      images: [
        kenyaImage1,
        kenyaImage2,
        kenyaImage3,
        kenyaImage4,
        kenyaImage5
      ]
    },
    {
      id: 4,
      title: "Supporting Orphans in South Sudan",
      thumbnail: southSudanImage1,
      images: [
        southSudanImage1,
        southSudanImage2,
        southSudanImage3,
        southSudanImage4,
        southSudanImage5,
        southSudanImage6,
        southSudanImage7,
        southSudanImage8,
        southSudanImage9,
        southSudanImage10,
        southSudanImage11,
        southSudanImage12
      ]
    },
    {
      id: 5,
      title: "Supporting Orphans in Mali",
      thumbnail: maliImage1,
      images: [
        maliImage1,
        maliImage2,
        maliImage3,
        maliImage4,
        maliImage5,
        maliImage6,
        maliImage7,
        maliImage8
      ]
    },
    {
      id: 6,
      title: "Supporting Prayer Center in Kenya",
      thumbnail: prayerCenterImage1,
      images: [
        prayerCenterImage1
      ]
    }
  ];


  
  return (
    <>
      <Helmet>
        <title>Partner With Us | Prayer Watchman</title>
        <meta name="description" content="Support the Prayer Watchman mission as a partner organization or individual donor and help mobilize intercessors worldwide." />
      </Helmet>
      
      {/* Hero Section */}
      <section 
        className="relative h-[50vh] min-h-[400px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${partnerHeroImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              FUEL THE FIRE OF INTERCESSION—BECOME A WATCHMAN PARTNER!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Together, we can build a global wall of prayer and protection. Sow into a movement that watches and warns.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                <Link to="/register">Become a Partner</Link>
              </Button>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                <Link to="/donate">Support the Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">The Impact of Partnership</h2>
              <div className="prose max-w-none text-gray-600 space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg leading-relaxed">
                  Prayer Watchman partners play a crucial role in expanding our global prayer network.
                  Your support enables us to recruit, train, and deploy intercessors in strategic locations
                  around the world.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  As a partner, you're not just donating resources – you're joining a movement to see spiritual 
                  transformation through prayer. Whether you're a ministry, business, or individual, your 
                  partnership makes a significant difference.
                </p>
                <h3 className="text-lg sm:text-xl font-bold mt-6 sm:mt-8 text-gray-900">How Your Support Helps</h3>
                <ul className="space-y-2 text-base sm:text-lg">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-3 mt-1">•</span>
                    Develop and translate training materials
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-3 mt-1">•</span>
                    Support regional prayer coordinators
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-3 mt-1">•</span>
                    Host prayer gatherings in unreached areas
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-3 mt-1">•</span>
                    Provide technology for virtual prayer rooms
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-3 mt-1">•</span>
                    Sponsor prayer initiatives in crisis regions
                  </li>
                </ul>
              </div>
              
              {!user ? (
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link to="/register">Become a Partner</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                    <Link to="/login">Sign in as Partner</Link>
                  </Button>
                </div>
              ) : (
                <div className="mt-6 sm:mt-8">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link to="/dashboard">Access Partner Dashboard</Link>
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              <Card className="shadow-lg border-accent-200">
                <CardContent className="p-0">
                  <img 
                    src={teamImage} 
                    alt="Prayer Watchman team standing together in front of church with cross"
                    className="w-full h-64 sm:h-80 object-cover rounded-t-lg"
                  />
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-center text-lg sm:text-xl mb-4 text-gray-900">Partner Benefits</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Prayer support for your organization's initiatives</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Custom prayer campaigns for your needs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Access to global prayer network</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Impact reports and analytics</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary-900 text-white">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Support Our Mission</h3>
                  <p className="mb-6 text-sm sm:text-base text-center leading-relaxed">Your donations help us recruit, train and deploy prayer watchmen around the world.</p>
                  
                  <div className="flex flex-col gap-3 justify-center">
                    <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold">
                      <Link to="/donate">
                        Donate to Support Watchman Movement
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Events Gallery Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Events Sponsored by Our Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Through our partnerships, we support communities worldwide with life-changing initiatives
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {galleries.map((gallery) => (
              <Dialog key={gallery.id}>
                <DialogTrigger asChild>
                  <div className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <img
                      src={gallery.thumbnail}
                      alt={gallery.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                      <h3 className="text-white text-lg font-bold text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                        {gallery.title}
                      </h3>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="gallery-description">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
                      {gallery.title}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gallery.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${gallery.title} - Image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      />
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-4">
                      Thank you to our partners who made this initiative possible
                    </p>
                    <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                      <Link to="/register">Become a Partner</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Want to sponsor life-changing events like these?
            </p>
            <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4">
              <Link to="/register">Partner With Us Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${newsletterBgImage})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 max-w-4xl mx-auto">
            <SubscriptionForm />
          </div>
        </div>
      </section>
    </>
  );
}
