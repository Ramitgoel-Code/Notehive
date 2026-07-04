import React, { useState } from "react";
import "../css/FAQ.css"; // Import styling

const FAQ = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-container">
      {/* Floating Button */}
      <button className="faq-button" onClick={toggleFAQ}>
        ❓
      </button>

      {/* FAQ Popup */}
      {isOpen && (
        <div className="faq-popup">
          <div className="faq-header">
            <h3>Frequently Asked Questions</h3>
            <button className="close-btn" onClick={toggleFAQ}>✖</button>
          </div>
          <div className="faq-body">
            <p><strong>1. What is NoteHive?</strong><br /> NoteHive is a productivity app designed to help you manage notes and user information efficiently through an intuitive dashboard.</p>
            <p><strong>2. Can I access my notes on multiple devices?</strong><br /> Yes! NoteHive is fully responsive and works seamlessly across laptops, smartphones, and other devices.</p>
            <p><strong>3. What features does the NoteHive dashboard offer?</strong><br /> The dashboard is your central hub for managing notes, accessing trivia and quizzes, and updating user information like profile settings.</p>
            <p><strong>4. Does NoteHive support interactive content?</strong><br /> Yes! You can explore interactive features like Trivia & Quizzes directly from the dashboard.</p>
            <p><strong>5. Can I customize my NoteHive experience?</strong><br /> Absolutely! You can adjust your preferences through the Settings option in the navigation bar.</p>
            <p><strong>6. How do I create and organize notes in NoteHive?</strong><br /> You can create notes via the Notes section and organize them into categories or tags for easy access.</p>
            <p><strong>7. Is there a way to share my notes with others?</strong><br /> Yes! NoteHive allows you to share notes with others through email or direct links, depending on your privacy settings.</p>
            <p><strong>8. What is the purpose of the Trivia & Quizzes section?</strong><br /> The Trivia & Quizzes section offers fun and educational content to take a break from note-taking while keeping your mind engaged.</p>
            <p><strong>9. How secure is my data on NoteHive?</strong><br /> NoteHive uses encryption to protect your notes and user information, ensuring your data remains private and secure.</p>
            <p><strong>10. Can I log out from the dashboard easily?</strong><br /> Yes! You can log out at any time using the Logout option in the navigation bar.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;