import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
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
          fetchBooks(data._id, token);
        } else {
          alert(`Failed to fetch user data: ${data.message}`);
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };

    const fetchBooks = async (userId, token) => {
      try {
        const response = await fetch(`http://localhost:5000/api/books/user/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const booksData = await response.json();
        if (response.ok) {
          setBooks(booksData.books);
          setTotalPages(Math.ceil(booksData.books.length / itemsPerPage));
        } else {
          alert(`Failed to fetch books data: ${booksData.message}`);
        }
      } catch (error) {
        console.error('Error fetching books data:', error);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);

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
            {currentBooks.map((book, index) => (
              <li key={index}>
                <Link to={`/books/${book._id}`} state={{ from: 'profile' }} onClick={() => sessionStorage.setItem('backLink', 'profile')}>{book.title}</Link>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
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
