const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    let lastTransactionId =await Order.findOne().sort({  transactionId: -1 });
    lastTransactionId=parseInt(lastTransactionId?.transactionId);
    if(isNaN(lastTransactionId)){
      lastTransactionId=0;
    }
    const order = new Order({
      userId: req.session.userId,
      transactionId:lastTransactionId+1,
      products: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      amount: cart.items.reduce((total, item) => total + item.productId.price * item.quantity, 0)
    });

    await order.save();
    await Cart.findByIdAndDelete(cart._id);
    return res.redirect('/orders');
  } catch (error) {
    res.status(500).json({ error: 'Error during checkout' });
  }
};

exports.viewOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.userId }).sort({transactionId:-1}).populate('products.productId');
    res.render('Oishi Great - Orders', { orders });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};
