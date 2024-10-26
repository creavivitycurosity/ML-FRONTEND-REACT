

import React, { useState } from 'react';
import axios from '../utils/api';

function AddItemButton({ addItem }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleAdd = async () => {
    try {
      // Prepare form data for image upload and other fields
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', parseFloat(price)); // convert price to a number
      formData.append('image', image);
      formData.append('demand', 0); // default value
      formData.append('stock', 0);  // default value

      // Send POST request to add item
      const response = await axios.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Add the newly created item to the list
      const newItem = response.data;
      addItem(newItem);
      
      // Reset the form
      setName('');
      setPrice('');
      setImage(null);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="add-item">
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleAdd}>Add Item</button>
    </div>
  );
}

export default AddItemButton;
