const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/UserRoutes');
const aiRoutes = require('./routes/AIRoute');


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

app.use('/scan', aiRoutes)

//bind to port
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});