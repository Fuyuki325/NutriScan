const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/UserRoutes');
const aiRoutes = require('./routes/AIRoute');


dotenv.config(); // load .env

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});



//Routes
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});


app.use('/api/users', userRoutes)

app.use('/scan', aiRoutes)

//bind to port
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});