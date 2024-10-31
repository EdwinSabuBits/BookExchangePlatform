import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBooks.css';

function SearchBooks() {
  const [books, setBooks] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [genre, setGenre] = useState('');
  const [location, setLocation] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/books?pageNumber=${pageNumber}&keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBooks(data.books);
        setTotalPages(data.pages);

        // Extract genres and locations from books
        const fetchedGenres = Array.from(new Set(data.books.map(book => book.genre))).filter(genre => genre);
        setGenres(fetchedGenres);

        const fetchedLocations = Array.from(new Set(data.books.map(book => book.location))).filter(location => location);
        setLocations(fetchedLocations);

        setFilteredBooks(data.books);
      } else {
        alert(`Failed to fetch books: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [pageNumber]);

  const handleApplyFilters = () => {
    let updatedBooks = books;

    if (keyword) {
      updatedBooks = updatedBooks.filter(book => book.title.toLowerCase().includes(keyword.toLowerCase()) || book.author.toLowerCase().includes(keyword.toLowerCase()));
    }

    if (availabilityStatus) {
      updatedBooks = updatedBooks.filter(book => String(book.availabilityStatus) === availabilityStatus);
    }

    if (genre) {
      updatedBooks = updatedBooks.filter(book => book.genre === genre);
    }

    if (location) {
      updatedBooks = updatedBooks.filter(book => book.location === location);
    }

    setFilteredBooks(updatedBooks);
  };

  const handleReset = () => {
    setKeyword('');
    setAvailabilityStatus('');
    setGenre('');
    setLocation('');
    setPageNumber(1);
    setFilteredBooks(books); // Reset filters and show all books
  };

  useEffect(() => {
    handleApplyFilters();
  }, [keyword, availabilityStatus, genre, location]);

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div className="search-books-container">
      <h2>Search Books</h2>
      <form className="search-form">
        <label>
          Search
          <input
            type="text"
            placeholder="Search by keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-field"
          />
        </label>
        <label>
          Availability
          <select value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)} className="dropdown">
            <option value="">All</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </label>
        <label>
          Genre
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="dropdown">
            <option value="">All</option>
            {genres.map((g, index) => (
              <option key={index} value={g}>{g}</option>
            ))}
          </select>
        </label>
        <label>
          Location
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="dropdown">
            <option value="">All</option>
            {locations.map((l, index) => (
              <option key={index} value={l}>{l}</option>
            ))}
          </select>
        </label>
        <button type="button" className="reset-button" onClick={handleReset}>Reset</button>
      </form>
      <div className="books-list">
        {filteredBooks.map((book) => (
          <div key={book._id} className="book-item">
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.availabilityStatus ? 'Available' : 'Not Available'}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={pageNumber === 1}>Prev</button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPageNumber(index + 1)}
            disabled={pageNumber === index + 1}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={goToNextPage} disabled={pageNumber === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default SearchBooks;
