import React, { useState, useEffect } from "react";

const Profile = () => {
  // Initialize state with default empty values
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    profilePic: "",
    phone: "",
    location: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    location: "",
  });
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from registration details (localStorage)
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const storedUsername = localStorage.getItem("username") || "Your Name";
      const storedEmail = localStorage.getItem("email") || "your.email@example.com";
      const storedBio = localStorage.getItem("bio") || "Write something about yourself...";
      const storedProfilePic = localStorage.getItem("profilePic") || "https://via.placeholder.com/150";
      const storedPhone = localStorage.getItem("phone") || "Enter your phone number";
      const storedLocation = localStorage.getItem("location") || "Enter your location";

      const userData = {
        name: storedUsername,
        email: storedEmail,
        bio: storedBio,
        profilePic: storedProfilePic,
        phone: storedPhone,
        location: storedLocation,
      };

      setUser(userData);
      setFormData({
        bio: storedBio,
        phone: storedPhone,
        location: storedLocation,
      });
      setLoading(false);
    }, 500);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save updated profile details
  const handleSave = () => {
    setLoading(true);
    
    // Simulate saving data
    setTimeout(() => {
      localStorage.setItem("bio", formData.bio);
      localStorage.setItem("phone", formData.phone);
      localStorage.setItem("location", formData.location);
      
      if (newProfilePic) {
        localStorage.setItem("profilePic", newProfilePic);
      }

      setUser({
        ...user,
        bio: formData.bio,
        profilePic: newProfilePic || user.profilePic,
        phone: formData.phone,
        location: formData.location,
      });

      setEditMode(false);
      setPreviewImage(null);
      setNewProfilePic(null);
      setLoading(false);
    }, 800);
  };

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setNewProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cancel edit mode
  const handleCancel = () => {
    setFormData({
      bio: user.bio,
      phone: user.phone,
      location: user.location,
    });
    setEditMode(false);
    setPreviewImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded w-full max-w-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Image - Using NoteHive purple gradient */}
          <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-400"></div>
          
          {/* Profile Picture */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-32">
            <div className="relative">
              <img
                src={previewImage || user.profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover bg-gray-100"
              />
              {editMode && (
                <label htmlFor="profile-pic-upload" className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition duration-200">
                  <span className="text-white text-xs">📷</span>
                  <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 px-6 pb-6">
          {/* User Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <div className="flex items-center justify-center mt-1">
              <span className="mr-1">✉️</span>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-6">
            {/* Bio Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">About Me</h3>
              {editMode ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Write something about yourself..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  rows="4"
                />
              ) : (
                <p className="text-gray-600">{user.bio}</p>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3">📱</span>
                  {editMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  ) : (
                    <p className="text-gray-600">{user.phone}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3">📍</span>
                  {editMode ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter your location"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  ) : (
                    <p className="text-gray-600">{user.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            {editMode ? (
              <>
                <button 
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  <span className="mr-1">❌</span>
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                  <span className="mr-1">💾</span>
                  Save Changes
                </button>
              </>
            ) : (
              <button 
                onClick={() => setEditMode(true)}
                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <span className="mr-2">✏️</span>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;