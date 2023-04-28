const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'coffee_shop'
});


exports.getLogin = (req, res) => {
    res.render('login');
};

function encrypt(text, shift) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
  let char = text.charAt(i);
  // Check if character is a letter
  if (/[a-zA-Z]/.test(char)) {
  let code = text.charCodeAt(i);
  // Uppercase letters
  if (code >= 65 && code <= 90) {
  char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
  }
  // Lowercase letters
  else if (code >= 97 && code <= 122) {
  char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
  }
  }
  // Check if character is a number or special character
  else if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(char)) {
  let code = text.charCodeAt(i);
  char = String.fromCharCode((code + shift) % 128);
  }
  result += char;
  }
  return result;
}

exports.postLogin = (req, res) => {
  const { username, password } = req.body; 

  var encrypt_password = encrypt(password, 5);
  
  // Execute a query to retrieve the user from the database
  connection.query('SELECT * FROM user_info WHERE username = ? AND password = ?', [username, encrypt_password], (err, results) => {
    
    if (err) {
      console.error('Error executing query: ' + err.stack);
      return res.status(500).send('Error executing query');
    }

    if (results.length > 0) {
      res.render('home');
    } else {
      res.render('login', { errorMessage: 'Invalid username or password' });
    }
  });
};
  
