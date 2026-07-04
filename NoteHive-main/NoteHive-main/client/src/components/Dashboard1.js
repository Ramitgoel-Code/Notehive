import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaStickyNote,
  FaInfoCircle,
  FaPuzzlePiece,
  FaUsersCog,
  FaSignOutAlt,
  FaHome,
  FaQuoteLeft,
  FaUser,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";
// At the top with your other imports, add:

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");
  const [adminSubmenuOpen, setAdminSubmenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    const storedProfilePic = localStorage.getItem("profilePic");
    
    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setRole(storedRole.trim().toLowerCase());
    if (storedProfilePic) setProfilePic(storedProfilePic);
  }, []);

  // Handle dark mode
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleAdminSubmenu = () => setAdminSubmenuOpen(!adminSubmenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("token");
    
    setUsername("");
    setRole("");
    setProfilePic("https://via.placeholder.com/150");
    
    navigate("/login");
  };

  // Function to check active route
  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // NavLink component for consistent styling
  const NavLink = ({ to, icon, children, onClick, submenu = false }) => {
    const IconComponent = icon;
    const isActive = isActiveRoute(to);
    
    return (
      <Link 
        to={to} 
        onClick={onClick}
        className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all ${
          isActive 
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium" 
            : "hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300"
        } ${submenu ? "pl-8" : ""}`}
      >
        <IconComponent size={submenu ? 14 : 16} />
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <div className={`flex h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {/* Overlay for mobile */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-all duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-40 h-full`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-purple-600 text-white p-2 rounded-lg">
              <FaStickyNote size={20} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">NoteHive</h1>
          </Link>
          <button className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={toggleMenu}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-1 overflow-y-auto flex-grow">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 pl-4">Main</p>
          
          <NavLink to="/" icon={FaHome}>Home</NavLink>
          <NavLink to="/notes" icon={FaStickyNote}>Notes</NavLink>
          <NavLink to="/cp-trivia" icon={FaPuzzlePiece}>Trivia</NavLink>
          <NavLink to="/about" icon={FaInfoCircle}>About</NavLink>
        
          {role === "admin" && (
            <>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-6 mb-2 pl-4">Admin</p>
              
              <button 
                onClick={toggleAdminSubmenu}
                className={`flex items-center justify-between gap-3 py-2.5 px-4 rounded-lg transition-all ${
                  isActiveRoute("/admin") 
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaUsersCog size={16} />
                  <span>Admin Panel</span>
                </div>
                {adminSubmenuOpen ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
              </button>
              
              {adminSubmenuOpen && (
                <div className="ml-2">
                  <NavLink to="/admin" icon={FaUsersCog} submenu>Dashboard</NavLink>
                  <NavLink to="/admin/noteManager" icon={FaStickyNote} submenu>Note Manager</NavLink>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-auto border-t border-gray-200 dark:border-gray-700 p-4">
          {username ? (
            <div className="space-y-4">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="profile"
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                      setProfilePic("https://via.placeholder.com/150");
                      localStorage.setItem("profilePic", "https://via.placeholder.com/150");
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <FaUser className="text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role || "User"}</p>
                </div>
              </Link>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-1"
                >
                  {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                  aria-label="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link 
                to="/login" 
                className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="py-2 px-4 border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg text-center transition-colors"
              >
                Sign Up
              </Link>
              
              <button
                onClick={toggleDarkMode}
                className="mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top navbar for mobile */}
        <header className="bg-white dark:bg-gray-800 shadow-sm md:hidden py-3 px-4 flex items-center">
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-xl font-bold ml-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">NoteHive</h1>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Welcome Screen */}
          {location.pathname === "/dashboard" ? (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                {/* Hero section */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 sm:p-12">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                      Welcome to NoteHive{username ? `, ${username}` : ''}
                    </h2>
                    <p className="text-lg opacity-90">
                      Your professional workspace for notes, trivia, and productivity tools.
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  {/* Quote */}
                  <div className="bg-purple-50 dark:bg-gray-750 rounded-xl p-6 mb-8 relative">
                    <div className="absolute top-6 left-6 text-purple-400">
                      <FaQuoteLeft size={24} />
                    </div>
                    <blockquote className="pl-12 text-xl text-gray-700 dark:text-gray-200 italic">
                      "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
                    </blockquote>
                    <p className="mt-4 text-right text-gray-600 dark:text-gray-400">
                      – Paul J. Meyer
                    </p>
                  </div>

                  {/* Features Grid */}
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard 
                      title="Notes"
                      icon={<FaStickyNote className="text-purple-600" size={20} />}
                      description="Create, organize and manage your notes in one place"
                    />
                    <FeatureCard 
                      title="Trivia"
                      icon={<FaPuzzlePiece className="text-indigo-600" size={20} />}
                      description="Test your knowledge with fun and educational trivia"
                    />
                    <FeatureCard 
                      title="Organization"
                      icon={<FaUsersCog className="text-blue-600" size={20} />}
                      description="Organize your content with tags and categories"
                    />
                    <FeatureCard 
                      title="Productivity"
                      icon={<FaHome className="text-green-600" size={20} />}
                      description="Boost your productivity with our suite of tools"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ title, icon, description }) => (
  <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h4 className="font-semibold text-lg">{title}</h4>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
  </div>
);

export default Dashboard;
