const BASE_URL = import.meta.env.VITE_BASE_URL

export const auth = {
    SENTOTP_API: BASE_URL + 'auth/sendotp',
    SIGNUP_API: BASE_URL + 'auth/signup',
    LOGIN_API: BASE_URL + 'auth/login',
    RESETPASSTOKEN_API: BASE_URL + 'auth/resetpasswordtoken',
    RESETPASSWORD_API: BASE_URL + 'auth/resetpassword',
    CHANGEPASSWORD_API: BASE_URL + 'auth/changepassword',
    ADDADDRESS_API: BASE_URL + 'auth/addaddress',
    GETADDRESS_API: BASE_URL + 'auth/getaddress'
}

export const category = {
    CREATECATEGORY_API: BASE_URL + 'category/createcategory',
    DELETECATEGORY_API: BASE_URL + 'category/deletecategory',
    SHOWALLCATEGORY_API: BASE_URL + 'category/showallcategory',
    CATEGORYPAGEDETAILS_API: BASE_URL + 'category/categorypagedetails',
}

export const product = {
    CREATEPRODUCT_API: BASE_URL + 'product/createproduct',
    GETALLPRODUCT_API: BASE_URL + 'product/getallproduct',
    UPDATEPRODUCT_API: BASE_URL + 'product/updateproduct',
    DELETEPROUDCT_API: BASE_URL + 'product/deleteproduct',
}

export const payment = {
    CREATEORDER_API: BASE_URL + 'payment/createorder',
    VERIFYPAYMENT_API: BASE_URL + 'payment/verifypayment',
    ADDPRODUCTTOCUSTOMER_API: BASE_URL + 'payment/addproducttocustomer',
}