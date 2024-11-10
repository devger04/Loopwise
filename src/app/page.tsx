'use client';
// pages/index.tsx
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/map'); // Navigating to the map page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="flex flex-col items-center justify-center min-h-screen pt-20">
        <section className="text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
            Drive Smarter, Not Harder
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-400">
            Optimized routes and smarter loops powered by machine learning
          </p>
          <button
            onClick={handleNavigate}
            className="px-6 py-3 mt-6 text-lg font-semibold text-gray-900 bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-colors duration-200"
          >View Map</button>
        </section>
      </main>
      <footer className="bg-black bg-opacity-80 py-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Loopwise. All Rights Reserved.</p>
      </footer>
    </div>

  );
};

export default HomePage;
