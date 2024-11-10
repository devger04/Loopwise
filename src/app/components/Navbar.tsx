// app/components/Navbar.tsx
'use client'
import Link from 'next/link';

const Navbar = () => {
    return (
        <header className="bg-black bg-opacity-80 fixed w-full z-10 shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-white">Loopwise</h1>
                <nav>
                    <ul className="flex space-x-8">
                        <li>
                            <Link href="/" className="text-white text-lg hover:text-gray-400 transition-colors duration-200">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="text-white text-lg hover:text-gray-400 transition-colors duration-200">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/map" className="text-white text-lg hover:text-gray-400 transition-colors duration-200">
                                Map
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
