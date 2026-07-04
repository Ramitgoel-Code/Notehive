import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NoteManager = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState({ title: "", subject: "", content: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const token = localStorage.getItem("token");

  // Handle fetch notes and errors
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch notes. Please check your connection and permissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  // Get unique subjects for filter dropdown
  const uniqueSubjects = ["", ...new Set(notes.map((note) => note.subject))];

  // Filter notes based on search and subject
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const resetForm = () => {
    setNote({ title: "", subject: "", content: "" });
    setEditingNoteId(null);
  };

  const saveNote = async () => {
    // Validate form
    if (!note.title.trim() || !note.subject.trim() || !note.content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    const cleanedContent = note.content.replace(/^<p>/, "").replace(/<\/p>$/, "");

    try {
      if (editingNoteId) {
        const response = await axios.put(
          `http://localhost:5000/api/notes/${editingNoteId}`,
          { ...note, content: cleanedContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedNote = response.data.note;
        const updatedNotes = notes.map((n) => (n._id === editingNoteId ? updatedNote : n));
        setNotes(updatedNotes);
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/notes",
          { ...note, content: cleanedContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotes([response.data.note, ...notes]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please check your connection and permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editNote = (note) => {
    setEditingNoteId(note._id);
    setNote({
      title: note.title,
      subject: note.subject,
      content: note.content,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (id) => {
    setShowConfirmDelete(id);
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
      setShowConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Please check your permissions.");
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  // Format the date 
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate text with HTML tags removed
  const truncateText = (html, maxLength = 100) => {
    // Remove HTML tags
    const text = html.replace(/<[^>]*>?/gm, '');
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Note Manager</h2>

      {/* Note Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {editingNoteId ? "Edit Note" : "Create New Note"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Title"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Subject"
            value={note.subject}
            onChange={(e) => setNote({ ...note, subject: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <Editor
          apiKey="qks55it6scopg5ibx5k982jzxunxu1x79rdlzkmx2yapv5bb"
          value={note.content}
          onEditorChange={(content) => setNote({ ...note, content })}
          init={{
            height: 300,
            menubar: false,
            plugins: "lists link image table code",
            toolbar: "undo redo | formatselect | bold italic underline | bullist numlist | link | code",
            content_style: "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; }",
          }}
        />
        
        <div className="flex justify-between mt-6">
          <button
            onClick={resetForm}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={saveNote}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow transition duration-150 ease-in-out flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="inline-block animate-pulse">Processing...</span>
            ) : (
              <span>{editingNoteId ? "Update Note" : "Add Note"}</span>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block mb-2 text-sm font-medium text-gray-700">Search Notes</label>
            <input
              id="search"
              type="text"
              placeholder="Search by title or content"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:w-1/3">
            <label htmlFor="subject-filter" className="block mb-2 text-sm font-medium text-gray-700">Filter by Subject</label>
            <select
              id="subject-filter"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.slice(1).map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold p-6 border-b text-gray-800">
          {selectedSubject ? `${selectedSubject} Notes` : "All Notes"}
          <span className="text-gray-500 text-base ml-2">({filteredNotes.length})</span>
        </h3>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            {notes.length === 0 ? "No notes found. Create your first note!" : "No notes match your search criteria."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Subject</th>
                  <th className="hidden md:table-cell px-6 py-3 text-sm font-semibold text-gray-600">Preview</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredNotes.map((note) => (
                  <tr key={note._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-medium">{note.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {note.subject}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-gray-600 max-w-xs">
                      {truncateText(note.content)}
                    </td>
                    <td className="px-6 py-4">
                      {showConfirmDelete === note._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => deleteNote(note._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md shadow"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editNote(note)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(note._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteManager;