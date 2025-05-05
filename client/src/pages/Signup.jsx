import React from 'react'
import { LoginForm } from "@/components/auth/login-form"

const Signup = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-black">
        <div className="w-full  flex flex-row border-0 border-[#59595a] ">
            <LoginForm heading={"Signup"} />
        </div>
    </div>
  )
}

export default Signup