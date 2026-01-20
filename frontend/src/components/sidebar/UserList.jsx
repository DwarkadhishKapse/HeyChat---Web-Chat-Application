import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";

const UserList = ({ onSelectUser }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data.filter((u) => u._id !== user._id));
    };

    fetchUsers();
  }, []);

  return (
    <div className="border-t border-gray-800">
      <p className="p-3 text-sm text-gray-400">Start new chat</p>

      {users.map((u) => {
        <div
          key={u._id}
          onClick={() => onSelectUser(u)}
          className="p-3 cursor-pointer hover:bg-[#141414]"
        >
          {u.name}
        </div>;
      })}
    </div>
  );
};

export default UserList;
