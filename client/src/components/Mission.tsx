import prayingImagePath from "@assets/Mission-praying_1749698677648.png";
import purpleTextureImagePath from "@assets/image_1749701291052.png";
import strategyImage1 from "@assets/DSC_0015-BFaso-1024x683_1749701954755.webp";
import strategyImage2 from "@assets/The-Watchmen-on-the-Walls-Prayer-Houses-for-the-Nations-pictures-0-13-screenshot-1024x576_1749701954755.png";
import strategyImage3 from "@assets/WWPHN-Worldwide-International-Day-of-Prayer-2017-0-18-screenshot_1749701954756.png";
import newsletterBackgroundImage from "@assets/SentinelleImage_1750355386376.jpg";
import CurrentCampaigns from "./CurrentCampaigns";

export default function Mission() {
  return (
    <>
      {/* Mission Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            {/* Video on the left */}
            <div className="mb-8 lg:mb-0">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/3xf9pI7HK9c"
                  title="Prayer Watchman Vision"
                  className="w-full h-full rounded-lg shadow-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Mission text on the right */}
            <div className="lg:pl-8">
              <h2 className="text-gray-600 text-sm font-semibold tracking-wide uppercase mb-2">
                VISION OF THE MOVEMENT
                <div className="w-16 h-0.5 bg-red-500 mt-1"></div>
              </h2>
              
              <div className="space-y-4 mt-6">
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                  CONSECRATION TO THE FATHER'S HEART
                </h3>
                
                <p className="text-lg text-gray-700 leading-relaxed pl-4">
                  ▶ ELEVATE THE TESTIMONY OF CHRIST IN THE NATIONS
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed pl-4">
                  ▶ TO ACCELERATE THE REAPING OF THE HARVEST OF SOULS
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed mt-6">
                  WE ARE ESTABLISHING A NETWORK OF WATCHMEN GATHERING AS ALTARS OF PRAYER 
                  CONTINUALLY INTERCEDING IN UNITY FOR THE SOULS IN THE NATIONS FOR THE 
                  GLORY OF GOD ON THE EARTH
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section - Two Column Layout */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Text Content on the Left */}
            <div className="mb-8 lg:mb-0">
              <p className="text-yellow-400 text-sm font-semibold tracking-wide uppercase mb-4">
                GET INVOLVE
              </p>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                Mobilizing intercessors to become watchmen to pray and bear witness to reveal 
                the Lord Jesus Christ to souls in the nations
              </h2>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Join our global network of prayer warriors standing in the gap for the nations. 
                Together, we can advance God's kingdom through strategic intercession and witness.
              </p>
              
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 font-bold text-sm uppercase tracking-wide transition-colors duration-200 shadow-lg rounded">
                DISCOVER MORE
              </button>
            </div>

            {/* Video on the Right */}
            <div className="lg:pl-8">
              <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.youtube.com/embed/WbFYKHy0VKg?autoplay=1&mute=1&loop=1&playlist=WbFYKHy0VKg&controls=1&showinfo=0&rel=0"
                  title="Prayer Watchman Ministry"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Mission Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 sm:mb-6">
              OUR MISSION
            </h2>
            <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl text-blue-800 font-medium leading-relaxed">
                Mobilizing intercessors to become watchmen to pray and bear witness to reveal the Lord Jesus Christ to souls in the nations
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            {/* Left Side - Mission Points */}
            <div className="space-y-8 mb-12 lg:mb-0">
              {/* Sharing the Vision */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    SHARING THE VISION
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "For thus hath the Lord said unto me, Go, set a watchman, let him declare what he seeth."
                  </p>
                </div>
              </div>

              {/* Gathering Watchmen */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    GATHERING WATCHMEN IN NATIONS IN PERSON
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "To whom coming, as unto a living stone, disallowed indeed of men, but chosen of God, and precious," 
                    <span className="font-medium"> 1 Peter 2:4</span>
                  </p>
                </div>
              </div>

              {/* Imparting Intercession */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    IMPARTING AND STIRRING UP THE SPIRIT OF INTERCESSION AND TRAVAIL FOR SOULS
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "My little children, of whom I travail in birth again until Christ be formed in you," 
                    <span className="font-medium"> Galatians 4:19</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="lg:sticky lg:top-8">
              <div className="shadow-2xl">
                <img
                  src={prayingImagePath}
                  alt="Prayer gathering with people from different nations"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-4">
              STRATEGY
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>

          {/* Strategy Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {/* Train Watchmen */}
            <div className="group">
              <div className="bg-white overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                  <img 
                    src={strategyImage1} 
                    alt="Training watchmen in prayer gathering"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-2 sm:mb-4">
                      TRAIN WATCHMEN
                    </h3>
                  </div>
                  <div className="text-gray-700 space-y-2 sm:space-y-3">
                    <p className="text-sm sm:text-base leading-relaxed">
                      Understand the vision of the Prayer Movement for Souls in the Nations and pray according to the vision
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed">
                      Share the vision to believers, church leaders and the Body of Christ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Establish Altars */}
            <div className="group">
              <div className="bg-white overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                  <img 
                    src={strategyImage2} 
                    alt="Establishing altars of prayer with church leaders"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2h2v4H7V6zm2 6H7v2h2v-2zm2-6h2v2h-2V6zm2 4h-2v2h2v-2zm2-4h2v2h-2V6zm2 4h-2v2h2v-2z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-2 sm:mb-4">
                      ESTABLISH ALTARS OF PRAYER
                    </h3>
                  </div>
                  <div className="text-gray-700 space-y-2 sm:space-y-3">
                    <p className="text-sm sm:text-base leading-relaxed">
                      Be a living stone to build a spiritual altar
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed">
                      Establish networks of altars of prayer by organising interdenominational gatherings of united intercession for souls in a specific nation (villages, towns, districts) and in all nations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Offer Spiritual Sacrifices */}
            <div className="group">
              <div className="bg-white overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                  <img 
                    src={strategyImage3} 
                    alt="International prayer gathering offering spiritual sacrifices"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-2 sm:mb-4">
                      OFFER SPIRITUAL SACRIFICES
                    </h3>
                  </div>
                  <div className="text-gray-700 space-y-2 sm:space-y-3">
                    <p className="text-sm sm:text-base leading-relaxed">
                      Intercession for all souls, for all peoples, is the sacrifice the Lord is asking us to put upon His altar.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed">
                      It is a continuous intercession in unity around the Lord Jesus and made through the Holy Spirit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Prayer Campaigns Section */}
      <CurrentCampaigns />

      {/* Newsletter Signup Section */}
      <section className="relative py-20 bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
        style={{ 
          backgroundImage: `url(${newsletterBackgroundImage})`
        }}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-gray-700 text-lg leading-relaxed mb-2">
                  Sign up for our email list to join with
                </h3>
                <h2 className="text-gray-800 text-xl font-semibold mb-1">
                  Prayer Watchman in spreading the gospel to
                </h2>
                <h2 className="text-gray-800 text-xl font-semibold">
                  unreached people.
                </h2>
              </div>

              {/* Form */}
              <form className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name*
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Email Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Preferences*
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Prayer Watchman Newsletter</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Prayer Watchman Events</span>
                    </label>
                  </div>
                </div>

                {/* Mailing Address */}
                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-3">
                    Add your address below if you would like to be added to our print mailing list.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-sm transition-colors duration-200"
                  >
                    Sign Up for Newsletter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}