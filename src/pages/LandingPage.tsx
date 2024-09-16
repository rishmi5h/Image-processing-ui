import React from 'react';
import { FaApple, FaDownload, FaHeart, FaListAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg'; // Add your logo image here

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-cover bg-center text-white">
      <header className="bg-neutral-900 p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <img src={logo} alt="Imagery Logo" className="h-8 w-8" /> */}
            <h1 className="text-2xl font-bold">Imagery</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link className="text-white hover:text-purple-500" to="/register">
              Register
            </Link>
            <Link className="text-white hover:text-purple-500" to="/login">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center bg-neutral-900 bg-opacity-75 p-8">
        <section className="max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-purple-500">
            Welcome to Imagery
          </h2>
          <p className="mt-6 text-lg">
            Imagery is your one-stop solution for transforming and converting
            images with ease. Whether you need to resize, crop, or apply
            filters, Imagery has got you covered.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              className="rounded bg-purple-600 px-6 py-3 text-lg font-semibold text-white hover:bg-purple-700"
              to="/register"
            >
              Get Started
            </Link>
            <Link
              className="rounded border border-purple-600 px-6 py-3 text-lg font-semibold text-purple-600 hover:bg-purple-600 hover:text-white"
              to="/login"
            >
              Login
            </Link>
          </div>
        </section>
      </main>
      <footer className="bg-neutral-800 bg-opacity-75 p-4 text-center text-neutral-500">
        &copy; 2024 Imagery. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
