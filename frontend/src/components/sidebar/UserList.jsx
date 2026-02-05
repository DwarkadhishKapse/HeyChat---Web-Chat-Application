import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";

const UserList = ({ onSelectUser, isOpen }) => {
  const { user, authReady } = useAuth();
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !user?._id) return;

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const data = await getUsers();
        setUsers(data.filter((u) => u._id !== user._id && !u.isAI));
      } catch (error) {
        console.error("Failed to load users");
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, user]);

  return (
    <div className="border-t border-gray-800">
      {usersLoading && (
        <p className="p-3 text-sm text-gray-500">Loading users...</p>
      )}

      {!usersLoading &&
        users.map((u) => (
          <div
            key={u._id}
            onClick={() => onSelectUser(u)}
            className="p-3 cursor-pointer hover:bg-[#141414]"
          >
            {u.name}
          </div>
        ))}

      {!usersLoading && users.length === 0 && (
        <p className="p-3 text-sm text-gray-500">No users found</p>
      )}
    </div>
  );
};

export default UserList;
