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

    const getPublicIdFromUrl = (url) => {
        try {
            const parts = url.split("/");
            const folderAndFilename = parts.slice(-2).join("/");
            const publicId = folderAndFilename.replace(/\.[^/.]+$/, "");
            return publicId;
        } catch (error) {
            console.error("Error extracting publicId:", error);
            return null;
        }
    };
    exports.deleteImage = async (url) => {
        const publicId = getPublicIdFromUrl(url)
        if (!publicId) return
        try {
            const res = await cloudinary.uploader.destroy(publicId)
            console.log("Deleted:", res)
        } catch (err) {
            console.error("Failed to delete image:", err)
        }
    }

