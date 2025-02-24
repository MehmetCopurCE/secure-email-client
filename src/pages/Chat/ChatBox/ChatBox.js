import React, { useState, useEffect, useRef } from "react";
import "./ChatBox.css";
import { decryptMessage, base64ToArrayBuffer, verifyMessageSignature } from "../../../utils/encryptionUtils";
import { getPrivateKey } from "../../../utils/cryptoUtils";
import defaultAvatar from "../../../assets/user.png";  // Dosyanın gerçek yoluna göre düzenle
import epostaImage from "../../../assets/eposta.png"; // Resmi import et



const ChatBox = ({ selectedUser, emailHistory, onSendEmail }) => {
  const [newEmailSubject, setNewEmailSubject] = useState("");
  const [newEmailContent, setNewEmailContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [processedEmails, setProcessedEmails] = useState([]); // İşlenmiş e-postaları sakla
  const emailHistoryRef = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(currentUser);
  }, []);

  useEffect(() => {
    if (emailHistoryRef.current) {
      emailHistoryRef.current.scrollTop = emailHistoryRef.current.scrollHeight;
    }
  }, [processedEmails]); // Ensure it scrolls to the bottom when processedEmails updates

  useEffect(() => {
    const processEmails = async () => {
      if (!emailHistory || !currentUser || !selectedUser) return;

      const updatedEmails = await Promise.all(
        emailHistory.map(async (email) => {
          if (!email || !email.senderId) return null;

          try {
            const encryptedContent = base64ToArrayBuffer(email.content);
            const encryptedSubject = base64ToArrayBuffer(email.subject);

            // Şifre çözme işlemi için privateKey'i belirleme
            const privateKey = email.senderId === currentUser?.id
              ? await getPrivateKey(selectedUser?.email)
              : currentUser?.privateKey;

            // Content ve Subject'in şifresini çözme
            const decryptedContent = await decryptMessage(encryptedContent, privateKey);
            const decryptedSubject = await decryptMessage(encryptedSubject, privateKey);

            // İmza doğrulama (şimdilik varsayılan olarak true)
            const publicKey = email.senderId === currentUser?.id ? currentUser?.publicKey : selectedUser?.publicKey;
            const isValidSignature = await verifyMessageSignature(decryptedContent, email.signature, publicKey);

            return {
              ...email,
              decryptedContent,
              decryptedSubject,
              isValidSignature,
            };
          } catch (error) {
            console.error("Error decrypting email:", error);
            return {
              ...email,
              decryptedContent: "Error processing this email.",
              decryptedSubject: "Error processing subject.",
              isValidSignature: false,
            };
          }
        })
      );

      setProcessedEmails(updatedEmails.filter(Boolean)); // Hatalı e-postaları filtrele
    };

    processEmails();
  }, [emailHistory, currentUser, selectedUser]);


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
  return (
    <div className="no-user-selected">
      <img src={epostaImage} alt="No emails yet" className="no-emails-image" />
      <p className="no-emails-message">Select a user to send an email</p>
    </div>
  );
}


  return (
    <div className="chat-box">
      <div className="chat-header">
        <img
          src={selectedUser.avatarUrl || defaultAvatar}
          alt={selectedUser.username}
          className="chat-avatar"
        />
        <div className="chat-user-info">
          <h2>{selectedUser.username}</h2>
          <p>{selectedUser.email}</p>
        </div>
      </div>


      <div className="email-history" ref={emailHistoryRef}>
        {processedEmails.length === 0 ? (
          <div className="no-emails-container">
            <img src={epostaImage} alt="No emails yet" className="no-emails-image" />
            <p className="no-emails">No emails yet</p>
          </div>
        ) : (
          processedEmails.map((email, index) => {
            if (!email || !email.senderId) {
              return null;
            }

            const isSentByUser = currentUser?.id && email.senderId === currentUser.id;

            return (
              <div key={index} className={`email ${isSentByUser ? "sent" : "received"}`}>
                {email.decryptedSubject && (
                  <div className="email-subject">
                    <strong>Subject:</strong> {email.decryptedSubject}
                  </div>
                )}
                <div className="email-content">
                  <p>{email.decryptedContent}</p>
                  {email.isValidSignature ? (
                    <small>Signature is valid.</small>
                  ) : (
                    <small>Signature verification failed.</small>
                  )}
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
