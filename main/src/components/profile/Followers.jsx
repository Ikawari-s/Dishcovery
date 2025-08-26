import { useState, useEffect } from "react";
import { fetchFollowers } from "../../api/authenticationsApi";
import { Link } from "react-router-dom";

function Followers({ userId }) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const getFollowers = async () => {
      setLoading(true);
      setMessage("");
      setIsSuccess(false);
      try {
        const data = await fetchFollowers(userId);
        setFollowers(data);
        setIsSuccess(true);
      } catch (err) {
        setMessage(err.message);
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (userId) getFollowers();
  }, [userId]);

  return (
    <div className="flex flex-col items-center text-center p-4">
      <h3>Followers</h3>

      {loading && <p>Loading followers...</p>}

      {message && !isSuccess && (
        <div className="text-red-600 border border-red-400 p-2 rounded">
          {message}
        </div>
      )}

      {!loading && isSuccess && followers.length === 0 && (
        <p>No followers yet.</p>
      )}

      <ul>
        {followers.map((f) => (
          <li key={f._id} className="flex items-center gap-2 mb-2">
            <img
              src={f.profilePicture || "/default-profile.png"}
              alt={f.name}
              className="w-8 h-8 rounded-full"
            />
            <Link to={`/profile/${f._id}`}>{f.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Followers;
