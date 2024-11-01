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

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          author,
          genre,
          location: bookLocation,
          availabilityStatus: availabilityStatus === 'Available',
          condition,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setBook(data);
        setIsEditing(false);
        alert('Book details updated successfully.');
        navigate(`/books/${id}`, { state: loc.state });
      } else {
        alert(`Failed to update book details: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating book details:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleBackClick = () => {
    const from = loc.state?.from === 'profile' ? '/profile' : '/search-books';
    navigate(from);
  };

  return (
    <div className="book-detail-container">
      {book ? (
        isEditing ? (
          <form onSubmit={handleSave} className="edit-book-form">
            <label>
              Title
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label>
              Author
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </label>
            <label>
              Genre
              <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            </label>
            <label>
              Location
              <input type="text" value={bookLocation} onChange={(e) => setBookLocation(e.target.value)} required />
            </label>
            <label>
              Availability Status
              <select value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)} required>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </label>
            <label>
              Condition
              <input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} required />
            </label>
            <button type="submit" className="submit-button">Save</button>
          </form>
        ) : (
          <>
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Location:</strong> {bookLocation}</p>
            <p><strong>Status:</strong> {book.availabilityStatus ? 'Available' : 'Not Available'}</p>
            <p><strong>Condition:</strong> {book.condition}</p>
            {book.user === userId && (
              <button onClick={handleEditClick} className="edit-button">Edit</button>
            )}
            <button onClick={handleBackClick}>Back</button>
          </>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BookDetail;
