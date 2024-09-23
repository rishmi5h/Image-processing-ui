import Navbar from '../Components/Navbar.tsx';

const TransformPage = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Transform Image</h1>
      </div>
    </div>
  );
};

export default TransformPage;
