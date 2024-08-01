const mongoose = require('mongoose');
const Product = require('../models/Product');
const products = require('./products.json');

mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const loadProducts = async () => {
    try {
        await Product.deleteMany(); 
        await Product.insertMany(products); // Load products from JSON
        console.log('Products have been successfully loaded into the database');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error loading products:', error);
        mongoose.connection.close();
    }
};

loadProducts();
