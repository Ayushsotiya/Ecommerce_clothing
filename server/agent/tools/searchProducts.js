/**
 * Search Products Tool
 * Searches for products by name, category, tags, or price range
 */

const Product = require('../../models/Product');
const Category = require('../../models/Category');

/**
 * Tool definition for LangChain
 */
const searchProductsTool = {
    name: "searchProducts",
    description: "Search for products by name, description, category, or tags. Use this when customers want to find or browse products. Returns a list of matching products with basic info like name, price, and availability.",
    schema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Search term to match against product name, description, or tags"
            },
            category: {
                type: "string",
                description: "Category name to filter by (e.g., 'Shirts', 'Pants', 'Dresses')"
            },
            minPrice: {
                type: "number",
                description: "Minimum price filter"
            },
            maxPrice: {
                type: "number",
                description: "Maximum price filter"
            },
            limit: {
                type: "number",
                description: "Maximum number of products to return (default: 5)"
            }
        },
        required: []
    }
};

/**
 * Execute the search products function
 * @param {Object} params - Search parameters
 * @returns {Promise<Object>}
 */
const executeSearchProducts = async (params) => {
    try {
        const { 
            query = '', 
            category = null, 
            minPrice = null, 
            maxPrice = null, 
            limit = 5 
        } = params;

        // Build MongoDB query
        const mongoQuery = {};

        // Text search on name, description, or tags
        if (query && query.trim()) {
            const searchRegex = new RegExp(query.trim(), 'i');
            mongoQuery.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { tags: { $in: [searchRegex] } }
            ];
        }

        // Category filter
        if (category) {
            const categoryDoc = await Category.findOne({ 
                name: new RegExp(`^${category.trim()}$`, 'i') 
            });
            if (categoryDoc) {
                mongoQuery.category = categoryDoc._id;
            }
        }

        // Price range filter
        if (minPrice !== null || maxPrice !== null) {
            mongoQuery.price = {};
            if (minPrice !== null) mongoQuery.price.$gte = minPrice;
            if (maxPrice !== null) mongoQuery.price.$lte = maxPrice;
        }

        // Only show in-stock items
        mongoQuery.stock = { $gt: 0 };

        // Execute query
        const products = await Product.find(mongoQuery)
            .populate('category', 'name')
            .select('name description price stock images tags category')
            .limit(Math.min(limit, 10))
            .lean();

        if (products.length === 0) {
            return {
                success: true,
                found: false,
                message: "No products found matching your criteria",
                products: [],
                searchParams: { query, category, minPrice, maxPrice }
            };
        }

        // Format products for response - include product URL
        const formattedProducts = products.map(p => ({
            id: p._id.toString(),
            name: p.name,
            description: p.description.substring(0, 100) + (p.description.length > 100 ? '...' : ''),
            price: p.price,
            inStock: p.stock > 0,
            stockCount: p.stock,
            category: p.category?.name || 'Uncategorized',
            tags: p.tags || [],
            image: p.images?.[0] || null,
            productUrl: `/product/${p._id.toString()}`
        }));

        return {
            success: true,
            found: true,
            count: formattedProducts.length,
            products: formattedProducts,
            searchParams: { query, category, minPrice, maxPrice }
        };

    } catch (error) {
        console.error('Search Products Error:', error);
        return {
            success: false,
            error: 'Failed to search products',
            message: error.message
        };
    }
};

module.exports = {
    searchProductsTool,
    executeSearchProducts
};
