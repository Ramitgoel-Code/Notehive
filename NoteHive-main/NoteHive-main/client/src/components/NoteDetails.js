import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const NoteDetails = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const foundNote = storedNotes.find(n => n.id === parseInt(noteId));

    if (foundNote) {
      setNote(foundNote);
    }
  }, [noteId]);

  if (!note) {
    return <div>Note not found.</div>;
  }

  return (
    <div className="note-details-container">
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </div>
  );
};

export default NoteDetails;
