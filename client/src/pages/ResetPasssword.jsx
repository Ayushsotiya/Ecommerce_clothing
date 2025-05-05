import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {useSelector} from "react-redux";
const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
     console.log(data);
  };
 const {Loading} = useSelector((state)=>state.auth);
  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white ">
      <div className="w-full max-w-md p-8 space-y-6 border border-specialGrey rounded-">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <p className="text-center">Enter your email below to reset your password</p>
        
        {Loading? (
          <div className="text-center">
            <p>A password reset link has been sent to your email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full px-4 py-2 bg-black border border-specialGrey rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              Reset Password
            </Button>
          </form>
        )}

        <div className="text-center text-sm">
          <a href="/login" className="text-gray-400 hover:text-white">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;