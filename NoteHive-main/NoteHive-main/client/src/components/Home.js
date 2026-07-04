import React, { useState } from "react";
import { FaStickyNote } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const csCategories = [
    { icon: "💻", title: "Programming Languages", count: "45 notes" },
    { icon: "🔄", title: "Data Structures & Algorithms", count: "38 notes" },
    { icon: "🔌", title: "Computer Networks", count: "32 notes" },
    { icon: "🛡️", title: "Cybersecurity", count: "27 notes" },
    { icon: "🤖", title: "Artificial Intelligence", count: "35 notes" },
    { icon: "🗄️", title: "Database Systems", count: "30 notes" }
  ];

  const featuredNotes = [
    { title: "Advanced DSA: Graph Algorithms", subject: "Data Structures", date: "Apr 22", popularity: "1250+ reads" },
    { title: "Machine Learning Fundamentals", subject: "AI", date: "Apr 20", popularity: "1420+ reads" },
    { title: "Full Stack Web Development", subject: "Programming", date: "Apr 19", popularity: "1800+ reads" },
    { title: "Network Security Protocols", subject: "Cybersecurity", date: "Apr 17", popularity: "950+ reads" }
  ];

  const upcomingTechnicalTests = [
    { title: "Data Structures Coding Test", date: "Tomorrow, 3:00 PM", questions: "10 problems" },
    { title: "Operating Systems Concepts", date: "Apr 26, 4:30 PM", questions: "30 questions" }
  ];
  
  // Handle click functions
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      console.log(`Searching for: ${searchQuery}`);
      // Here you would typically implement search functionality
      alert(`Searching for: ${searchQuery}`);
    }
  };
  
  const handleNotificationClick = () => {
    console.log("Notification clicked");
    alert("Notifications panel opened");
  };
  
  const handleBrowseNotes = () => {
    console.log("Browse CS Notes clicked");
    alert("Navigating to CS Notes catalog");
  };
  
  const handleCodingPractice = () => {
    console.log("Coding Practice clicked");
    alert("Navigating to Coding Practice section");
  };
  
  const handleViewAllNotes = () => {
    console.log("View All Notes clicked");
    alert("Viewing all top-rated CS notes");
  };
  
  const handleNoteClick = (noteTitle) => {
    console.log(`Note clicked: ${noteTitle}`);
    alert(`Opening note: ${noteTitle}`);
  };
  
  const handleCategoryClick = (categoryTitle) => {
    console.log(`Category clicked: ${categoryTitle}`);
    alert(`Browsing ${categoryTitle} category`);
  };
  
  const handleViewDashboard = () => {
    console.log("View CS Dashboard clicked");
    alert("Navigating to personal CS dashboard");
  };
  
  const handlePracticeNow = (testTitle) => {
    console.log(`Practice for test: ${testTitle}`);
    alert(`Starting practice for: ${testTitle}`);
  };
  
  const handleViewAllTests = () => {
    console.log("View All Tests clicked");
    alert("Viewing all upcoming technical tests");
  };
  
  const handleAccessPlacementResources = () => {
    console.log("Access Placement Resources clicked");
    alert("Accessing placement preparation resources");
  };
  
  const handleTechNewsClick = (newsTitle) => {
    console.log(`Tech news clicked: ${newsTitle}`);
    alert(`Reading news article: ${newsTitle}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Welcome to NoteHive CS!</h1>
            <p className="text-gray-600">Your ultimate resource for B.Tech Computer Science notes and preparation</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search CS notes..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            <button 
              className="bg-white p-2 rounded-full shadow hover:shadow-md transition-shadow"
              onClick={handleNotificationClick}
            >
              <span className="text-gray-600">🔔</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Notes and Learning Content */}
          <div className="lg:col-span-2">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">Level Up Your CS Knowledge</h2>
                  <p className="mb-4 opacity-90">Access high-quality Computer Science notes created by top students and professors.</p>
                  <div className="flex space-x-3">
                  <div>
               <Link 
    to="notes" 
    className="bg-indigo-700 text-white border border-white border-opacity-30 px-4 py-2 rounded-lg font-medium hover:bg-indigo-800 transition-colors shadow-md flex items-center gap-2"
  >
    Browse Notes
  </Link>
</div>
<a 
  href="https://leetcode.com" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <button
    className="bg-indigo-700 text-white border border-white border-opacity-30 px-4 py-2 rounded-lg font-medium hover:bg-indigo-800 transition-colors shadow-md"
    onClick={handleCodingPractice}
  >
    Coding Practice
  </button>
</a>
                 
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-white bg-opacity-20 p-4 rounded-full">
                    <div className="text-4xl">💻</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top-Rated Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Top-Rated CS Notes</h3>
                <button 
                  className="text-indigo-600 flex items-center hover:text-indigo-800 transition-colors"
                  onClick={handleViewAllNotes}
                >
                  View All <span className="ml-1">▶</span>
                </button>
              </div>
              <div className="space-y-4">
                {featuredNotes.map((note, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                    onClick={() => handleNoteClick(note.title)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{note.title}</h4>
                      <span className="text-xs text-gray-500">Updated {note.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                        {note.subject}
                      </span>
                      <span className="text-xs text-gray-500">{note.popularity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CS Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Computer Science Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {csCategories.map((category, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCategoryClick(category.title)}
                  >
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{category.title}</h4>
                      <p className="text-sm text-gray-500">{category.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - User Info and Resources */}
          <div className="space-y-8">
            {/* User Progress Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full flex items-center justify-center text-2xl text-white font-bold mb-4">
                VS
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Vaishnavi Singh</h3>
              <p className="text-gray-500 text-sm mb-4">B.Tech CSE Student</p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Learning Progress</span>
                  <span className="text-indigo-600 font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">34</p>
                  <p className="text-xs text-gray-600">CS Notes Studied</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">18</p>
                  <p className="text-xs text-gray-600">Problems Solved</p>
                </div>
              </div>
              
              <button 
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={handleViewDashboard}
              >
                View CS Dashboard
              </button>
            </div>

            {/* Upcoming Technical Tests */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Tech Tests</h3>
              <div className="space-y-4">
                {upcomingTechnicalTests.map((test, index) => (
                  <div 
                    key={index}
                    className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600 text-xl">
                        🖥️
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{test.title}</h4>
                        <p className="text-sm text-gray-500">{test.date}</p>
                        <p className="text-xs text-gray-500 mt-1">{test.questions}</p>
                      </div>
                    </div>
                    <button 
                      className="w-full mt-2 text-center py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
                      onClick={() => handlePracticeNow(test.title)}
                    >
                      Practice Now
                    </button>
                  </div>
                ))}
                <button 
                  className="w-full py-2 text-center text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium"
                  onClick={handleViewAllTests}
                >
                  View All Tests
                </button>
              </div>
            </div>

            {/* Interview Prep Card */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Placement Prep Resources</h3>
              <p className="text-sm opacity-90 mb-4">
                Access interview preparation materials from top tech companies including coding challenges, system design questions, and interview experiences.
              </p>
              <button 
                className="bg-white text-indigo-600 px-4 py-2 w-full rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
                onClick={handleAccessPlacementResources}
              >
                Access Placement Resources
              </button>
            </div>
            
            {/* Tech News Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">CS Tech Updates</h3>
              <div className="space-y-4">
                <div 
                  className="border-b border-gray-100 pb-3 cursor-pointer"
                  onClick={() => handleTechNewsClick("New React 19 Features")}
                >
                  <h4 className="font-medium text-gray-800">New React 19 Features</h4>
                  <p className="text-sm text-gray-600 mt-1">Latest React updates that every developer should know</p>
                </div>
                <div 
                  className="border-b border-gray-100 pb-3 cursor-pointer"
                  onClick={() => handleTechNewsClick("Upcoming Hackathon")}
                >
                  <h4 className="font-medium text-gray-800">Upcoming Hackathon</h4>
                  <p className="text-sm text-gray-600 mt-1">Register for the campus-wide coding competition</p>
                </div>
                <div 
                  className="cursor-pointer"
                  onClick={() => handleTechNewsClick("LLM Developments")}
                >
                  <h4 className="font-medium text-gray-800">LLM Developments</h4>
                  <p className="text-sm text-gray-600 mt-1">Recent breakthroughs in large language models</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;