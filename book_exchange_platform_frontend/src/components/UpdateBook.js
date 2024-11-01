import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './UpdateBook.css';

function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
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
        navigate('/');
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
        alert('Book details updated successfully.');
        navigate(`/books/${id}`, { state: location.state }); // Maintain state when navigating back
      } else {
        alert(`Failed to update book details: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating book details:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleBackClick = () => {
    const from = location.state?.from === 'profile' ? '/profile' : '/search-books';
    navigate(from);
  };

  return (
    <div className="update-book-container">
      <h2>Update Book</h2>
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
          <input type="text" value={bookLocation} onChange={(e) => setBookLocation(e.target.value)} />
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
        <div className="form-buttons">
          <button type="submit" className="button_update">Save</button>
          <button type="button" className="cancel_button" onClick={handleBackClick}>Back</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateBook;
