const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const products = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    category: 'electronics',
    price: 79.99,
    inStock: true,
    image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: 2,
    name: 'Smartphone Case',
    category: 'accessories',
    price: 24.99,
    inStock: true,
    image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    description: 'Durable protective case for your smartphone'
  },
  {
    id: 3,
    name: 'Coffee Maker',
    category: 'home',
    price: 149.99,
    inStock: false,
    image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    description: 'Automatic drip coffee maker with programmable timer'
  },
  {
    id: 4,
    name: 'Running Shoes',
    category: 'clothing',
    price: 89.99,
    inStock: true,
    image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    description: 'Comfortable running shoes with advanced cushioning'
  },
  {
    id: 5,
    name: 'Laptop Stand',
    category: 'electronics',
    price: 45.99,
    inStock: true,
    image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    description: 'Adjustable aluminum laptop stand for better ergonomics'
  },
  {
    id: 6,
    name: 'Wireless Mouse',
    category: 'electronics',
    price: 29.99,
    inStock: false,
    image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    description: 'Ergonomic wireless mouse with precision tracking'
  },
  {
    id: 7,
    name: 'Water Bottle',
    category: 'accessories',
    price: 19.99,
    inStock: true,
    image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    description: 'Insulated stainless steel water bottle keeps drinks cold'
  },
  {
    id: 8,
    name: 'Desk Lamp',
    category: 'home',
    price: 59.99,
    inStock: true,
    image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    description: 'LED desk lamp with adjustable brightness and color temperature'
  }
];
  


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

