

import React, { useState ,useEffect} from 'react';
import axios from '../utils/api';
import "./item.css"
function Item({ item, updatePrice }) {
  const [demand, setDemand] = useState(item.demand);
  const [stock, setStock] = useState(item.stock);
  const [price, setPrice] = useState(item.price); // Track price to update after API response
  const [imageSrc, setImageSrc] = useState('');

  const handleUpdate = async () => {
    try {
      // First, get the updated price based on demand and stock
      const response = await axios.post('/predict', { demand, stock });
      const updatedPrice = response.data.predicted_price;
      setPrice(updatedPrice);

      // Next, update the item in the database with new demand, stock, and price
      await axios.put(`/items/${item.id}`, {
        demand,
        stock,
        price: updatedPrice
      });

      // Update price in the parent component
      updatePrice(item.id, demand, stock, updatedPrice);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/images/${item.image}`, {
          responseType: 'blob',
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result); // Set imageSrc to base64 string
        };
        reader.readAsDataURL(response.data);

        if (!item.image) {
   // If no image is provided, fall back to a base64 string
   const placeholderBase64 = `data:image/png;base64,${item.image}`; // Correct syntax using template literals
   setImageSrc(placeholderBase64);      
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        // If fetching fails, use a placeholder base64 image
        const placeholderBase64 = 'data:image/png;base64,{imageSrc}'; // Replace with your base64 string
      }
    };

    fetchImage();
  }, [item.image]);

  return (
    <div className="item">
      <h2>{item.name}</h2>
      <img src={imageSrc} alt={item.name} />
      <p>Price: ${price !== undefined ? price.toFixed(2) : 'N/A'}</p>

      <h3>Demand:</h3>
      <input
        type="number"
        value={demand}
        onChange={(e) => setDemand(Number(e.target.value))}
        placeholder="Demand"
      />

      <h3>Stock:</h3>
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
        placeholder="Stock"
      />
<br/>
<br/>

      <button onClick={handleUpdate}>Update Price</button>
    </div>
  );
}

export default Item;
