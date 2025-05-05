import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { Skeleton } from "@/components/ui/skeleton"
import { signup } from "../services/operations/authApi"
import { useNavigate } from "react-router-dom";


export default function Otp() {
    const [otp, setValue] = useState(null);
    const { signUpData, Loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit = async () => {
        try {
            const {
                Name,
                phoneNo,
                email,
                password,
                confirmPassword,
            } = signUpData;

            dispatch(signup(phoneNo, Name, email, password, confirmPassword, otp, navigate));
        } catch (error) {
            console.log("Error", error)
        }
    };
    return (
        Loading ? 
        (<div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <div className="flex flex-col items-start gap-y-7 border border-special-grey rounded-lg p-8">
              {/* Skeleton for Heading */}
              <Skeleton className="w-[250px] h-[30px] rounded-md bg-gray-500 animate-pulse" />
          
              {/* Skeleton for OTP Input */}
              <div className="flex  gap-x-2">
                <Skeleton className="w-[30px] h-[40px] rounded-md bg-gray-500 animate-pulse" />
                <Skeleton className="w-[30px] h-[40px] rounded-md bg-gray-500 animate-pulse" />
                <Skeleton className="w-[30px] h-[40px] rounded-md bg-gray-500 animate-pulse" />
                <div className="w-[30px] h-[40px]"></div>
                <Skeleton className="w-[30px] h-[40px] rounded-md bg-gray-500 animate-pulse" />
                <Skeleton className="w-[30px] h-[40px] rounded-md bg-gray-500 animate-pulse" />
                <Skeleton className="w-[30px] h-[40px] rounded-md bg-gray-500 animate-pulse" /> 
              </div>
              
              {/* Skeleton for OTP Instructions */}
              <Skeleton className="w-[300px] h-[20px] rounded-md bg-gray-500 animate-pulse" />
          
              {/* Skeleton for Submit Button */}
              <Skeleton className="w-[76px] h-[50px]  rounded-md bg-gray-500 animate-pulse" />
            </div>
          </div>   
        )
        : 
        (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white ">
                <div className="flex flex-col items-start gap-y-4 border-1 border-special-grey rounded-lg p-8 ">
                    <div className="text-white text-2xl font-semibold">One-Time Password</div>
                    <InputOTP maxLength={6} value={otp} onChange={(otp) => setValue(otp)} className="w-full">
                        <InputOTPGroup >
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <div className="text-special-grey">Please enter the one-time password sent to your mail.</div>
                    <Button className="bg-white text-black hover:bg-gray-300 " onClick={onSubmit}>Submit</Button>
                </div>

            </div>
        )
    )
}
