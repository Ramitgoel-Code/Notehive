import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const NoteDetails = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [highlights, setHighlights] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const contentRef = useRef(null);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  
  // New state variables for additional features
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState("");
  const [studyProgress, setStudyProgress] = useState(0);
  const [studyTime, setStudyTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showThoughtPanel, setShowThoughtPanel] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.note) {
          setNote(res.data.note);
          
          // Load saved highlights from localStorage
          const savedHighlights = localStorage.getItem(`highlights-${id}`);
          if (savedHighlights) {
            setHighlights(JSON.parse(savedHighlights));
          }
          
          // Load saved bookmarks from localStorage
          const savedBookmarks = localStorage.getItem(`bookmarks-${id}`);
          if (savedBookmarks) {
            setBookmarks(JSON.parse(savedBookmarks));
          }
          
          // Load saved thoughts from localStorage
          const savedThoughts = localStorage.getItem(`thoughts-${id}`);
          if (savedThoughts) {
            setThoughts(JSON.parse(savedThoughts));
          }
          
          // Load saved study progress from localStorage
          const savedProgress = localStorage.getItem(`progress-${id}`);
          if (savedProgress) {
            setStudyProgress(JSON.parse(savedProgress));
          }
          
          // Load saved study time from localStorage
          const savedTime = localStorage.getItem(`studyTime-${id}`);
          if (savedTime) {
            setStudyTime(JSON.parse(savedTime));
          }
        }
      } catch (error) {
        console.error("Error fetching note:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to load the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
    
    // Clean up timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [id, timerInterval]);

  // Timer functions for tracking study time
  const startTimer = () => {
    if (!isTimerActive) {
      setIsTimerActive(true);
      const interval = setInterval(() => {
        setStudyTime(prev => {
          const newTime = prev + 1;
          localStorage.setItem(`studyTime-${id}`, JSON.stringify(newTime));
          return newTime;
        });
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const pauseTimer = () => {
    if (isTimerActive && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setIsTimerActive(false);
    }
  };

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerActive(false);
    setStudyTime(0);
    localStorage.setItem(`studyTime-${id}`, JSON.stringify(0));
  };

  // Format seconds to hh:mm:ss
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  // Handle study progress update
  const updateProgress = (value) => {
    setStudyProgress(value);
    localStorage.setItem(`progress-${id}`, JSON.stringify(value));
  };

  // Handle adding new thoughts
  const addThought = (e) => {
    e.preventDefault();
    if (newThought.trim()) {
      const thought = {
        id: Date.now().toString(),
        content: newThought,
        timestamp: new Date().toISOString(),
        position: contentRef.current ? contentRef.current.scrollTop : 0
      };
      
      const updatedThoughts = [...thoughts, thought];
      setThoughts(updatedThoughts);
      localStorage.setItem(`thoughts-${id}`, JSON.stringify(updatedThoughts));
      setNewThought("");
    }
  };

  // Delete a thought
  const deleteThought = (thoughtId) => {
    const updatedThoughts = thoughts.filter(t => t.id !== thoughtId);
    setThoughts(updatedThoughts);
    localStorage.setItem(`thoughts-${id}`, JSON.stringify(updatedThoughts));
  };

  // Jump to a thought's position in the note
  const jumpToThoughtPosition = (position) => {
    if (contentRef.current && position) {
      contentRef.current.scrollTop = position;
      // Show content tab if not active
      setActiveTab('content');
      // Briefly highlight the area to draw attention
      contentRef.current.classList.add("bookmark-flash");
      setTimeout(() => {
        contentRef.current.classList.remove("bookmark-flash");
      }, 1000);
    }
  };

  // Handle text selection for highlighting
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      // Position the toolbar above the selection
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setToolbarPosition({
        top: rect.top - 45, // Position above the selected text
        left: rect.left + (rect.width / 2) // Center horizontally
      });
      
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  // Add highlight to selected text - FIXED VERSION
  const addHighlight = (color) => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      // Create a unique ID for this highlight
      const highlightId = Date.now().toString();
      
      // Store the highlight info
      const newHighlight = {
        id: highlightId,
        text: selection.toString(),
        color,
        timestamp: new Date().toISOString(),
      };
      
      const updatedHighlights = [...highlights, newHighlight];
      setHighlights(updatedHighlights);
      localStorage.setItem(`highlights-${id}`, JSON.stringify(updatedHighlights));
      
      // Use a safer approach to apply the highlight
      try {
        const range = selection.getRangeAt(0);
        const contents = range.extractContents();
        const span = document.createElement("span");
        span.className = "highlighted";
        span.style.backgroundColor = color;
        span.style.padding = "2px 1px";
        span.style.borderRadius = "2px";
        span.dataset.highlightId = highlightId;
        
        span.appendChild(contents);
        range.insertNode(span);
        
        // Clean up the selection
        selection.removeAllRanges();
        setShowToolbar(false);
      } catch (error) {
        console.error("Error applying highlight:", error);
        // Show a fallback message to the user
        alert("Couldn't apply highlight to this selection. Try selecting text within a single paragraph.");
      }
    }
  };

  // Remove a highlight
  const removeHighlight = (highlightId) => {
    // Remove from state and localStorage
    const updatedHighlights = highlights.filter(h => h.id !== highlightId);
    setHighlights(updatedHighlights);
    localStorage.setItem(`highlights-${id}`, JSON.stringify(updatedHighlights));
    
    // Remove the highlight span from the DOM
    const highlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`);
    if (highlightElement) {
      const parent = highlightElement.parentNode;
      while (highlightElement.firstChild) {
        parent.insertBefore(highlightElement.firstChild, highlightElement);
      }
      parent.removeChild(highlightElement);
    }
  };

  // Add bookmark for current position
  const addBookmark = () => {
    if (contentRef.current) {
      const scrollPosition = contentRef.current.scrollTop;
      const timestamp = new Date().toISOString();
      const text = getVisibleText(contentRef.current, scrollPosition);
      
      const newBookmark = {
        id: Date.now().toString(),
        position: scrollPosition,
        timestamp,
        text: text.substring(0, 100) + (text.length > 100 ? "..." : "")
      };
      
      const updatedBookmarks = [...bookmarks, newBookmark];
      setBookmarks(updatedBookmarks);
      localStorage.setItem(`bookmarks-${id}`, JSON.stringify(updatedBookmarks));
    }
  };

  // Get visible text at current scroll position (for bookmark preview)
  const getVisibleText = (element, scrollPosition) => {
    // Simple approximation - in a real app you'd calculate this more precisely
    const allText = element.innerText;
    const approximatePosition = Math.floor((scrollPosition / element.scrollHeight) * allText.length);
    return allText.substring(approximatePosition, approximatePosition + 200);
  };

  // Jump to bookmark position
  const jumpToBookmark = (position) => {
    if (contentRef.current) {
      contentRef.current.scrollTop = position;
      // Briefly highlight the area to draw attention
      contentRef.current.classList.add("bookmark-flash");
      setTimeout(() => {
        contentRef.current.classList.remove("bookmark-flash");
      }, 1000);
    }
  };

  // Remove a bookmark
  const removeBookmark = (bookmarkId) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`bookmarks-${id}`, JSON.stringify(updatedBookmarks));
  };

  // Font size controls
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 28));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));
  const resetFontSize = () => setFontSize(16);

  // Close toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showToolbar && !event.target.closest('.highlight-toolbar')) {
        setShowToolbar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolbar]);

  // Auto-start timer when component mounts
  useEffect(() => {
    if (!loading && note) {
      startTimer();
    }
  }, [loading, note]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading your study note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="text-red-500 text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Note not found</h2>
          <p className="text-gray-600 mb-6">{error || "The note you're looking for doesn't exist or has been removed."}</p>
          <Link to="/notes" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/notes" className="flex items-center text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Notes
            </Link>
            
            {/* Study progress tracker in header */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="w-24 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${studyProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{studyProgress}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Time:</span>
                <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {formatTime(studyTime)}
                </div>
                <div className="flex space-x-1">
                  {isTimerActive ? (
                    <button 
                      onClick={pauseTimer}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Pause timer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      onClick={startTimer}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Start timer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <button 
                    onClick={resetTimer}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="Reset timer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowThoughtPanel(!showThoughtPanel)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
                title="My Thoughts"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {thoughts.length > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {thoughts.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setShowControlPanel(!showControlPanel)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                title="Study Tools"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile progress tracker */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <span className="text-xs text-gray-600">Progress:</span>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${studyProgress}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-700">{studyProgress}%</span>
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {formatTime(studyTime)}
              </div>
              <div className="flex">
                {isTimerActive ? (
                  <button 
                    onClick={pauseTimer}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                ) : (
                  <button 
                    onClick={startTimer}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thoughts panel (slides in from right) */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-white shadow-lg transform ${showThoughtPanel ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">My Thoughts</h3>
            <button 
              onClick={() => setShowThoughtPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Add new thought form */}
          <form onSubmit={addThought} className="mb-4">
            <textarea
              value={newThought}
              onChange={(e) => setNewThought(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Add your thoughts here..."
              rows="3"
            ></textarea>
            <button
              type="submit"
              disabled={!newThought.trim()}
              className={`mt-2 w-full px-3 py-2 text-sm font-medium text-white rounded-lg ${!newThought.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Add Thought
            </button>
          </form>
          
          {/* Thoughts list */}
          <div className="flex-1 overflow-y-auto">
            {thoughts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-3xl mb-2">💭</div>
                <p className="text-sm text-gray-500">No thoughts added yet</p>
                <p className="text-xs text-gray-400 mt-1">Add your first thought above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {thoughts.map(thought => (
                  <div 
                    key={thought.id} 
                    className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-gray-500">
                        {new Date(thought.timestamp).toLocaleString()}
                      </span>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => jumpToThoughtPosition(thought.position)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Jump to this position in note"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => deleteThought(thought.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete thought"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{thought.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Control panel (slides in from right) */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-white shadow-lg transform ${showControlPanel ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Study Tools</h3>
            <button 
              onClick={() => setShowControlPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Study Progress Tracker */}
          <div className="border-b pb-4 mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Study Progress</h4>
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max="100"
                value={studyProgress}
                onChange={(e) => updateProgress(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">0%</span>
              <span className="text-xs font-medium text-gray-700">{studyProgress}% Complete</span>
              <span className="text-xs text-gray-500">100%</span>
            </div>
          </div>
          
          {/* Font Size Controls */}
          <div className="border-b pb-4 mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Font Size</h4>
            <div className="flex items-center justify-between">
              <button onClick={decreaseFontSize} className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="font-medium text-gray-700">{fontSize}px</span>
              <button onClick={increaseFontSize} className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={resetFontSize} className="text-sm text-blue-600 hover:text-blue-800 ml-2">Reset</button>
            </div>
          </div>
          
          {/* Bookmarks */}
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-600">Bookmarks</h4>
              <button 
                onClick={addBookmark}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Add
              </button>
            </div>
            <div className="max-h-36 overflow-y-auto">
              {bookmarks.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No bookmarks yet</p>
              ) : (
                <ul className="space-y-2">
                  {bookmarks.map(bookmark => (
                    <li key={bookmark.id} className="text-xs bg-gray-50 p-2 rounded">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">{new Date(bookmark.timestamp).toLocaleString()}</span>
                        <button 
                          onClick={() => removeBookmark(bookmark.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div 
                        className="text-gray-800 cursor-pointer hover:text-blue-600"
                        onClick={() => jumpToBookmark(bookmark.position)}
                      >
                        {bookmark.text}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Highlights */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-600">Highlights</h4>
            </div>
            <div className="space-y-3">
              {highlights.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No highlights yet</p>
              ) : (
                highlights.map(highlight => (
                  <div 
                    key={highlight.id} 
                    className="text-xs p-2 rounded" 
                    style={{ backgroundColor: highlight.color + '40' }}  // Add transparency
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">{new Date(highlight.timestamp).toLocaleString()}</span>
                      <button 
                        onClick={() => removeHighlight(highlight.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-800">{highlight.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Note Title and Subject */}
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-700 to-blue-500 text-white">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{note.title}</h1>
            <p className="mt-2 text-blue-100 font-medium">{note.subject}</p>
            {/* Display progress in title bar */}
            <div className="mt-4 flex items-center">
              <div className="w-full h-2 bg-blue-800 bg-opacity-40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white" 
                  style={{ width: `${studyProgress}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium text-white">{studyProgress}%</span>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="bg-gray-50 px-8 flex border-b">
            <button
              className={`py-4 px-4 font-medium ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('content')}
            >
              Note Content
            </button>
            <button
              className={`py-4 px-4 font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('info')}
            >
              Note Info
            </button>
            <button
              className={`py-4 px-4 font-medium ${activeTab === 'thoughts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('thoughts')}
            >
              My Thoughts
              {thoughts.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                  {thoughts.length}
                </span>
              )}
            </button>
          </div>
          
          {/* Content Tab */}
          {activeTab === 'content' && (
            <div 
              ref={contentRef}
              className="px-8 py-6 max-h-screen-3/4 overflow-y-auto"
              style={{ fontSize: `${fontSize}px` }}
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
            >
              {/* Floating toolbar for text selection - positioned based on selection */}
              {showToolbar && (
                <div 
                  className="fixed highlight-toolbar bg-white rounded-lg shadow-lg flex overflow-hidden border border-gray-200 z-50"
                  style={{ 
                    top: `${toolbarPosition.top}px`,
                    left: `${toolbarPosition.left}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <button 
                    className="p-2 hover:bg-yellow-100" 
                    onClick={() => addHighlight('#FFEB3B')}
                    title="Yellow highlight"
                  >
                    <div className="w-5 h-5 bg-yellow-300 rounded"></div>
                  </button>
                  <button 
                    className="p-2 hover:bg-green-100" 
                    onClick={() => addHighlight('#81C784')}
                    title="Green highlight"
                  >
                    <div className="w-5 h-5 bg-green-300 rounded"></div>
                  </button>
                  <button 
                    className="p-2 hover:bg-blue-100" 
                    onClick={() => addHighlight('#64B5F6')}
                    title="Blue highlight"
                  >
                    <div className="w-5 h-5 bg-blue-300 rounded"></div>
                  </button>
                  <button 
                    className="p-2 hover:bg-purple-100" 
                    onClick={() => addHighlight('#BA68C8')}
                    title="Purple highlight"
                  >
                    <div className="w-5 h-5 bg-purple-300 rounded"></div>
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 border-l border-gray-200" 
                    onClick={() => {
                      const selection = window.getSelection();
                      const text = selection.toString();
                      if (text) {
                        setNewThought(text);
                        setShowThoughtPanel(true);
                        setShowToolbar(false);
                      }
                    }}
                    title="Add as thought"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div 
                className="prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:marker:text-indigo-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: note.content }}
              ></div>
            </div>
          )}
          
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="px-8 py-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Note Details</h3>
                  <dl className="grid grid-cols-3 gap-2">
                    <dt className="col-span-1 text-sm font-medium text-gray-500">Created</dt>
                    <dd className="col-span-2 text-sm text-gray-700">
                      {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Unknown'}
                    </dd>
                    <dt className="col-span-1 text-sm font-medium text-gray-500">Updated</dt>
                    <dd className="col-span-2 text-sm text-gray-700">
                      {note.updatedAt ? new Date(note.updatedAt).toLocaleString() : 'Unknown'}
                    </dd>
                    <dt className="col-span-1 text-sm font-medium text-gray-500">ID</dt>
                    <dd className="col-span-2 text-sm text-gray-700">{note._id}</dd>
                  </dl>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Study Statistics</h3>
                  <dl className="grid grid-cols-3 gap-2">
                    <dt className="col-span-1 text-sm font-medium text-gray-500">Progress</dt>
                    <dd className="col-span-2 text-sm text-gray-700">
                      <div className="flex items-center">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${studyProgress}%` }}
                          ></div>
                        </div>
                        {studyProgress}%
                      </div>
                    </dd>
                    <dt className="col-span-1 text-sm font-medium text-gray-500">Study time</dt>
                    <dd className="col-span-2 text-sm text-gray-700">{formatTime(studyTime)}</dd>
                    <dt className="col-span-1 text-sm font-medium text-gray-500">Highlights</dt>
                    <dd className="col-span-2 text-sm text-gray-700">{highlights.length}</dd>
                    <dt className="col-span-1 text-sm font-medium text-gray-500">Bookmarks</dt>
                    <dd className="col-span-2 text-sm text-gray-700">{bookmarks.length}</dd>
                    <dt className="col-span-1 text-sm font-medium text-gray-500">Thoughts</dt>
                    <dd className="col-span-2 text-sm text-gray-700">{thoughts.length}</dd>
                    <dt className="col-span-1 text-sm font-medium text-gray-500">Word count</dt>
                    <dd className="col-span-2 text-sm text-gray-700">
                      {note.content ? note.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length : 0}
                    </dd>
                  </dl>
                </div>
              </div>
              
              {note.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-700">{note.description}</p>
                </div>
              )}
              
              {/* Study Progress History Chart */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Study Progress</h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-full">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={studyProgress}
                      onChange={(e) => updateProgress(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <span className="ml-4 text-lg font-medium text-green-600">{studyProgress}%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 px-2">
                  <span>Not started</span>
                  <span>In progress</span>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Thoughts Tab */}
          {activeTab === 'thoughts' && (
            <div className="px-8 py-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Add New Thought</h3>
                <form onSubmit={addThought} className="flex flex-col">
                  <textarea
                    value={newThought}
                    onChange={(e) => setNewThought(e.target.value)}
                    className="w-full px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add your thoughts, questions, or insights about this note..."
                    rows="4"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={!newThought.trim()}
                    className={`mt-3 px-4 py-2 text-white font-medium rounded-lg self-end ${!newThought.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    Add Thought
                  </button>
                </form>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">My Thoughts ({thoughts.length})</h3>
                {thoughts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-400 text-4xl mb-3">💭</div>
                    <h4 className="text-gray-700 font-medium text-lg mb-2">No thoughts yet</h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Add your insights, questions or notes about this content to help with your learning.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {thoughts.map(thought => (
                      <div 
                        key={thought.id} 
                        className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-500">
                            {new Date(thought.timestamp).toLocaleString()}
                          </span>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => jumpToThoughtPosition(thought.position)}
                              className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                              title="Jump to this position in note"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              View in context
                            </button>
                            <button 
                              onClick={() => deleteThought(thought.id)}
                              className="text-red-500 hover:text-red-700 flex items-center text-sm"
                              title="Delete thought"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap break-words">{thought.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-500">Happy Learning 📘</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={addBookmark}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title="Bookmark this position"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setActiveTab('thoughts');
                  setTimeout(() => {
                    const thoughtsTextarea = document.querySelector('textarea');
                    if (thoughtsTextarea) {
                      thoughtsTextarea.focus();
                    }
                  }, 100);
                }}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title="Add thought"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
              <button
                onClick={() => window.print()}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title="Print note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add custom CSS for specific features */}
      <style jsx>{`
        .highlighted:hover {
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .bookmark-flash {
          animation: flash 1s;
        }
        
        @keyframes flash {
          0% { background-color: rgba(59, 130, 246, 0.2); }
          100% { background-color: transparent; }
        }
        
        @media print {
          .no-print {
            display: none;
          }
        }
        
        .max-h-screen-3\/4 {
          max-height: 75vh;
        }

        /* Custom styles for range slider */
        input[type="range"] {
          -webkit-appearance: none;
          height: 7px;
          border-radius: 5px;
          background: #d3d3d3;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default NoteDetails;