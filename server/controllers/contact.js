const { sendMail } = require('../utils/mailsend');
const { contactTemplate } = require('../mailTemplates/contactUsTemplate');

exports.contactUs = async (req, res) => {
    try {
        // name,email,message,title
        const { name, email, title, message } = req.body;
        console.log("first")
        if (!name || !email || !title || !message) {
            return res.status(404).json({
                message: "provide the data for contact",
                success: false
            })
        }
        const bodyOfMessage = contactTemplate(email, name, message)
        console.log("Data of contact form is -> ", name, email, title, message);
        const sendResult = await sendMail(email, title, bodyOfMessage);
        return res.status(200).json({
            success: true,
            message: "Message sent successfully!",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "mail sent check"
        })
    }
}