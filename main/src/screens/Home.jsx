import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/userService";

function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then((res) => setUsers(res.data));
  }, []);
  return (
    <div>
      Home
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
