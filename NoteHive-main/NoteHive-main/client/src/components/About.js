import React, { useState } from 'react';
import '../css/About.css';

const About = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="w-full">
      <div className="bg-white overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-400 py-8 px-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">About NoteHive</h1>
            <p className="mt-2 text-lg">Where your notes come together like honey in a hive.</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b max-w-7xl mx-auto">
          <button 
            className={`py-3 px-6 font-medium focus:outline-none ${activeTab === 'overview' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`py-3 px-6 font-medium focus:outline-none ${activeTab === 'features' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
          <button 
            className={`py-3 px-6 font-medium focus:outline-none ${activeTab === 'team' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
            onClick={() => setActiveTab('team')}
          >
            Our Team
          </button>
          <button 
            className={`py-3 px-6 font-medium focus:outline-none ${activeTab === 'faq' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
        </div>
        
        {/* Content Area */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to NoteHive</h2>
                <p className="text-gray-700 leading-relaxed">
                  NoteHive is your central hub for organizing thoughts, managing ideas, and boosting productivity. 
                  Designed with simplicity and efficiency in mind, NoteHive helps you capture and organize information 
                  in a way that works naturally for you.
                </p>
                <div className="mt-6 flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2">
                    <img 
                      src="/api/placeholder/400/300" 
                      alt="NoteHive Dashboard" 
                      className="rounded-lg shadow-md"
                    />
                  </div>
                  <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6">
                    <p className="text-gray-700">
                      Built with modern web technologies including React.js, NoteHive provides a seamless 
                      experience across all your devices. Whether you're at your desk or on the go, your notes 
                      are always accessible and beautifully organized.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-5 rounded-lg">
                  <div className="text-purple-600 text-2xl mb-2">📝</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Smart Notes</h3>
                  <p className="text-gray-600">Create, edit, and organize notes with our intuitive interface.</p>
                </div>
                <div className="bg-blue-50 p-5 rounded-lg">
                  <div className="text-blue-600 text-2xl mb-2">🔍</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Powerful Search</h3>
                  <p className="text-gray-600">Find any note instantly with our lightning-fast search engine.</p>
                </div>
                <div className="bg-purple-50 p-5 rounded-lg">
                  <div className="text-purple-600 text-2xl mb-2">🌓</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Light & Dark Mode</h3>
                  <p className="text-gray-600">Work comfortably day or night with theme switching.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Responsive Design</h3>
                      <p className="text-gray-600">Access your notes on any device with our fully responsive interface.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-xl">🔄</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Real-time Updates</h3>
                      <p className="text-gray-600">See changes instantly with our real-time syncing technology.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-xl">🔒</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Secure Storage</h3>
                      <p className="text-gray-600">Your notes are encrypted and securely stored for peace of mind.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-xl">🔍</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Powerful Search</h3>
                      <p className="text-gray-600">Find any note instantly with our lightning-fast search engine.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-xl">📚</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Categorization</h3>
                      <p className="text-gray-600">Organize notes with customizable tags and categories.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-xl">🌓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Light & Dark Mode</h3>
                      <p className="text-gray-600">Work comfortably day or night with our theme switching.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-blue-400 rounded-lg p-6 text-white mt-8">
                <h3 className="text-xl font-medium mb-2">Coming Soon!</h3>
                <p className="mb-4">We're constantly improving NoteHive. Here's what's coming next:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-center"><span className="mr-2">✨</span> Collaborative notes</li>
                  <li className="flex items-center"><span className="mr-2">✨</span> Voice notes</li>
                  <li className="flex items-center"><span className="mr-2">✨</span> Advanced formatting options</li>
                  <li className="flex items-center"><span className="mr-2">✨</span> Mobile app integration</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meet Our Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-300">
                  <div className="bg-blue-50 h-32 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                      👩‍💻
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-medium text-gray-800">Vaishnavi Singh</h3>
                    <p className="text-purple-600">Founder & Lead Developer</p>
                    <p className="text-gray-600 mt-2">Passionate about creating tools that enhance productivity and creativity.</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-300">
                  <div className="bg-purple-50 h-32 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                      🎨
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-medium text-gray-800">Design Team</h3>
                    <p className="text-purple-600">UI/UX Specialists</p>
                    <p className="text-gray-600 mt-2">Creating beautiful interfaces that are intuitive and delightful to use.</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-300">
                  <div className="bg-blue-50 h-32 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                      🚀
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-medium text-gray-800">You!</h3>
                    <p className="text-purple-600">Community Member</p>
                    <p className="text-gray-600 mt-2">Your feedback and ideas help us improve NoteHive every day.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Is NoteHive free to use?</h3>
                  <p className="text-gray-600">Yes! NoteHive is completely free for personal use. We also offer premium features for power users.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Can I access my notes offline?</h3>
                  <p className="text-gray-600">Absolutely! NoteHive allows you to access and edit your notes even when you're offline.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">How secure are my notes?</h3>
                  <p className="text-gray-600">Security is our priority. All notes are encrypted and stored securely on our servers.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Can I share my notes with others?</h3>
                  <p className="text-gray-600">Sharing features are coming soon! You'll be able to collaborate on notes with friends and colleagues.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">How do I report bugs or suggest features?</h3>
                  <p className="text-gray-600">We love hearing from our users! Contact us through the feedback form in the app or email support@notehive.com.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">Created by: <strong>Vaishnavi Singh</strong></p>
            <div className="flex mt-2 md:mt-0">
              <button className="text-purple-600 hover:text-purple-800 mx-2">Terms</button>
              <button className="text-purple-600 hover:text-purple-800 mx-2">Privacy</button>
              <button className="text-purple-600 hover:text-purple-800 mx-2">Contact</button>
            </div>
            <p className="text-gray-500 mt-2 md:mt-0">&copy; 2025 NoteHive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;