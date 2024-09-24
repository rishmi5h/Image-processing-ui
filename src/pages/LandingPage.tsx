import React from 'react';
import { FaDownload, FaImage, FaMagic, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer.tsx';

const FeatureCard = ({ description, icon: Icon, title }) => (
  <div className="flex flex-col items-center rounded-lg bg-neutral-800 p-6 shadow-lg">
    <Icon className="mb-4 text-4xl text-purple-500" />
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="text-center text-gray-300">{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <header className="bg-neutral-900 p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaImage className="text-3xl text-purple-500" />
            <h1 className="text-2xl font-bold">Imagery</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              className="text-white transition duration-300 hover:text-purple-500"
              to="/register"
            >
              Register
            </Link>
            <Link
              className="rounded bg-purple-600 px-4 py-2 text-white transition duration-300 hover:bg-purple-700"
              to="/login"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="mb-6 text-5xl font-bold text-purple-500">
            Transform Your Images with Ease
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Imagery is your all-in-one solution for image processing. Convert,
            transform, and enhance your images effortlessly.
          </p>
          <Link
            className="inline-block rounded-full bg-purple-600 px-8 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-purple-700"
            to="/register"
          >
            Get Started for Free
          </Link>
        </section>
        <section className="container mx-auto px-4 py-16">
          <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              description="Convert images to various formats including JPG, PNG, WebP, and GIF."
              icon={FaMagic}
              title="Image Conversion"
            />
            <FeatureCard
              description="Process multiple images at once, saving you time and effort."
              icon={FaDownload}
              title="Batch Processing"
            />
            <FeatureCard
              description="Resize, crop, rotate, and apply filters to your images with ease."
              icon={FaRocket}
              title="Advanced Transformations"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
