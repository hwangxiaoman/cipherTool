const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const cipherRoutes = require('./routes/cipher');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Serve static files from the styles directory
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Serve static files from the views directory
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/', cipherRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});