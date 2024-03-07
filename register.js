const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
// var stripe = Stripe('pk_test_1234567890abcdef1234567890abcdef');




const app = express();
const PORT = 3000;

// Creating MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  database: 'office_task'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('MySQL Connected');
});

app.use(bodyParser.json());



// health care api
const jwt = require('jsonwebtoken');


// register api:- username , password, confirm password, email  //done
app.post('/user/register', (req, res) => {
    const { username, password, confirm_password ,email } = req.body;
    if (!username || !password || !confirm_password || !email) {
      return res.status(400).json({ error: 'Please provide username, password, confirm_password ,email' });
    }
  
     // Check if password and confirm_password match
     if (password !== confirm_password) {
        return res.status(400).json({ error: 'Password and confirm password do not match' });
    }
    // Inserting user data into the 'users' table
    const sql = 'INSERT INTO user_register (username, password, confirm_password ,email ) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, password, confirm_password ,email ], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'An error occurred while registering user' });
      }
    //   console.log('User registered successfully');
    //   return res.status(200).json({ message: 'User registered successfully' });
    const token = jwt.sign({ username, email }, 'secret');
    console.log('User registered successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'User registered successfully', token });
    });
});



// then login api:- password and email   // done
app.post('/user/login', (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM user_register WHERE email=?';
  
    db.query(query, [email], (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else if (result.length === 0) {
        res.status(401).json({ status: 401, message: 'Invalid email or password' });
      } else {
        const user = result[0];
  
        if (password === user.password) {
          res.status(200).json({ status: 200,  success: "true",message: 'Login successful' });
        } else {
          res.status(401).json({ status: 401, message: 'Invalid email or password' });
        }
      }
    });
  });


// forgate password
app.post('/send-otp-email', async (req, res) => {
    const { email } = req.body;

    // Validate the email address
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ramakantikurmi@gmail.com',
            pass: 'bqetmorheceezpkl' 
        }
    });

    try {
        // Generate an OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        const mailOptions = {
            from: 'your_gmail_address@gmail.com',
            to: email,
            subject: 'Your One-Time Password (OTP)',
            text: `Your OTP is: ${otp}`
        };

        // Send the email
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result);

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);

        return res.status(500).json({ success: false, message: 'An error occurred while sending the email' });
    }
});


    






  






















app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
