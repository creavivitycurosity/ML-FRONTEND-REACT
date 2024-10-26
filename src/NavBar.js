
import React, { useState } from 'react';
import "./NavBar.css";

const NavBar = () => {
  const [query, setQuery] = useState('');           
  const [suggestions, setSuggestions] = useState({ ml_based: {} });

  // Fetch ML-based suggestions based on user input
  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setQuery(userInput);

    if (userInput.length > 0) {
        fetch(`http://localhost:5000/suggest?query=${userInput}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setSuggestions({ ml_based: data.ml_based });
                console.log(data);
            })
            .catch((error) => console.error('Error fetching suggestions:', error));
    } else {
        setSuggestions({ ml_based: {} });
    }
};

  // Determine if there are any suggestions to display
  const hasSuggestions = suggestions.ml_based.name_matches?.length > 0 || suggestions.ml_based.tag_matches?.length > 0;

  return (
    <div className="navbar">
      <h1  className="navbar-title">Restaurant Search</h1>
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact Us</a>
      </nav>
      <input
        type="text"
        placeholder="Search menu items..."
        value={query}
        onChange={handleInputChange}
        className="search-input"
      />

      <div className={`suggestions ${hasSuggestions ? 'active' : ''}`}>
        <h2>ML-Based Suggestions</h2>
        <h3>By Name</h3>
        {suggestions.ml_based.name_matches && suggestions.ml_based.name_matches.length > 0 ? (
          suggestions.ml_based.name_matches.map((item, index) => (
            <div key={index} className="suggestion-item">
              <strong>{item.name}</strong> - Price: {item.price}
            </div>
          ))
        ) : (
          <p>No ML-based name matches</p>
        )}

        <h3>By Tags</h3>
        {suggestions.ml_based.tag_matches && suggestions.ml_based.tag_matches.length > 0 ? (
          suggestions.ml_based.tag_matches.map((item, index) => (
            <div key={index} className="suggestion-item">
              <strong>{item.name}</strong> - Price: {item.price}
            </div>
          ))
        ) : (
          <p>No ML-based tag matches</p>
        )}
      </div>
    </div>
  );
};

export default NavBar;