require('dotenv').config();

const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {console.log('Connected to MongoDB');})
  .catch(err => console.error('Could not connect to MongoDB', err));

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('isEqual', function (a, b) {
  return a === b;
});
hbs.registerHelper('multiply', function (price, quantity) {
  return price * quantity;
});

// app.engine('hbs', engine({
//   extname: '.hbs',
//   defaultLayout: false,
//   runtimeOptions: {
//       allowProtoPropertiesByDefault: true,   
//       allowProtoMethodsByDefault: true     
//   }
// }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set up session management with in-memory store
app.use(session({
  secret: 'your-secret-key', // Hardcoded secret for session
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));


app.use(express.static('public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Ensure cart is passed to views
// app.use((req, res, next) => {
//   const cart = req.session.cart || [];
//   res.locals.cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
//   next();
// });

// Ensure user session is passed to views
app.use((req, res, next) => {
  res.locals.loggedIn = req.session.userId;
  next();
});

// Load routes
const routes = require('./routes/routes');
app.use('/', routes);

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});