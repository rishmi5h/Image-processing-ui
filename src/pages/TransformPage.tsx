import Footer from '../Components/Footer.tsx';
import Navbar from '../Components/Navbar.tsx';

const TransformPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="mb-8 text-center text-4xl font-bold text-purple-500">
            Transform Image
          </h1>
          <div className="mx-auto max-w-2xl rounded-lg bg-neutral-800 p-8 shadow-xl">
            {/* Add image transformation controls here */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TransformPage;
