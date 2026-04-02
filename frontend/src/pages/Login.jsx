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

            // שמירת נתונים מקומית
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userRole', data.role);

            // חזרה לדף הבית - עכשיו יופיעו החבילות המיוחדות
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה בהתחברות');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900">כניסת סוכנים</h2>
                    <p className="text-gray-500 mt-2">הזן פרטים כדי לגשת לחבילות ה-VIP</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center font-bold">{error}</div>}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">אימייל</label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="name@company.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">סיסמה</label>
                        <input
                            type="password"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all"
                    >
                        התחבר למערכת
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;