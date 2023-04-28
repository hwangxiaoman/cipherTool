const express = require('express');
const app = express();
const port = 3000;
const cipherRoutes = require('./routes/cipher');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/', cipherRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
