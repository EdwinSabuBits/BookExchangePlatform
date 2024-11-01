import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
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

          const booksResponse = await fetch(`http://localhost:5000/api/books/user/${data._id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const booksData = await booksResponse.json();

          if (booksResponse.ok) {
            if (Array.isArray(booksData.books)) {
              setBooks(booksData.books); 
            } else {
              console.error('Books data is not an array:', booksData.books);
            }
          } else {
            alert(`Failed to fetch books data: ${booksData.message}`);
          }
        } else {
          alert(`Failed to fetch user data: ${data.message}`);
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);


  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure you want to delete the profile? Deleting the profile will automatically delete the books listed by you!")) {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
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
    }
  };

  const handleUpdateProfile = () => {
    navigate('/update-profile');
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
            {books.map((book, index) => (
              <li key={index}>
                <Link to={`/books/${book._id}`}>{book.title}</Link>
              </li>
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
