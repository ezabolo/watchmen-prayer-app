import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckIcon, Heart, Globe, Users, HandHeart, BookOpen, Shield } from "lucide-react";
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

  const galleries = [
    {
      id: 1,
      title: "Supporting Orphans in India",
      thumbnail: indiaImage1,
      images: [indiaImage1, indiaImage2, indiaImage3, indiaImage4, indiaImage5, indiaImage6, indiaImage7, indiaImage8]
    },
    {
      id: 2,
      title: "Supporting Homeless in Fiji",
      thumbnail: fijiImage7,
      images: [fijiImage1, fijiImage2, fijiImage3, fijiImage4, fijiImage5, fijiImage6, fijiImage7, fijiImage8]
    },
    {
      id: 3,
      title: "Supporting Orphans in Kenya",
      thumbnail: kenyaImage1,
      images: [kenyaImage1, kenyaImage2, kenyaImage3, kenyaImage4, kenyaImage5]
    },
    {
      id: 4,
      title: "Supporting Orphans in South Sudan",
      thumbnail: southSudanImage1,
      images: [southSudanImage1, southSudanImage2, southSudanImage3, southSudanImage4, southSudanImage5, southSudanImage6, southSudanImage7, southSudanImage8, southSudanImage9, southSudanImage10, southSudanImage11, southSudanImage12]
    },
    {
      id: 5,
      title: "Supporting Orphans in Mali",
      thumbnail: maliImage1,
      images: [maliImage1, maliImage2, maliImage3, maliImage4, maliImage5, maliImage6, maliImage7, maliImage8]
    },
    {
      id: 6,
      title: "Supporting Prayer Center in Kenya",
      thumbnail: prayerCenterImage1,
      images: [prayerCenterImage1]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Partner With Us | Prayer Watchman</title>
        <meta name="description" content="Support the Prayer Watchman mission as a partner organization or individual donor and help mobilize intercessors worldwide." />
      </Helmet>
      
      <section 
        className="relative min-h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${partnerHeroImage})` }}
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
            FUEL THE FIRE OF INTERCESSION—BECOME A WATCHMAN PARTNER!
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Together, we can build a global wall of prayer and protection. Sow into a movement that watches and warns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wide">
              <Link to="/register">Become a Partner</Link>
            </Button>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold">
              <Link to="/donate">Support the Mission</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 sm:mb-6">
              THE IMPACT OF PARTNERSHIP
            </h2>
            <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl text-blue-800 font-medium leading-relaxed">
                Your support enables us to recruit, train, and deploy intercessors in strategic locations around the world
              </p>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            <div className="space-y-8 mb-12 lg:mb-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    DEVELOP AND TRANSLATE TRAINING MATERIALS
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost"
                    <span className="font-medium"> Matthew 28:19</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    SUPPORT REGIONAL PRAYER COORDINATORS
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "And let us consider one another to provoke unto love and to good works"
                    <span className="font-medium"> Hebrews 10:24</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    HOST PRAYER GATHERINGS IN UNREACHED AREAS
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "For where two or three are gathered together in my name, there am I in the midst of them"
                    <span className="font-medium"> Matthew 18:20</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    SPONSOR PRAYER INITIATIVES IN CRISIS REGIONS
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "If my people, which are called by my name, shall humble themselves, and pray... then will I hear from heaven"
                    <span className="font-medium"> 2 Chronicles 7:14</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="shadow-2xl rounded-lg overflow-hidden">
                <img 
                  src={teamImage} 
                  alt="Prayer Watchman team standing together in front of church with cross"
                  className="w-full h-80 object-cover"
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">Partner Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Prayer support for your organization's initiatives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Custom prayer campaigns for your needs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Access to global prayer network</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Impact reports and analytics</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-900 text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Support Our Mission</h3>
                <p className="mb-6 text-center text-gray-300 leading-relaxed">Your donations help us recruit, train and deploy prayer watchmen around the world.</p>
                <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold">
                  <Link to="/donate">Donate to Support Watchman Movement</Link>
                </Button>
              </div>

              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Link to="/register">Become a Partner</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="flex-1">
                    <Link to="/login">Sign in as Partner</Link>
                  </Button>
                </div>
              ) : (
                <Button asChild size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                  <Link to="/dashboard">Access Partner Dashboard</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              EVENTS SPONSORED BY OUR PARTNERS
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Through our partnerships, we support communities worldwide with life-changing initiatives
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {galleries.map((gallery) => (
              <Dialog key={gallery.id}>
                <DialogTrigger asChild>
                  <div className="group">
                    <div className="bg-white overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={gallery.thumbnail}
                          alt={gallery.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                            <HandHeart className="w-7 h-7 text-blue-900" />
                          </div>
                          <h3 className="text-lg font-bold text-blue-900">
                            {gallery.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm text-center">
                          Click to view photo gallery
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="gallery-description">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-900 mb-4">
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
                    <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold">
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

      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${newsletterBgImage})` }}
      >
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
