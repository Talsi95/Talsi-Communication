import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userRole', data.role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה בהתחברות');
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 relative overflow-hidden" dir="rtl">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative">

                <div className="text-center mb-10">
                    <div className="inline-block p-4 rounded-2xl bg-teal-500/10 mb-4 border border-teal-500/20">
                        <span className="text-3xl">🔐</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">כניסת סוכנים</h2>
                    <p className="text-gray-400 mt-2 font-medium">הזן פרטים כדי לגשת לחבילות ה-VIP</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 mr-1">אימייל</label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-inner"
                            placeholder="name@company.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 mr-1">סיסמה</label>
                        <input
                            type="password"
                            required
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-inner"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-lg shadow-lg shadow-teal-500/20 hover:bg-teal-400 transform hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        התחבר למערכת
                        <span className="text-xl">🚀</span>
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        נתקלת בבעיה? <span className="text-teal-400 cursor-pointer hover:underline">צור קשר עם התמיכה</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;