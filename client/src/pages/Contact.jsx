import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiConnector } from '../services/apiConnector';
import { toast } from 'react-hot-toast';
import contactus from "../../src/assets/contactus.jpg"
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Contact = () => {
  const { register, handleSubmit,reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await apiConnector('POST', `http://localhost:4000/api/v1/contact/contact-us`, data);
      if (!response.data.success) {
        toast.error(response.data.message);
      }
      console.log("MESSAGE_IS_SENT")
    } catch (error) {
      toast.error('Something went wrong!');
    }
    reset()
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen w-full bg-[black] flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-2xl p-8 grid md:grid-cols-2 gap-10">
        {/* Contact Image */}
        <div className="hidden md:flex h-full w-full items-center justify-center">
          <img
            src={contactus}
            alt="Contact Illustration"
            className="w-full h-full  object-contain"
          />
        </div>

        {/* Form */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#131314] mb-6">
            Contact Us
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm text-[#797878] mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                {...register('name')}
                className="border border-[#dcdcdc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEB714]"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm text-[#797878] mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                {...register('email')}
                className="border border-[#dcdcdc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEB714]"
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='title' className='text-sm text-[#797878]  mb-1'>Title</label>
              <input type='text' id='title' placeholder='Enter the title' {...register('title')}
                className="border border-[#dcdcdc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEB714]"
                required>
              </input>
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="text-sm text-[#797878] mb-1">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Your message..."
                {...register('message')}
                rows={4}
                className="border border-[#dcdcdc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEB714]"
                required
              />
            </div>

            <button
              type="submit"
              className={`bg-[#FEB714] text-[#131314] font-semibold py-2 rounded-lg hover:bg-[#e4a915] transition-all ${loading && 'opacity-60 cursor-not-allowed'
                }`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
