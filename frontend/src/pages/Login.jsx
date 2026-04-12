import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userId', data._id);
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

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-300 mb-2 mr-1">סיסמה</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-inner"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500 transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88l-3.29-3.29m7.53 7.53l3.29 3.29M3 3l18 18M10.37 4.37a9 9 0 0 1 10.63 10.63M21 12a9 9 0 0 1-15.63 6.37m-2.48-2.48A9 9 0 0 1 3 12c0-1.29.27-2.53.75-3.65" /><path d="M12 8a4 4 0 0 1 4 4c0 .42-.07.83-.19 1.21m-1.6 1.6A4 4 0 0 1 12 16c-.42 0-.83-.07-1.21-.19" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                )}
                            </button>
                        </div>
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