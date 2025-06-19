import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { profileUpdate } from "../../services/operations/authApi"

const Profile = () => {
  const dispatch = useDispatch()
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm()

  const { user, loading } = useSelector((state) => state.profile)
  const type = user?.type || "User"
  const userInitial = user?.name?.charAt(0) || "U"

  const onSubmit = (data) => {
    console.log("Form Data:", data)
    dispatch(profileUpdate(data.name, data.email, data.phoneNo))
    reset()
  }

  if (loading) {
    return <div>Loading ...</div>
  }

  return (
    <div className="container max-w-4xl mx-60 my-auto py-10">
      <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{`${type} Profile`}</CardTitle>
          <CardDescription className="text-zinc-400">
            Update your profile information and manage your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Image Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-zinc-800">
                <AvatarImage src={user?.image || ""} alt="Profile" />
                <AvatarFallback className="bg-zinc-800 text-xl">{userInitial}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium text-white">Profile Picture</h3>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-2">
                Personal Information
              </h3>

              {/* User Info Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    placeholder={user.Name}
                    className="bg-black border-zinc-800 focus-visible:ring-white"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={user.email}
                    className="bg-black border-zinc-800 focus-visible:ring-white"
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format.",
                      },
                    })}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNo" className="text-white">Phone Number</Label>
                  <Input
                    id="phoneNo"
                    type="tel"
                    placeholder={user.phoneNo}
                    className="bg-black border-zinc-800 focus-visible:ring-white"
                    {...register("phoneNo", {
                      required: "Phone number is required.",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit phone number.",
                      },
                    })}
                  />
                  {errors.phoneNo && <span className="text-red-500 text-sm">{errors.phoneNo.message}</span>}
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="bg-white hover:bg-specialGrey hover:text-black text-black font-medium">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
