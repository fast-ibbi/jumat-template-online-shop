const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const multer = require('multer');

const fs = require('fs');

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public/uploads');
    // Ensure upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + fileExtension);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const Database = require('better-sqlite3');
// Initialize database connection
const db = new Database('database.db');
// Create products table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    inStock INTEGER NOT NULL,
    image TEXT,
    description TEXT
  )
`);

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('hbs', engine(
  {
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers: {
      eq: (a,b) => a === b
    }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

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

// render view index dengan data products
app.get("/", (req,res) => {
  res.render("index",{ products});
})

// render view product dengan data product sesuai id
app.get('/product/:id', (req,res) => {
  res.render('product',{ product: products[req.params.id - 1]});
})

app.get('/admin/products', (req,res) => {
  // Fetch all products from the database
  const tblproducts = db.prepare('SELECT * FROM products').all();

  res.render('admin/product/index',{ products: tblproducts });
});

app.post('/admin/products',upload.single('productImage'),  (req,res) => {
  // Extract product data from the request body
  const { name, category, price, inStock, description } = req.body;
  // Convert inStock to integer (1 for true, 0 for false)
  const inStockValue = inStock === true || inStock === 'true' ? 1 : 0;

  // Handle image - either uploaded file or URL from fallback field
  let imagePath;
  if (req.file) {
    // If file was uploaded, use the uploaded file path
    imagePath = '/uploads/' + req.file.filename;
  } else if (req.body.imageUrl && req.body.imageUrl.trim() !== '') {
    // If no file uploaded but URL provided, use the URL
    imagePath = req.body.imageUrl.trim();
  } else {
    // Default placeholder image
    imagePath = 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg';
  }

  // Insert new product into the database
  db.prepare(`INSERT INTO products 
      (name, category, price, inStock, description, image)
      VALUES (?, ?, ?, ?, ?, ?)`)
      .run(name, category, price, inStockValue, description, imagePath);
  // Redirect to the products admin page
  res.redirect('/admin/products');
});

app.get('/admin/products/new', (req,res) => {
  res.render('admin/product/add');
});

app.get('/admin/products/:id/edit', (req,res) => {
  res.render('admin/product/edit',{
    product: products[req.params.id - 1]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

