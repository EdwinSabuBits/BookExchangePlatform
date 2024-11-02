import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './BookDetail.css';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();
  const { userId } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [bookLocation, setBookLocation] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [condition, setCondition] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if not authenticated
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setBook(data);
          setTitle(data.title);
          setAuthor(data.author);
          setGenre(data.genre);
          setBookLocation(data.location);
          setAvailabilityStatus(data.availabilityStatus ? 'Available' : 'Not Available');
          setCondition(data.condition);
        } else {
          alert(`Failed to fetch book details: ${data.message}`);
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        alert('An error occurred. Please try again.');
        navigate('/');
      }
    };
    fetchBookDetails();
  }, [id, navigate]);

  const handleEditClick = () => {
    navigate(`/update-book/${id}`, { state: loc.state }); 
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Do you want to delete ${book.title}?`)) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          alert('Book deleted successfully.');
          navigate('/profile'); // Adjust the navigation as needed
        } else {
          const data = await response.json();
          alert(`Failed to delete book: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleBackClick = () => {
    const from = loc.state?.from === 'profile' ? '/profile' : '/search-books';
    navigate(from);
  };

  return (
    <div className="book-detail-container">
      {book ? (
        <>
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Location:</strong> {bookLocation}</p>
          <p><strong>Status:</strong> {book.availabilityStatus ? 'Available' : 'Not Available'}</p>
          <p><strong>Condition:</strong> {book.condition}</p>
          {book.user === userId && (
            <>
              <button onClick={handleEditClick} className="edit-button">Edit</button>
              <button onClick={handleDeleteClick} className="delete-button">Delete</button>
            </>
          )}
          <button onClick={handleBackClick}>Back</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BookDetail;
