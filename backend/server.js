const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');

const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

// b0euMNEf2qcxMS6T