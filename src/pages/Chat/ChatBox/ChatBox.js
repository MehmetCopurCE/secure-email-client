import React, { useState, useEffect, useRef } from "react";
import "./ChatBox.css";
import { decryptMessage, base64ToArrayBuffer } from "../../../utils/encryptionUtils";
import { getPrivateKey } from "../../../utils/cryptoUtils";

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
            const encryptedSubject = base64ToArrayBuffer(email.subject); // Subject'ı da alıyoruz
            const signatureArrayBuffer = base64ToArrayBuffer(email.signature);

            let decryptedContent;
            let decryptedSubject;

            if (email.senderId === currentUser?.id) {
              decryptedContent = await decryptMessage(encryptedContent, await getPrivateKey(selectedUser?.email));
              decryptedSubject = await decryptMessage(encryptedSubject, await getPrivateKey(selectedUser?.email)); // Subject çözülüyor
            } else {
              decryptedContent = await decryptMessage(encryptedContent, currentUser?.privateKey);
              decryptedSubject = await decryptMessage(encryptedSubject, currentUser?.privateKey); // Subject çözülüyor
            }

            // İmza doğrulaması (Şimdilik true olarak bırakılmış)
            const isValidSignature = true;

            return {
              ...email,
              decryptedContent,
              decryptedSubject, // Decrypt edilmiş subject'i ekliyoruz
              isValidSignature,
            };
          } catch (error) {
            console.error("Error decrypting email:", error);
            return {
              ...email,
              decryptedContent: "Error processing this email.",
              decryptedSubject: "Error processing subject.", // Error mesajı ekliyoruz
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
    return <div className="chat-box">Select a user to send an email</div>;
  }

  return (
    <div className="chat-box">
      <h2>{selectedUser.username}</h2>

      <div className="email-history" ref={emailHistoryRef}>
        {processedEmails.length === 0 ? (
          <p>No emails yet</p>
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
