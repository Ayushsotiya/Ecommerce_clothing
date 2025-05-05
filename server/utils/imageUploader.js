const cloudinary = require('cloudinary').v2;


exports.uploadImage = async (files, folder) => {
    try {
        const options = { folder, resource_type: 'auto' };
        const fileArray = Array.isArray(files) ? files : [files];

        const uploadPromises = fileArray.map(file => 
            cloudinary.uploader.upload(file.tempFilePath, options)
        );

        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map(result => result.secure_url);
        return {
            success: true,
            message: "Images uploaded successfully",
            urls: imageUrls
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to upload images",
            error: error.message,
        };
    }
};
