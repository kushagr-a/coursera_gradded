const express = require('express');
const app = express();
const bookRoutes = require('./routes/books');

app.use(express.json()); // Required for POST/PUT

app.use('/books', bookRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
