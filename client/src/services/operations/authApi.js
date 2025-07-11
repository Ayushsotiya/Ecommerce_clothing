
import { apiConnector } from "../apiConnector";
import { auth } from "../api";
import { toast } from "react-hot-toast"
import { setLoading, setToken, setSignUpData } from "../../slice/authSlice";
import { setUser,setAddress } from "../../slice/profileSlice";

const {
    SENTOTP_API,
    SIGNUP_API,
    LOGIN_API,
    CHANGEPASSWORD_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
    ADDADDRESS_API,
    GETADDRESS_API,
    PROFILEUPDATE_API,
} = auth;


export function signup(phoneNo, Name, email, password, confirmPassword, otp, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", SIGNUP_API, { phoneNo, Name, email, password, confirmPassword, otp })
            console.log("SIGNUP API RESPONSE...........", response)
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Signup Successfully");
            navigate("/login");
        } catch (error) {
            console.log("SIGNUP API ERROR...", error);
            toast("Could Not Sign Up");
            toast.error("signup failed")
        }
        dispatch(setLoading(false));
    }
}

export function sendOtp(email, navigate) {

    return async (dispatch) => {
        dispatch(setLoading(true));
        try {

            const response = await apiConnector("POST", SENTOTP_API, { email })
            console.log("SENDOTP API RESPONSE...........", response)
            console.log(response.data.success);
            if (!response.data.success) {
                navigate("/signup");
                throw new Error(response.data.message);
            }
            toast.success("OTP Sent Successfully check your email");
            navigate("/verify-email");

        } catch (error) {
            console.log("SENDOTP API ERROR...", error);
            toast.error("Could Not Send OTP");
        }
        dispatch(setLoading(false));

    }
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", LOGIN_API, { email, password });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            console.log(response);
            dispatch(setToken(response.data.token));
            dispatch(setUser(response.data.response));
            dispatch(setAddress(response.data.response.address));
            toast.success("Login Successfully")
            response.data.response.type === "Admin" ? (navigate("/dashboard/admin/profile")) : (navigate("/dashboard/profile"));
        }
        catch (error) {
            console.log("LOGIN API ERROR...", error);
            toast.error("Could Not Login");
        }
        dispatch(setLoading(false))

    }
}

export function logout(navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setToken(null))
        dispatch(setSignUpData(null));
        dispatch(setUser(null));
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.clear();
        toast("Logout Successful");
        navigate("/");
        dispatch(setLoading(false));
    };
}

export function resetPasswordToken(email, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", RESETPASSTOKEN_API, email);
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            navigate('/reset-password');
        } catch (error) {
            console.log(error.message);
        }
        dispatch(setLoading(false));
    }
}

export function resetPassword(password, confirmPassword, token) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            if (password != confirmPassword) {
                throw new Error("password and confirm passowrd does not match");
            }
            const response = await apiConnector("POST", RESETPASSWORD_API, { password, confirmPassword, token });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast("Password Has Been Reset Successfully");
        } catch (error) {
            console.log("RESET PASSWORD TOKEN Error............", error);
            toast.error("Unable To Reset Password");
        }
        dispatch(setLoading(false));
    }
}

export async function changePassword(token, formData) {
    try {
        const response = await apiConnector('POST', CHANGEPASSWORD_API, formData, {
            Authorization: `Bearer ${token}`,
        });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast("Password changed")
    } catch (error) {
        console.log(error.message);
        toast("Cant change the password");
    }
}

export function addAddress(data,token) {
    return async (dispatch) => {
        try {
            const response = await apiConnector("POST", "http://localhost:4000/api/v1/auth/addaddress", {
                houseNo: data.houseNo,
                street: data.street,
                address: data.Address,
                city: data.city,
                state: data.state,
                postalCode: data.pincode, 
                country: data.country,
            },{ Authorization: `Bearer ${token}` })
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            
            dispatch(setAddress(response.data.address));
            toast.success("Address updated successfully")
        } catch (error) {
            console.error("Add Address Error:", error.message)
            toast.error("Failed to update address")
        }
    }
}

export async function getAddress(token) {
    try {
        const response = await apiConnector('POST', GETADDRESS_API, {
            Authorization: `Bearer ${token}`,
        })
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log("failed to get address");
        console.log(error.message);
    }
}

//Working api
export function profileUpdate(data, token) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            console.log('hello')
            const Name = data.name;
            const email = data.email;
            const phoneNo = data.phoneNo
            const response = await apiConnector("POST", PROFILEUPDATE_API, { Name, email, phoneNo }, { Authorization: `Bearer ${token}` });
            if (!response.data.success) {
                throw new Error("Can update the profile data");
            }
            console.log("RESPONSE OF THE PROFILE UPDATE DATA =>", response);
            dispatch(setUser(response.data.user));
            toast('profile data is updated');
        } catch (error) {
            console.log(error.message);
            toast("Cant update the profile data");
        }
        dispatch(setLoading(false));
    }
}