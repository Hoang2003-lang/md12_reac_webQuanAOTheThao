import React, { useState } from 'react';

const usersData = [
  { id: 1, name: 'Nguyễn Văn A', email: 'admin@gmail.com', role: 'admin' },
  { id: 2, name: 'Trần Thị B', email: 'user1@gmail.com', role: 'user' },
  { id: 3, name: 'Lê Văn C', email: 'user2@gmail.com', role: 'user' },
];

const User = () => {
  const [users, setUsers] = useState(usersData);
  const handleDelete = (id) => setUsers(users.filter(u => u.id !== id));
  return (
    <div>
      <h2>Quản lý người dùng</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th><th>Họ tên</th><th>Email</th><th>Role</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user.id)} className="btn-delete">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User; 