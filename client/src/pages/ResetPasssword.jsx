import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordToken, resetPassword } from '@/services/operations/authApi';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL if present
  const [emailSent, setEmailSent] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { loading } = useSelector((state) => state.auth);

  // Handle sending reset email (when no token in URL)
  const onSubmitEmail = async (data) => {
    console.log(data);
    await dispatch(resetPasswordToken(data.email));
    setEmailSent(true);
  };

  // Handle resetting password (when token is in URL)
  const onSubmitPassword = async (data) => {
    await dispatch(resetPassword(data.password, data.confirmPassword, token));
    setPasswordReset(true);
  };

  // If token exists in URL, show password reset form
  if (token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="w-full max-w-md p-8 space-y-6 border border-specialGrey rounded-md">
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          
          {passwordReset ? (
            <div className="text-center space-y-4">
              <p className="text-green-400">Your password has been reset successfully!</p>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-400">Enter your new password below</p>
              <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
                <div>
                  <label htmlFor="password" className="sr-only">New Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="New Password"
                    className="w-full px-4 py-2 bg-black border border-specialGrey rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 bg-black border border-specialGrey rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                    {...register('confirmPassword', { 
                      required: 'Confirm password is required',
                      validate: value => value === watch('password') || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-gray-200"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}

          <div className="text-center text-sm">
            <a href="/login" className="text-gray-400 hover:text-white">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // No token - show email form to request reset link
  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white ">
      <div className="w-full max-w-md p-8 space-y-6 border border-specialGrey rounded-md">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <p className="text-center">Enter your email below to reset your password</p>
        
        {emailSent ? (
          <div className="text-center space-y-4">
            <p className="text-green-400">A password reset link has been sent to your email.</p>
            <p className="text-sm text-gray-400">Please check your email and click on the link to reset your password.</p>
            <p className="text-xs text-gray-500">The link is valid for 5 minutes only.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-4">
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
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset Password"}
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