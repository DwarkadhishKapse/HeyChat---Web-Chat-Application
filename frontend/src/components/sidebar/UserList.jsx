import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";

const UserList = ({ onSelectUser }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        // remove current logged-in user
        setUsers(data.filter((u) => u._id !== user._id && !u.isAI));
      } catch (error) {
        console.error("Failed to load users");
      }
    };

    fetchUsers();
  }, [user?._id]);

  return (
    <div className="border-t border-gray-800">
      {!user?._id && (
        <p className="p-3 text-sm text-gray-500">Loading users...</p>
      )}
      {user?._id &&
        users.map((u) => (
          <div
            key={u._id}
            onClick={() => onSelectUser(u)}
            className="p-3 cursor-pointer hover:bg-[#141414]"
          >
            {u.name}
          </div>
        ))}

      {users.length === 0 && (
        <p className="p-3 text-sm text-gray-500">No users found</p>
      )}
    </div>
  );
};

export default UserList;
