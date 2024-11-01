import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateProfile.css';

function UpdateProfile() {
  const [user, setUser] = useState({ name: '', email: '', location: '' });
  const [isLoading, setIsLoading] = useState(true);
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
          setIsLoading(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Profile updated successfully');
        navigate('/profile'); // Redirect to profile page
      } else {
        alert(`Failed to update profile: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Location
          <input
            type="text"
            name="location"
            value={user.location}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="button_update">Update Profile</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
