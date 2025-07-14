        const Product = require("../models/Product");
const Category = require("../models/Category");
const { uploadImage, deleteImage } = require("../utils/imageUploader");
// working
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, tags } = req.body;
        const images = req.files?.image;
        if (!name || !description || !price || !stock || !category || !images || !tags) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        if (req.user.type !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Only admins can create products",
            });
        }
        const tagsArray = typeof tags === 'string' ? tags.split(",").map(t => t.trim()) : tags;
        const categoryName = category.trim(); // remove whitespace
        const categoryDetails = await Category.findOne({ name: new RegExp(`^${categoryName}$`, 'i') });
        if (!categoryDetails) {
            return res.status(400).json({
                success: false,
                message: "failed to find category"
            })
        }

        const productCheck = await Product.findOne({ name: name, description: description });
        if (productCheck) {
            return res.status(400).json({
                success: false,
                message: "Product already created",
            });
        }
        const folderName = process.env.FOLDER_NAME;
        const response = await uploadImage(images, folderName);
        if (!response.success) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed",
                error: response.error,
            });
        }
        const imageUrls = response.urls;
        // Create Products
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            images: imageUrls,
            category: categoryDetails._id,
            tags: tagsArray
        });
        await Category.findOneAndUpdate({ name: category }, { $push: { product: product._id } }, { new: true })

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product creation failed",
            error: error.message,
        });
    }
};
// working
exports.getAllProducts = async (req, res) => {
    try {
        const allProduct = await Product.find(
            {},
            {
                name: true,
                description: true,
                price: true,
                image: true,
                stock: true,
                category: true,
                tags: true,
                images: true,
            }).populate("category").exec();
        return res.status(200).json({
            success: true,
            message: "all products fetched",
            data: allProduct
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: `Cannot Fetch Course Data`,
            error: error.message,
        });
    }
};


exports.updateProduct = async (req, res) => {
  try {
    const { productId, name, price, description, stock, category, tags, existingImages } = req.body;
    const files = req.files?.image;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    console.log(files)
    const updateFields = {};
    if (name) updateFields.name = name;
    if (price) updateFields.price = price;
    if (description) updateFields.description = description;
    if (stock) updateFields.stock = stock;
    if (category) {
      const catDoc = await Category.findOne({ name: category });
      if (catDoc) updateFields.category = catDoc._id;
    }
    if (tags) {
      updateFields.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());
    }

    let finalImages = [];

    const existing = existingImages ? JSON.parse(existingImages) : [];

    // Delete removed images from Cloudinary
    const removed = product.images.filter((url) => !existing.includes(url));
    await Promise.all(removed.map((url) => deleteImage(url)));
    let newUrls = [];
    if (files) {
      const upload = await uploadImage(files, "products");
      if (upload.success) {
        newUrls = upload.urls;
      }
    }
    finalImages = [...existing, ...newUrls];
    updateFields.images = finalImages;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// // had to handel images means update and remove the previous ones
// exports.updateProduct = async (req, res) => {
//     try {
//         const { productId, name, price, description, stock, category, tags } = req.body;
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ success: false, message: "Product not found" });
//         }

//         // Build update object only with provided fields
//         const updateFields = {};
//         if (name) updateFields.name = name;
//         if (price) updateFields.price = price;
//         if (description) updateFields.description = description;
//         if (stock) updateFields.stock = stock;
//         if (category) {
//             const catDoc = await Category.findOne({ name: category });
//             if (catDoc) updateFields.category = catDoc._id;
//         }
//         if (tags) {
//             updateFields.tags = Array.isArray(tags) ? tags : tags.split(",").map((tag) => tag.trim());
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(
//             productId,
//             updateFields,
//             { new: true, runValidators: true }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Product updated successfully",
//             product: updatedProduct,
//         });

//     } catch (err) {
//         console.error("Update Product Error:", err);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

// working
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "please provide the id for deleting the product"
            })
        }
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (deletedProduct?.images?.length) {
            await Promise.all(
                deletedProduct.images.map((imageUrl) => deleteImage(imageUrl))
            );
        }
    
        if (!deletedProduct) {
            return res.status(404).json({ // Use 404 if product not found
                success: false,
                message: "Product not found or already deleted."
            });
        }

        return res.status(200).json({
            success: true,
            message: "The product is deleted",
            deletedProduct
        })

    } catch (error) {
        return res.status(550).json({
            success: false,
            message: "something went wrong to delete the product"
        })
    }
}