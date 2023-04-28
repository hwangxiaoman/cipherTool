const mysql = require('mysql2');
const validator = require('validator');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'coffee_shop'
});

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



exports.getRegisterPage = (req, res) => {
    res.render('register', { message: null });
  };

exports.registerUser = (req, res) => {
  const { userType, email, username, password, mobileNumber, country } = req.body;

  // Sanitize email and password inputs
  const sanitizedEmail = validator.normalizeEmail(email);
  const sanitizedPassword = validator.trim(password);

  // Validate email and password inputs
  const isValidEmail = validator.isEmail(sanitizedEmail);
  const isValidPassword = validator.isLength(sanitizedPassword, { min: 8 });

  if (!isValidEmail || !isValidPassword) {
    res.render('register', { message: 'Invalid email or password' });
  }
  else{
    var encrypt_password = encrypt(password, 5);

    // Insert user into MySQL database
    const query = `INSERT INTO user_info (userType, email, username, password, mobileNumber, country) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(query, [userType, email, username, encrypt_password, mobileNumber, country], (err, result) => {
      if (err) {
        console.error(err);
        res.render('register', { message: 'Error registering user' });
      } 
      else {
        res.render('login', { message: 'User registered successfully' });
      }
  });
  }
};