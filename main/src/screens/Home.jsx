import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/userService";
import Search from "../components/locations/Search";

function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then((res) => setUsers(res.data));
  }, []);
  return (
    <div>
      <Search />
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
