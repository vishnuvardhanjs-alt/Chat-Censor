const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
  res.json({a:"hello"});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
