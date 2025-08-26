import { useState, useEffect } from "react";
import { fetchFollowing } from "../../api/authenticationsApi";

function Following({ userId }) {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const getFollowing = async () => {
      setLoading(true);
      setMessage("");
      setIsSuccess(false);
      try {
        const data = await fetchFollowing(userId);
        setFollowing(data);
        setIsSuccess(true);
      } catch (err) {
        setMessage(err.message);
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (userId) getFollowing();
  }, [userId]);

  return (
    <div className="flex flex-col items-center text-center p-4">
      <h3>Following</h3>

      {loading && <p>Loading following...</p>}

      {message && !isSuccess && (
        <div className="text-red-600 border border-red-400 p-2 rounded">
          {message}
        </div>
      )}

      {!loading && isSuccess && following.length === 0 && (
        <p>Not following anyone yet.</p>
      )}

      <ul>
        {following.map((f) => (
          <li key={f._id} className="flex items-center gap-2 mb-2">
            <img
              src={f.profilePicture || "/default-profile.png"}
              alt={f.name}
              className="w-8 h-8 rounded-full"
            />
            <span>{f.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Following;
