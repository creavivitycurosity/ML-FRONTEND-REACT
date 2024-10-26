import React, { useState, useEffect } from 'react';
import axios from './utils/api';
import Item from './components/Item';
import AddItemButton from './components/AddItemButton';
import NavBar from './NavBar';
import './App.css'; // Import your CSS file for styles

function App() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    axios.get('/items')
      .then(response => {
        console.log("Fetched items:", response.data);
        setItems(response.data);
      })
      .catch(error => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const updatePrice = (id, demand, stock, newPrice) => {
    setItems(items.map(item => item.id === id ? { ...item, demand, stock, price: newPrice } : item));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  return (
    <div>
      <NavBar />
      <h1 style={{ margin: "20px 470px" }}>Inventory Price Calculator</h1>
      <AddItemButton addItem={addItem} />
      <div className="item-grid">
        {currentItems.map(item => (
          <Item key={item.id} item={item} updatePrice={updatePrice} />
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
