import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <nav className="flex justify-between items-center p-4 md:p-6 sticky top-0 z-50 
               bg-slate-900/40 backdrop-blur-xl border-b border-white/10 
               shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]" dir="rtl">

            <Link to="/" className="text-2xl font-black text-white tracking-tighter hover:scale-105 transition-transform">
                TALSI<span className="text-blue-400">-PRO</span>
            </Link>

            <div>
                {token ? (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 font-medium">שלום, {userName} 👋</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
                        >
                            התנתק
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition shadow-md"
                    >
                        כניסת סוכנים
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;