
const Category = require('../models/Category');

// working
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
         
        if (!name ) {
            return res.status(400).json({
                success: false,
                message: "please provide all the fields"
            })
        }
        const check = await Category.findOne({ name: name });
        if (check) {
            return res.status(500).json({
                success: false,
                message: "this category is already created"
            })
        }

        const category = await Category.create({ name: name});
        const response = await Category.find({}, { name: true });
        if (!category) {
            return res.status(500).json({
                success: false,
                message: "failed to create category"
            })
        }
        return res.status(200).json({
            success: true,
            message: "category is created",
            response
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to create category"
        })
    }
};
// working

exports.findCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "provide name"
            })
        }
        const categoryName = name.trim(); // remove whitespace
        const categoryDetails = await Category.findOne({ name: new RegExp(`^${categoryName}$`, 'i') }); // case insensitive
        if (!categoryDetails) {
            return res.status(400).json({
                success: false,
                message: "category not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "category is found",
            categoryDetails
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "failed to find category"
        })
    }
}
exports.deleteCategory = async (req, res) => {
    try {
        const { name} = req.body;

        if (!name ) {
            return res.status(400).json({
                success: false,
                message: "please provide all the fields"
            })
        }
        const check = await Category.findOne({ name: name });
        if (!check) {
            return res.status(500).json({
                success: false,
                message: "this category is not present"
            })
        }
        const deleted = await Category.findOneAndDelete({ name: name }, { new: true });
        const finalResponse = await Category.find({}, { name: true });
        if (!deleted) {
            return res.status(500).json({
                success: false,
                message: "failed to delete category"
            })
        }
        return res.status(200).json({
            success: true,
            message: "category is deleted",
            finalResponse,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " failed to delet category",
        })
    }
};
// working
exports.showAllCategory = async (req, res) => {
    try {
        const allCategories = await Category.find({}, { name: true });
        if (!allCategories) {
            return res.status(500).json({
                success: false,
                message: "could not fetch the all category"
            })
        }
        res.status(200).json({
            success: true,
            message: "All category returned successfully",
            data: allCategories,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const selectedCategory = await Category.findById(categoryId).populate("product").exec();

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Data Not Found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "category page detials fetched",
            selectedCategory,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to show category page details",
        });
    }
};