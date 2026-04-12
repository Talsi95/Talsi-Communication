import React, { useEffect, useState, useRef } from 'react';
import PackageCard from '../components/PackageCard';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import image_0 from '../assets/header_image.png';
import Loader from '../components/Loader';

const Home = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const packagesRef = useRef(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const token = localStorage.getItem('token');
                const endpoint = token ? '/packages' : '/packages/public';
                const { data } = await api.get(endpoint);
                setPackages(data);
            } catch (err) {
                console.error("Error fetching packages:", err);
                if (err.response) {
                    const { data } = await api.get('/packages/public');
                    setPackages(data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handlePackageSelect = (pkg) => {
        localStorage.setItem('selectedPackage', JSON.stringify(pkg));
        navigate('/wizard');
    };

    const scrollToPackages = () => {
        packagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-indigo-950 font-sans text-slate-100" dir="rtl">

            <div className="pt-20 pb-32 relative overflow-hidden">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                    <div className="text-center md:text-right">
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-sm">
                            תקשורת ללא <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">הגבלה</span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto md:mx-0">
                            חבילות חכמות, ללא אותיות קטנות. פשוט להתחבר וליהנות ממהירות שיא.
                        </p>
                        <button
                            onClick={scrollToPackages}
                            className="bg-teal-500 text-slate-900 px-10 py-4 rounded-full font-black text-lg shadow-xl shadow-teal-500/20 hover:bg-teal-400 transform hover:-translate-y-1 transition-all"
                        >
                            גלה חבילות
                        </button>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <img
                                src={image_0}
                                alt="Hero"
                                className="relative object-cover w-full h-auto max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main ref={packagesRef} className="max-w-6xl mx-auto py-20 px-6 
               bg-white/[0.02] backdrop-blur-3xl 
               rounded-t-[4rem] md:rounded-[4rem] 
               -mt-20 relative z-10 
               border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">

                <header className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">החבילות המשתלמות בשוק</h2>
                    <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full"></div>
                </header>

                {loading ? (
                    <Loader text="מתחברים לשרת, מיד מתחילים..." subtext="התחברות ראשונית עשויה לקחת כמה שניות" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {packages.map(pkg => (
                            <PackageCard key={pkg._id} pkg={pkg} onSelect={handlePackageSelect} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;