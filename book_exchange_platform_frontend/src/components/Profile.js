import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          alert(`Failed to fetch user data: ${data.message}`);
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred. Please try again.');
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDeleteProfile = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Profile deleted');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        const data = await response.json();
        alert(`Failed to delete profile: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('An error occurred. Please try again.');
    }
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
