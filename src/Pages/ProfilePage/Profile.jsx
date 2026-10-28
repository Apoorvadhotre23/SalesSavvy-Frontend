import { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound, Hash, Mail, ShieldCheck } from "lucide-react";


function Profile() {
    const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/users/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch profile");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
  
  <div className="profile-page">

    <div className="profile-container">

      <div className="profile-header">
        <button
          className="profile-back-icon"
          onClick={() => navigate("/home")}
          aria-label="Back to Home"
        >
          <ArrowLeft size={24} />
        </button>

        <h2>My Profile</h2>
      </div>

      <div className="profile-avatar">
        <UserRound size={45} />
      </div>

      <h2 className="profile-username">{user.username}</h2>
      <p className="profile-role">{user.role}</p>

      <div className="profile-details">

        <div className="profile-detail-row">
          <Hash size={22} />
          <div>
            <span>User ID</span>
            <p>{user.userId}</p>
          </div>
        </div>

        <div className="profile-detail-row">
          <UserRound size={22} />
          <div>
            <span>Username</span>
            <p>{user.username}</p>
          </div>
        </div>

        <div className="profile-detail-row">
          <Mail size={22} />
          <div>
            <span>Email</span>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-detail-row">
          <ShieldCheck size={22} />
          <div>
            <span>Role</span>
            <p>{user.role}</p>
          </div>
        </div>

      </div>

      <button
        type="button"
        className="back-home-btn"
        onClick={() => navigate("/home")}
      >
        Back to Home
      </button>

    </div>

  </div>
  );
}

export default Profile;