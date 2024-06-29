const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // load .env

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());


//Routes
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});


app.use('/api/users', userRoutes)


//bind to port
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});