import React, { useState } from "react";
import "./UserList.css";

const UserList = ({ users, onUserSelect, selectedUser }) => {
  const [search, setSearch] = useState("");

  // Kullanıcıların 'username' özelliğine göre filtreleme
  const filteredUsers = users.filter((user) =>
    user.username && user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-list">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      <ul>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => onUserSelect(user)}
              className={selectedUser?.id === user.id ? "active" : ""}
            >
              {/* Kullanıcı adını buraya yazıyoruz */}
              {user.username} {/* Eğer 'name' yerine 'username' doğru özelliksizse, bu şekilde düzelttik */}
            </li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </div>
  );
};

export default UserList;
