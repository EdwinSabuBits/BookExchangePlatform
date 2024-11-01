import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookDetail.css';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="book-detail-container">
      {book ? (
        <>
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Location:</strong> {book.location}</p>
          <p><strong>Status:</strong> {book.availabilityStatus ? 'Available' : 'Not Available'}</p>
          <p><strong>Condition:</strong> {book.condition}</p>
          <button onClick={() => navigate(-1)}>Back</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BookDetail;
