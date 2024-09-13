import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <header className="bg-neutral-800 p-4">
        <h1 className="text-center text-4xl font-bold text-pink-500">
          Imagery
        </h1>
        <nav className="mt-4 flex justify-center space-x-4">
          <Link className="text-white hover:text-pink-500" to="/login">
            Login
          </Link>
          <Link className="text-white hover:text-pink-500" to="/register">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center p-8">
        <section className="max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-pink-500">
            Welcome to Imagery
          </h2>
          <p className="mt-6 text-lg">
            Imagery is your one-stop solution for transforming and converting
            images with ease. Whether you need to resize, crop, or apply
            filters, Imagery has got you covered.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              className="rounded bg-pink-600 px-6 py-3 text-lg font-semibold text-white hover:bg-pink-700"
              to="/register"
            >
              Get Started
            </Link>
            <Link
              className="rounded border border-pink-600 px-6 py-3 text-lg font-semibold text-pink-600 hover:bg-pink-600 hover:text-white"
              to="/login"
            >
              Login
            </Link>
          </div>
        </section>
        <section className="mt-16 grid grid-cols-1 gap-8">
          <div className="rounded-lg bg-neutral-800 p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-pink-500">
              Transform Images
            </h3>
            <p className="mt-2">
              Use our powerful tools to transform your images. Resize, crop,
              rotate, and apply various filters to make your images stand out.
            </p>
          </div>
          <div className="rounded-lg bg-neutral-800 p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-pink-500">Convert Images</h3>
            <p className="mt-2">
              Convert your images to different formats with ease. We support a
              wide range of formats to ensure compatibility with all your needs.
            </p>
          </div>
        </section>
      </main>
      <footer className="mt-16 p-4 text-center text-neutral-500">
        &copy; 2024 Imagery. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
