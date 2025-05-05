import React from 'react';
import { Link } from 'react-router-dom';



export default function NotFoundPage() {
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-black text-white ">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Oops! Lost in Cyberspace</h1>
          <p className="text-gray-500">Looks like you've ventured into the unknown digital realm.</p>
        </div>
        <Link
          to="/"
          className="inline-flex h-10 items-center rounded-md bg-white px-8 text-sm font-medium text-black  shadow transition-colors hover:bg-specialGrey focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
        >
          Return to website
        </Link>
        
      </div>
    </div>
  );
}
