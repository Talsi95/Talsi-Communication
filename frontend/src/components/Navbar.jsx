import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';


const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <nav className="flex justify-between items-center p-4 md:p-6 sticky top-0 z-50 
               bg-white/[0.03] backdrop-blur-xl border-b border-white/10 
               shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]" dir="rtl">

            <Link to="/" className="text-2xl font-black text-white tracking-tighter hover:scale-105 transition-transform">
                TALSI<span className="text-teal-400">-PRO</span>
            </Link>

            <div className="flex items-center gap-4">
                {token && userRole === 'Admin' && (
                    <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                    >
                        <ShieldCheck size={18} className="text-teal-400" />
                        <span>ניהול מערכת</span>
                    </Link>
                )}
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
                        className="px-6 py-2 bg-teal-500 text-slate-900 rounded-full font-bold hover:bg-teal-400 transition shadow-lg shadow-teal-500/20">
                        כניסת סוכנים
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;