  import React from "react"
  import { useSelector, useDispatch } from "react-redux"
  import { useForm, FormProvider } from "react-hook-form"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Button } from "@/components/ui/button"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { addAddress as addAddressApi, profileUpdate } from "../../services/operations/authApi"
  import {changePassword } from "../../services/operations/authApi";

  const Profile = () => {
    const dispatch = useDispatch()
    const { user, loading ,address } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const type = user?.type || "User"
    const userInitial = user?.name?.charAt(0) || "U"

    const profileMethods = useForm()
    const addressMethods = useForm()
    const passwordMethods = useForm()

    const {
      register: registerProfile,
      handleSubmit: handleSubmitProfile,
      formState: { errors: errorsProfile },
      reset: resetProfile,
    } = profileMethods

    const {
      register: registerAddress,
      handleSubmit: handleSubmitAddress,
      formState: { errors: errorsAddress },
      reset: resetAddress,
    } = addressMethods

    const {
      register: registerPassword,
      handleSubmit: handleSubmitPassword,
      formState: { errors: errorsPassword },
      reset: resetPassword,
      watch,
    } = passwordMethods

    const onSubmit = (data) => {
      data.email = user.email
      dispatch(profileUpdate(data, token))
      resetProfile()
    }
    
    const addAddress = async (data) => {
      dispatch( addAddressApi(
        data,token
      ))
      // resetAddress()
    }

    const changePasswordHandler = async (data) => {
      if(data.confirmNewPassword!=data.newPassword){
        toast.error("confirm password do not match")
      }
      await changePassword(token,data)
      resetPassword()
    }
    console.log(address);  
    if (loading) return <div>Loading ...</div>

    return (
      <div className="container max-w-4xl mx-auto py-10">
        {/* Profile Info */}
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{`${type} Profile`}</CardTitle>
            <CardDescription className="text-zinc-400">Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...profileMethods}>
              <form onSubmit={handleSubmitProfile(onSubmit)} className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24 border-2 border-zinc-800">
                    <AvatarImage src={user?.image || ""} alt="Profile" />
                    <AvatarFallback className="bg-zinc-800 text-xl">{userInitial}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-medium text-white">Profile Picture</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input id="name" placeholder={user.Name} className="bg-black border-zinc-800 focus-visible:ring-white" {...registerProfile("name", { required: "Name is required" })} />
                    {errorsProfile.name && <span className="text-red-500 text-sm">{errorsProfile.name.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input id="email" type="email" disabled placeholder={user.email} className="bg-black border-zinc-800 focus-visible:ring-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNo" className="text-white">Phone Number</Label>
                    <Input id="phoneNo" type="tel" placeholder={user.phoneNo} className="bg-black border-zinc-800 focus-visible:ring-white" {...registerProfile("phoneNo", { required: "Phone number is required.", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number." } })} />
                    {errorsProfile.phoneNo && <span className="text-red-500 text-sm">{errorsProfile.phoneNo.message}</span>}
                  </div>
                </div>
                <Button type="submit" className="bg-white hover:bg-specialGrey text-black font-medium">Save Changes</Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Address Section */}
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 mt-10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Address Details</CardTitle>
            <CardDescription className="text-zinc-400">Update your residential address</CardDescription>
          </CardHeader> 
          <CardContent>
            <FormProvider {...addressMethods}>
              <form onSubmit={handleSubmitAddress(addAddress)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="houseNo" className="text-white">House No.</Label>
                    <Input id="houseNo" placeholder={address?.houseNo??"House no"} className="bg-black border-zinc-800 focus-visible:ring-white" {...registerAddress("houseNo", { required: "House No. is required" })} />
                    {errorsAddress.houseNo && <span className="text-red-500 text-sm">{errorsAddress.houseNo.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-white">Street</Label>
                    <Input id="street" placeholder={address?.street??"Street no"} className="bg-black border-zinc-800 focus-visible:ring-white" {...registerAddress("street", { required: "Street is required" })} />
                    {errorsAddress.street && <span className="text-red-500 text-sm">{errorsAddress.street.message}</span>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="Address" className="text-white">Full Address</Label>
                    <Input id="Address" placeholder={address?.Address??"Address"} className="bg-black border-zinc-800 focus-visible:ring-white" {...registerAddress("Address", { required: "Full address is required", minLength: { value: 5, message: "Full address must be at least 5 characters" } })} />
                    {errorsAddress.Address && <span className="text-red-500 text-sm">{errorsAddress.Address.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white">City</Label>
                    <Input id="city" placeholder={address?.city??"City"} className="bg-black border-zinc-800 focus-visible:ring-white" {...registerAddress("city", { required: "City is required" })} />
                    {errorsAddress.city && <span className="text-red-500 text-sm">{errorsAddress.city.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-white">State</Label>
                    <Input id="state" placeholder={address?.state??"State"} className="bg-black border-zinc-800 focus-visible:ring-white" {...registerAddress("state", { required: "State is required" })} />
                    {errorsAddress.state && <span className="text-red-500 text-sm">{errorsAddress.state.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-white">Pincode</Label>
                    <Input id="pincode" placeholder={address?.postalCode??"Postal Code"} className="bg-black border-zinc-800 focus-visible:ring-white" {...registerAddress("pincode", { required: "Pincode is required", pattern: { value: /^[1-9][0-9]{5}$/, message: "Enter a valid 6-digit Indian pincode" } })} />
                    {errorsAddress.pincode && <span className="text-red-500 text-sm">{errorsAddress.pincode.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-white">Country</Label>
                    <Input id="country" placeholder={address?.country??"Country"} className="bg-black border-zinc-800 focus-visible:ring-white" {...registerAddress("country")} />
                  </div>
                </div>
                <Button type="submit" className="bg-white hover:bg-specialGrey text-black font-medium">Save Address</Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 mt-10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Change Password</CardTitle>
            <CardDescription className="text-zinc-400">Use a long, random password for security</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...passwordMethods}>
              <form onSubmit={handleSubmitPassword(changePasswordHandler)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="Enter current password" className="bg-black border-zinc-800 focus-visible:ring-white" {...registerPassword("currentPassword", { required: "Current password is required" })} />
                    {errorsPassword.currentPassword && <span className="text-red-500 text-sm">{errorsPassword.currentPassword.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" className="bg-black border-zinc-800 focus-visible:ring-white" {...registerPassword("newPassword", { required: "New password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
                    {errorsPassword.newPassword && <span className="text-red-500 text-sm">{errorsPassword.newPassword.message}</span>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirmNewPassword" className="text-white">Confirm New Password</Label>
                    <Input id="confirmNewPassword" type="password" placeholder="Confirm new password" className="bg-black border-zinc-800 focus-visible:ring-white" {...registerPassword("confirmNewPassword", { required: "Please confirm your new password", validate: (value) => value === watch("newPassword") || "Passwords do not match" })} />
                    {errorsPassword.confirmNewPassword && <span className="text-red-500 text-sm">{errorsPassword.confirmNewPassword.message}</span>}
                  </div>
                </div>
                <Button type="submit" className="bg-white hover:bg-specialGrey text-black font-medium">Change Password</Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    )
  }

  export default Profile