// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { axiosInstance } from '../axios';

// const NoteList = () => {
//   const { categoryId } = useParams();
//   const [notes, setNotes] = useState([]);

//   useEffect(() => {
//     const fetchNotes = async () => {
//       try {
//         const response = await axiosInstance.get(`/notes/${categoryId}/notes`);
//         console.log("Fetched API Data:", response.data);
//         setNotes(response.data);
//       } catch (error) {
//         console.error('Error fetching notes:', error);
//       }
//     };
//     fetchNotes();
//   }, [categoryId]);

//   // Function to decode HTML entities
//   const decodeHtml = (html) => {
//     const doc = new DOMParser().parseFromString(html, 'text/html');
//     return doc.documentElement.textContent || doc.documentElement.innerText;
//   };

//   return (
//     <div>
//       <h2>Notes</h2>
//       <ul>
//         {notes.map((note) => {
//           const decodedContent = decodeHtml(note.content); // Decode HTML content
//           console.log("Rendering decoded note content:", decodedContent); // Debugging log
//           return (
//             <li key={note._id}>
//               <h3>{note.title}</h3>
//               <div style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: decodedContent }} />
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default NoteList;
