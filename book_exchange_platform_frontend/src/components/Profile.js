import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from your backend here
    const fetchedUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      location: 'New York',
      books: ['Book 1', 'Book 2', 'Book 3']
    };
    setUser(fetchedUser);
  }, []);

  const handleDeleteProfile = () => {
    // Call backend to delete profile
    alert('Profile deleted');
    navigate('/');
  };

  const handleUpdateProfile = () => {
    // Navigate to update profile form or implement inline editing
    alert('Update profile form');
  };

  return (
    <div className="profile-container">
      {user ? (
        <>
          <h2>Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <h3>Books Listed</h3>
          <ul>
            {user.books.map((book, index) => (
              <li key={index}>{book}</li>
            ))}
          </ul>
          <div className="profile-actions">
            <button className="button_profile" onClick={handleUpdateProfile}>Update Profile</button>
            <button className="button_profile" onClick={handleDeleteProfile}>Delete Profile</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
