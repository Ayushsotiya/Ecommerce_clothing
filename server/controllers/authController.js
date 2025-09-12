const User = require("../models/User");
const bcrypt = require("bcrypt");
const Address = require("../models/Address");
const Otp = require("../models/Otp");
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { sendMail } = require("../utils/mailsend");
const  {otpTemplate } = require("../mailTemplates/signupTemplate");
const { response, application } = require("express");
require('dotenv').config();



exports.signUp = async (req, res) => {
    try {
        const { Name, phoneNo, email, password, confirmPassword, otp,type="User"  } = req.body;
        console.log(Name, phoneNo, email, password, confirmPassword, otp ,type );
        if(!Name || !phoneNo || !email || !password || !confirmPassword || !otp) {
              return res.status(500).json({
                success: false,
                message: "Provide all the fields"
              })
        }
        if (password != confirmPassword) {
            return res.status(500).json({
                success: false,
                message: "Confirmed password does not matchh"
            })
        }
        const findOne = await User.findOne({ email});
        if (findOne) {
            return res.status(500).json({
                success: false,
                message: "User already present"
            })
        }
        
        const response = await Otp.find({ email:email }).sort({ createdAt: -1 }).limit(1);
        if(response.length === 0) {
            //OTP not found
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid 1',
            });
        } else if ( otp !== response[0].otp) {
            //Invalid OTP
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid 2',
            });
        }
        const hashPass = await bcrypt.hash(password, 10);
        const address = await Address.create({
            houseNo: null,
            streetAndAddress: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            user:null,
        })
        const aprov  = type === "Admin" ? true : false;
        const user = await User.create({
            Name : Name,
            email: email,
            phoneNo: phoneNo,
            password: hashPass,
            type: type ,
            approved:aprov,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${Name} `,
            address: address._id,
            createdAt: Date.now()
        })
        address.user = user._id;
        await address.save();
        return res.status(200).json({
            success: true,
            user,
            message: 'User Registered Successfully',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Cannot be Registered, Please Try Again.'
        })
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(500).json({
                success: false,
                message: "please provide all the field",
            })
        }
        const response = await User.findOne({ email }).populate('address').exec();
        if (!response) {
            return res.status(400).json({
                success: false,
                message: "User not have account",
            })
        }
        const isMatch = await bcrypt.compare(password, response.password);
        if (!isMatch) { 
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
            const payload = {
                email: response.email,
                id: response._id,
                type: response.type
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
            response.token = token;
            response.password = null;
            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie('token', token, option).status(200).json({
                success: true,
                token,
                response,
                message: "user login success"
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        });
    }

};

exports.otp = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            //Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            });
        }
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        var result = await Otp.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await Otp.findOne({ otp: otp });
        }
        const optCreated = await Otp.create({ email: email, otp: otp });
        const content = otpTemplate(otp);
        await sendMail(email, `verification male for creating a account at ${process.env.COMPANY_NAME}`, content);
        return res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({
                success: false,
                message: "the email is not provided",
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.staus.json({
                success: false,
                message: "user not found with the email"
            })
        }
        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate({ email: email }, { token: token, resetPasswordExpire: Date.now() + 5 * 60 * 1000 }, { new: true });
        const url = `http://localhost:4000/update-password/${token}`
        await sendMail(email, `link to reset password for ${process.env.COMPANY_NAME}`, `reset password link ${url}`);
        res.status(200).json({
            success: true,
            message: `Email sent successfully ,please chheck email to change password valid for only 5 min`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to reset password and send reset link "
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;
        if (!token || !password || !confirmPassword) {
            return res.status(500).json({
                
                success: false,
                message: "provide all the fields"
            })
        }
        if (password !== confirmPassword) {
            return res.status(500).json({
                success: false,
                message: "confrim password and password field not matched"
            })
        }

        const userDetails = await User.findOne({ token: token });
        if (!userDetails) {
            return res.status(500).json({
                success: false,
                message: "token is invalid"
            })
        }

        if (userDetails.resetPasswordExpires < Date.now) {
            return res.status(500).json({
                success: false,
                message: "token is expired"
            })
        }
        const hashpass = await bcrypt.hash(password,10);

        const updatedUser = await User.findOneAndUpdate({ token: token }, { password: hashpass }, { new: true });

        return res.status(200).json({
            success: true,
            message: "password is changed"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to reset password  "
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id);
        const { currentPassword, newPassword} = req.body;
        if (!currentPassword || !newPassword ||!userDetails) {
            return res.status(400).json({
                success: false,
                message: "please provide all the details"
            })  
        }
        const isMatch = await bcrypt.compare(currentPassword, userDetails.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }
        const hashPass = await bcrypt.hash(newPassword, 10);
        const updateduser = await User.findByIdAndUpdate( req.user.id, { password: hashPass }, { new: true });
        console.log("password changed")
        return res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to reset password and send reset link "
        });
    }
}

exports.addOrUpdateAddress= async (req, res) => {
    try {
        console.log("1111")
        const { houseNo, street,address, city, state, postalCode, country } = req.body;
        const userId = req.user.id; 
        let user = await User.findById(userId);
        if (!user ||!houseNo || !street||!address || !city || !state || !postalCode || !country) {
            return res.status(400).json({
                success: false,
                message: "Please provide all address fields."
            });
        }   
        let responseAddress =  await Address.findOne({ user: userId });
        console.log(responseAddress)
        if (responseAddress) {
            responseAddress.houseNo = houseNo;
            responseAddress.street = street;
            responseAddress.Address = address;
            responseAddress.city = city;
            responseAddress.state = state;
            responseAddress.postalCode = postalCode;
            responseAddress.country = country;
            await responseAddress.save();
        }
        return res.status(200).json({
            success: true,
            message: "Address saved successfully.",
            address:responseAddress
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while saving the address."
        });
    }
};

exports.getAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const address = await Address.findOne({ user: userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found."
            });
        }

        return res.status(200).json({
            success: true,
            address
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the address."
        });
    }
};

exports.updateProfile = async (req , res) =>{
    try{
        const{Name,phoneNo ,email} = req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:'provide email please'
            })
        }
        const userNeedToUpdate = await User.findOne({email:email});
         if (!userNeedToUpdate) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }
        userNeedToUpdate.Name = Name || userNeedToUpdate.Name;
        userNeedToUpdate.phoneNo = phoneNo || userNeedToUpdate.phoneNo;
        const updatedUser = await userNeedToUpdate.save();
        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    }catch(error){
        console.log(error.message);
        return res.status(400).json({
            success:false,
            message:"failed to update the profile"
        })
    }
}