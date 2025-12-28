import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import SubscriptionForm from "@/components/SubscriptionForm";
import watchmanHeroImage from "@assets/BannerWatch_1750357343651.jpg";
import prayingNationsImage from "@assets/prayingNations_1750358034797.png";
import leadersImage from "@assets/leadersnew_1750364664083.jpg";
import prayerGatheringImage from "@assets/image_1750366350506.png";
import signupBackgroundImage from "@assets/JourneePriere_1750367684608.jpg";

export default function WatchmanPage() {
  const { user } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>Become a Watchman | Prayer Watchman</title>
        <meta name="description" content="Learn what it means to be a Prayer Watchman and join our global network of intercessors standing watch in prayer." />
      </Helmet>
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ 
          backgroundImage: `url(${watchmanHeroImage})`
        }}
      >
        {/* Darker overlay for better text visibility */}
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
              marginBottom: '3rem',
              animation: 'slow-blink 4s ease-in-out infinite'
            }}
          >
STAND ON THE WALL<br />
            SHIFT NATIONS THROUGH PRAYER!
          </h1>
          
          {!user ? (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wide">
                <Link to="/register">Register as a Watchman</Link>
              </Button>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold">
                <Link to="/login">Sign in to your account</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wide">
                <Link to="/training">Access Training</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What is a Watchman?</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-6">
                  A prayer watchman is an intercessor who commits to "standing on the wall" in prayer, 
                  spiritually watching over specific regions, issues, or people groups. Inspired by 
                  biblical principles of watchfulness, prayer watchmen play a vital role in spiritual warfare.
                </p>
                <blockquote className="font-serif italic text-xl my-8 text-gray-700 pl-4 border-l-4 border-blue-500">
                  "I have posted watchmen on your walls, Jerusalem; they will never be silent day or night.
                  You who call on the LORD, give yourselves no rest..." — Isaiah 62:6-7
                </blockquote>
                <p className="text-gray-600 mb-4">
                  As a Watchman, you will:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Receive training in biblical principles of intercession
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Join prayer campaigns focused on specific global needs
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Connect with other intercessors around the world
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Access resources to deepen your prayer life
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Receive regular prayer briefings and updates
                  </li>
                </ul>
                <p className="text-gray-600 mt-6">
                  The commitment of a Watchman varies based on your availability, but we encourage 
                  regular, dedicated time in prayer using the resources and focus points provided.
                </p>
              </div>
            </div>
            
            {/* Right column - Image */}
            <div className="lg:order-last">
              <div className="relative">
                <img 
                  src={prayingNationsImage} 
                  alt="Hands raised in prayer representing nations" 
                  className="w-full h-auto shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Goals and Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Vision, Goals and Mission of the Watchman Movement
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Vision Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex min-h-[200px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="w-24 bg-yellow-400 rounded-r-full flex-shrink-0 transition-all duration-300 hover:bg-yellow-500"></div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-yellow-600">THE VISION</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Is to unite Intercessors/ Watchmen/Worshipers in an unceasing 24/7 prayer and worship for the revelation of our Lord Jesus Christ to the nations.
                </p>
              </div>
            </div>

            {/* Goal Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex min-h-[200px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="w-24 bg-yellow-400 rounded-r-full flex-shrink-0 transition-all duration-300 hover:bg-yellow-500"></div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-yellow-600">THE GOAL</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  is to unite all 195 nations around the world in a 24/7 prayer and worship initiative for a spiritual awakening/ revival in all these nations.
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex min-h-[200px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="w-24 bg-yellow-400 rounded-r-full flex-shrink-0 transition-all duration-300 hover:bg-yellow-500"></div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-yellow-600">The Mission</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Our mission is to devote ourselves to unceasing prayer for our communities, cities, nation and the nations of the world.
                  Ultimately we are dedicated to worshiping and praying for the revelation of our Lord Jesus Christ to all people, all nations and for His return. Even so come Lord Jesus!
                </p>
              </div>
            </div>

            {/* Objective Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex min-h-[200px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="w-24 bg-yellow-400 rounded-r-full flex-shrink-0 transition-all duration-300 hover:bg-yellow-500"></div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-yellow-600">The Objective And Our Commitment</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Every nation adopts 30 minute slots of prayer one or more days during the week. Intercessors/Watchmen from each nation adopt a weekly prayer schedule and cover the provided prayer requests and other prayer points regarding their particular nation. As well as recruiting other Intercessors to pray with them!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Leaders Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              OUR LEADERS
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left column - Image */}
            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <img 
                src={leadersImage} 
                alt="Rev. Dr. Moussa Toure and Dr. Esther Toure" 
                className="w-full h-auto shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl"
              />
            </div>
            
            {/* Right column - Leader profiles */}
            <div className="space-y-8">
              {/* Rev. Dr. Moussa Toure */}
              <div className="transform transition-all duration-300 hover:translate-x-2 hover:scale-105 cursor-pointer p-4 rounded-lg hover:bg-gray-50 hover:shadow-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1 transition-colors duration-300 hover:text-yellow-600">
                  Senior Pastor
                </h3>
                <h4 className="text-2xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-yellow-600">
                  REV. DR MOUSSA TOURE
                </h4>
                <h5 className="text-lg font-medium text-gray-700 mb-3">
                  Rev. Dr. Moussa Toure Profile
                </h5>
                <p className="text-gray-600 leading-relaxed">
                  From the very inception when God touched the life of Rev. Dr. Moussa Toure — a former Muslim — through an open vision, he became a radical follower of a radical Jesus. His life changed as he followed Him and he is changing his world by letting...
                </p>
              </div>

              {/* Dr. Esther Toure */}
              <div className="pt-6 border-t border-gray-200 transform transition-all duration-300 hover:translate-x-2 hover:scale-105 cursor-pointer p-4 rounded-lg hover:bg-gray-50 hover:shadow-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1 transition-colors duration-300 hover:text-yellow-600">
                  Senior Pastor
                </h3>
                <h4 className="text-2xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-yellow-600">
                  DR ESTHER TOURE
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  God always uses ordinary women to impact the world. Just as Esther was set apart for her destiny by her character and her commitment to God to act in a particular time in history for God's purposes, so God has called and raised up at such a time as this Dr. Esther Toure as a woman of God in our day to make an impact...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Praying for the Nations Section */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left column - Content */}
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Praying for the Nations
              </h2>
              <p className="text-lg mb-6">
                We are dedicated to praying for:
              </p>
              <ul className="space-y-3 text-gray-200 mb-8">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">•</span>
                  The repentance, salvation, and deliverance of all nations, leaders, and people
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">•</span>
                  The destruction of everything that exalts itself against the knowledge of our Lord Jesus Christ (Jer. 1:10)
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">•</span>
                  Unity of the Body of Christ
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">•</span>
                  Spiritual revival/ awakening
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">•</span>
                  The return of our Lord Jesus Christ
                </li>
              </ul>
              
              <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4">
                <Link to="/donate">Donate to Support Watchman Movement</Link>
              </Button>
            </div>
            
            {/* Right column - Image */}
            <div>
              <img 
                src={prayingNationsImage} 
                alt="People praying with hands raised" 
                className="w-full h-auto shadow-lg rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 24/7 Prayer Mountain Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Images on the left */}
            <div className="space-y-6">
              <img 
                src={prayerGatheringImage} 
                alt="Prayer gathering with hands raised in worship"
                className="w-full h-64 object-cover"
              />
            </div>
            
            {/* Text content on the right */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">24/7 Prayer Mountain</h2>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Lord has led the Watchmen on the Walls-Prayer Houses for the Nations Ministry to establish an online CHRIST-CENTERED 24/7 Unceasing Prayer Initiative for all nations, called 24/7 Prayer Mountain.
                </p>
                
                <p>
                  Intercessors/ Watchmen are coming in unity on the 24/7 Prayer Mountain where continual prayer, worship and intercession are being offered to the Lord. This is what the Lord is doing in these last days, stirring believers from different races, different ethnic backgrounds, different nations to come together in unity like in the Upper Room and commit to NIGHT and DAY prayer watches before Him. (Isaiah 62:6-7)
                </p>
                
                <p>
                  Come let us pray and worship together the only One Who deserves it! Jesus Christ, the Son of the Living God! Our Savior! Our Redeemer! Our soon coming King! Come all nations, worship Him in the beauty of holiness!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Watchman Signup Section */}
      <section 
        className="py-20 relative bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${signupBackgroundImage})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg p-8 shadow-2xl">
            <SubscriptionForm />
          </div>
        </div>
      </section>
    </>
  );
}
