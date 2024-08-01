const Product = require('../models/Product');

exports.getOnlineShop = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('Oishi Great - OnlineShop', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Server Error');
    }
};