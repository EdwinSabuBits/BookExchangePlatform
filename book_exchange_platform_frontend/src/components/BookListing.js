import React, { useState } from 'react';
import './BookListing.css';

function BookListing() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [condition, setCondition] = useState('');
  const [genre, setGenre] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author, location, availabilityStatus, condition, genre }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Book listed successfully');
        clearForm();
      } else {
        alert(`Failed to list book: ${data.message}`);
      }
    } catch (error) {
      console.error('Error listing book:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const clearForm = () => {
    setTitle('');
    setAuthor('');
    setLocation('');
    setAvailabilityStatus('');
    setCondition('');
    setGenre('');
  };

  return (
    <div className="book-listing-container">
      <h2>Book Listing</h2>
      <form onSubmit={handleSubmit} className="book-listing-form">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Author
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </label>
        <label>
          Genre
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </label>
        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <label>
          Availability Status
          <select
            value={availabilityStatus}
            onChange={(e) => setAvailabilityStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </label>
        <label>
          Condition
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          />
        </label>
        <div className="form-buttons">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" onClick={clearForm} className="clear-button">Clear All</button>
        </div>
      </form>
    </div>
  );
}

export default BookListing;
