import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { setSignUpData } from "../../slice/authSlice"
import { useDispatch } from "react-redux"
import { sendOtp, login } from "@/services/operations/authApi"
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

export function LoginForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const password = watch("password")
  const { Loading } = useSelector((state) => state.auth)

  const onSubmit = async (data) => {
    if (props.heading === "Login") {
      dispatch(login(data.email, data.password, navigate))
    } else {
      try {
        if (data.password !== data.confirmPassword) {
          toast("Passwords do not match")
          return
        }
        const phone = `${data.countryCode}${data.phoneNo}`
        const updatedData = { ...data, phoneNo: phone }
        delete updatedData.countryCode
        dispatch(setSignUpData(updatedData))
        dispatch(sendOtp(updatedData.email, navigate))
      } catch (error) {
        console.log("Error", error)
      }
      reset()
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <Card className="text-white border-[#797878]">
        <CardHeader>
          <CardTitle className="text-2xl">{props.heading}</CardTitle>
          <CardDescription className="text-specialGrey">
            {props.heading === "Login"
              ? "Enter your email below to login to your account"
              : "Fill the details below to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {props.heading === "Signup" && (
              <div className="grid gap-2">
                <Label htmlFor="Name">Name</Label>
                <Input
                  id="Name"
                  type="text"
                  placeholder="John Doe"
                  className="border-2 border-[#59595a] focus-visible:ring-1 focus-visible:ring-[#59595a] focus-visible:ring-offset-1"
                  {...register("Name", { required: "Name is required" })}
                />
                {errors.Name && (
                  <p className="text-sm text-red-500">{errors.Name.message}</p>
                )}
              </div>
            )}
            {props.heading === "Signup" && (
              <div className="grid gap-2">
                <Label htmlFor="phoneNo">Phone Number</Label>
                <div className="flex gap-2">
                  <select
                    id="countryCode"
                    className="border-2 border-[#59595a] bg-black rounded-md px-2 focus-visible:ring-1 focus-visible:ring-[#59595a] focus-visible:ring-offset-1"
                    {...register("countryCode", { required: true })}
                    defaultValue="+91"
                  >
                    <option value="+91" className="bg-black hover:bg-white hover:text-black">🇮🇳 +91</option>
                    <option value="+1" className="bg-black hover:bg-white hover:text-black">🇺🇸 +1</option>
                    <option value="+44" className="bg-black hover:bg-white hover:text-black">🇬🇧 +44</option>
                    <option value="+61" className="bg-black hover:bg-white hover:text-black">🇦🇺 +61</option>
                    <option value="+971" className="bg-black hover:bg-white hover:text-black">🇦🇪 +971</option>
                    {/* Add more options as needed */}
                  </select>
                  <Input
                    id="phoneNo"
                    type="tel"
                    placeholder="123 456 7890"
                    className="border-2 border-[#59595a] focus-visible:ring-1 focus-visible:ring-[#59595a] focus-visible:ring-offset-1"
                    {...register("phoneNo", { required: "Phone number is required" })}
                  />
                </div>
                {errors.phoneNo && (
                  <p className="text-sm text-red-500">{errors.phoneNo.message}</p>
                )}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="border-2 border-[#59595a] focus-visible:ring-1 focus-visible:ring-[#59595a] focus-visible:ring-offset-1"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {props.heading === "Login" && (
                  <a
                    href="/reset-password"
                    className="ml-auto inline-block lg:text-sm underline hover:text-primary text-special-grey"
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
              <Input
                id="password"
                type="password"
                className="border-2 border-[#59595a] focus-visible:ring-1 focus-visible:ring-[#59595a] focus-visible:ring-offset-1"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {props.heading === "Signup" && (
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="border-2 border-[#59595a] focus-visible:ring-1 focus-visible:ring-[#59595a] focus-visible:ring-offset-1"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={Loading}>
              {props.heading}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm">
            {props.heading === "Login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <a href={props.heading === "Login" ? "/signup" : "/login"} className="underline hover:text-primary">
              {props.heading === "Login" ? "Sign up" : "Login"}
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
