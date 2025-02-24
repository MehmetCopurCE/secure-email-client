import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "./UserList/UserList";
import ChatBox from "./ChatBox/ChatBox";
import "./ChatPage.css";
import { encryptMessage, signMessage, arrayBufferToBase64 } from "../../utils/encryptionUtils";


const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailHistory, setEmailHistory] = useState({});

  // Getting current user ID from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser ? currentUser.id : null;

  useEffect(() => {
    if (currentUserId) {
      // Fetch the user list only if currentUserId is available
      axios.get(`http://localhost:80/api/users?currentUserId=${currentUserId}`)
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    }
  }, [currentUserId]);

  useEffect(() => {
    // Seçilen kullanıcı değiştiğinde, o kullanıcı ile ilgili e-posta geçmişini çekiyoruz
    if (selectedUser && currentUserId) {
      axios.get(`http://localhost:80/api/emails/conversation`, {
        params: {
          senderId: currentUserId,
          receiverId: selectedUser.id,
        }
      })
        .then(response => {
          if (response.data.status === "success") {
            const emails = response.data.data;
            setEmailHistory((prevState) => ({
              ...prevState,
              [selectedUser.id]: emails,
            }));
          } else {
            console.error('Email history retrieval failed: ', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error fetching email history:', error);
        });
    }
  }, [selectedUser, currentUserId]);

  
  const handleSendEmail = async (user, content) => {
    if (!currentUser || !user) {
      console.error("Kullanıcı bilgileri eksik!");
      return;
    }
  
    // Mesajın şifrelenmesi
    const encryptedMessage = await encryptMessage(content.content, user.publicKey);
    const encryptedSubject = await encryptMessage(content.subject, user.publicKey);
    // Mesajın imzalanması
    const signature = await signMessage(content.content, currentUser.privateKey);
  
    // ArrayBuffer verilerini Base64 formatına dönüştürme
    const encryptedMessageBase64 = arrayBufferToBase64(encryptedMessage);
    const encryptedSubjectBase64 = arrayBufferToBase64(encryptedSubject);
    const signatureBase64 = arrayBufferToBase64(signature);
  
    // E-posta verisini oluşturuyoruz
    const emailData = {
      senderId: currentUserId,
      receiverId: user.id,
      subject: encryptedSubjectBase64,  // Şifreli konu Base64 olarak gönderiliyor
      content: encryptedMessageBase64,  // Şifreli mesaj Base64 olarak gönderiliyor
      signature: signatureBase64,       // İmza Base64 olarak gönderiliyor
    };
    
    // E-postayı API'ye gönderme
    axios
      .post("http://localhost:80/api/emails/send", emailData)
      .then((response) => {
        if (response.data.status === "success" && response.data.data) {
          const newEmail = response.data.data;
          // Yeni e-postayı UI'ye ekliyoruz
          setEmailHistory((prevState) => ({
            ...prevState,
            [user.id]: [...(prevState[user.id] || []), newEmail],
          }));
        } else {
          console.error("E-posta gönderimi başarısız:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("E-posta gönderilirken hata oluştu:", error);
      });
  };
  

return (
  <div className="chat-container">
    <div className="chat-overlay"></div> {/* Gölgelendirme katmanı */}
    <div className="chat-content">
      <UserList
        users={users}
        onUserSelect={setSelectedUser}
        selectedUser={selectedUser}
      />
      <ChatBox
        selectedUser={selectedUser}
        emailHistory={selectedUser ? emailHistory[selectedUser.id] || [] : []}
        onSendEmail={handleSendEmail}
      />
    </div>
  </div>
);

};

export default ChatPage;
