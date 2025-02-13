import React, { useState, useEffect, useRef } from "react";
import "./ChatBox.css";

const ChatBox = ({ selectedUser, emailHistory, onSendEmail }) => {
  const [newEmailSubject, setNewEmailSubject] = useState("");
  const [newEmailContent, setNewEmailContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const emailHistoryRef = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(currentUser);
  }, []);

  useEffect(() => {
    if (emailHistoryRef.current) {
      emailHistoryRef.current.scrollTop = emailHistoryRef.current.scrollHeight;
    }
  }, [emailHistory]);

  const handleEmailSend = () => {
    if (newEmailSubject.trim() && newEmailContent.trim()) {
      onSendEmail(selectedUser, {
        subject: newEmailSubject,
        content: newEmailContent,
      });

      setNewEmailSubject("");
      setNewEmailContent("");
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  if (!selectedUser) {
    return <div className="chat-box">Select a user to send an email</div>;
  }

  // `emailHistory` null veya undefined gelirse, boş dizi olarak kullan
  const safeEmailHistory = Array.isArray(emailHistory) ? emailHistory : [];

  return (
    <div className="chat-box">
      <h2>{selectedUser.username}</h2>

      <div className="email-history" ref={emailHistoryRef}>
        {safeEmailHistory.length === 0 ? (
          <p>No emails yet</p>
        ) : (
          safeEmailHistory.map((email, index) => {
            if (!email || !email.senderId) {
              return null; // Hatalı e-posta varsa gösterme
            }

            const isSentByUser = currentUser?.id && email.senderId === currentUser.id;

            return (
              <div key={index} className={`email ${isSentByUser ? "sent" : "received"}`}>
                {email.subject && (
                  <div className="email-subject">
                    <strong>Subject:</strong> {email.subject}
                  </div>
                )}
                <div className="email-content">
                  <p>{email.content}</p>
                </div>
                <div className="email-time">
                  <small>{formatDate(email.sentDate)}</small>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Yeni E-Posta Gönderme Bölümü */}
      <div className="new-email">
        <input
          type="text"
          value={newEmailSubject}
          onChange={(e) => setNewEmailSubject(e.target.value)}
          placeholder="Enter subject..."
          className="email-subject-input"
        />
        <textarea
          value={newEmailContent}
          onChange={(e) => setNewEmailContent(e.target.value)}
          placeholder="Write your email..."
          className="email-input"
        ></textarea>
        <button className="btn email" onClick={handleEmailSend}>
          Send Email
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
