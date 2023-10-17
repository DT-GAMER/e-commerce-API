const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2; 

// Get a list of all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new product (admin only)
exports.createProduct = async (req, res) => {
  const { description, price, isInStock, categoryID } = req.body;
  const { file } = req;

  try {
    // Check if the category exists
    const category = await Category.findById(categoryID);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    // Upload the image to Cloudinary
    cloudinary.uploader.upload(file.path, async (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Image upload failed' });
      }

      // Create a new product with the image URL from Cloudinary
      const product = new Product({
        description,
        price,
        isInStock,
        category: categoryID,
        imageURL: result.secure_url, // Use the secure URL provided by Cloudinary
      });

      await product.save();
      res.status(201).json({ message: 'Product created successfully' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a product by ID (admin only)
exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { description, price, isInStock, categoryID } = req.body;
  const { file } = req;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the category exists
    const category = await Category.findById(categoryID);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    // Upload the image to Cloudinary
    cloudinary.uploader.upload(file.path, async (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Image upload failed' });
      }

      // Update the product with the new image URL from Cloudinary
      product.description = description;
      product.price = price;
      product.isInStock = isInStock;
      product.category = categoryID;
      product.imageURL = result.secure_url;

      await product.save();
      res.status(200).json({ message: 'Product updated successfully' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a product by ID (admin only)
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.remove();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

