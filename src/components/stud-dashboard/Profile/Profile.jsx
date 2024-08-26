import React from "react";
import "./profile.css";

const Profile = () => {
  return (
    <div className="profile-section">
      <h2>Manage Your Profile</h2>
      <form>
        <label>
          Name:
          <input type="text" placeholder="Your Name" />
        </label>
        <label>
          Email:
          <input type="email" placeholder="Your Email" />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
