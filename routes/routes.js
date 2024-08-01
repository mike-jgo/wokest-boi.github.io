const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');
const loginController = require('../controllers/Login'); // New controller for login
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const productController = require('../controllers/productController');

router.use(async(req, res, next) => {
  if(req.session.userId) {
    const cartObj = await Cart.findOne({ userId: req.session.userId }).populate('items.productId') || { items: [] };
    const cartItemCount = cartObj.items.reduce((total, item) => total + item.quantity, 0);
    res.locals.cartItemCount=cartItemCount||0;
    res.locals.cart = cartObj.items;
    let totalCost = 0;
    cartObj.items.forEach(item => {
        totalCost += item.productId.price * item.quantity;
    });
    res.locals.totalCost = totalCost;
  }
  next();
});
router.get('/', (req, res) => {
  res.render('Oishi Great - Home', { loggedIn: req.session.userId});
});
router.get('/about', (req, res) => {
  res.render('Oishi Great - About');
});

router.get('/location', (req, res) => {
  res.render('Oishi Great - Location',);
});

router.get('/login', (req, res) => {
  res.render('Oishi Great - Login');
});

/*router.get('/onlineshop', (req, res) => {
  res.render('Oishi Great - OnlineShop', {currentPage: 'shop'});
});*/

router.get('/onlineshop', async (req, res) => {
  const products = await Product.find(); // Fetch products
  res.render('Oishi Great - OnlineShop', { products });
});


router.get('/signup', (req, res) => {
  res.render('Oishi Great - Signup');
});

router.get('/useraddress', (req, res) => {
  res.render('Oishi Great - UserAddress');
});

router.get('/myaccount', userController.getMyAccount); // fetch user data from the database to reflect changes immediately
router.get('/editaccountdetails', userController.getEditAccountDetails); // fetch the user data from the database to reflect changes immediately

router.post('/signup', userController.signup); 
router.post('/login', loginController.login);
router.post('/logout', loginController.logout); // Optional, if you want logout functionality
router.post('/editaccountdetails', userController.updateAccountDetails);

router.post('/add-to-cart', cartController.addToCart);
router.post('/update-cart', cartController.updateCartQuantity);
//router.get('/cart', cartController.viewCart);

router.get('/orders', orderController.viewOrders);
router.post('/checkout', orderController.checkout);

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.get('/payment', (req, res) => {
  res.render('Oishi Great - Payment');
});

//router.get('/onlineshop', productController.getOnlineShop);
// router.get('/onlineshop', async (req, res) => {
//   try {
//       const products = await Product.find(); 
//       const cart = await Cart.findOne({ userId: req.session.userId }).populate('items.productId') || { items: [] };
      
//       const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
//       const totalCost = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//       res.render('Oishi Great - OnlineShop', {
//           products,
//           cart: cart.items,
//           cartItemCount,
//           totalCost
//       });
//   } catch (error) {
//       console.error('Error rendering the shop:', error);
//       res.status(500).send('Server error');
//   }
// });

router.get('/:userId', cartController.getCart);
router.post('/checkout', cartController.checkout);


router.get('/products/:id', async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json(product);
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/checkout', async (req, res) => {
  const { userId, cartItems } = req.body;

  try {
      const order = new Order({ userId, items: cartItems });
      await order.save();

      await Cart.deleteOne({ userId });

      res.json({ success: true, message: 'Checkout successful' });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
