import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PackageCard from '../components/PackageCard';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        // שמירת החבילה הנבחרת והעברה ל-Wizard
        localStorage.setItem('selectedPackage', JSON.stringify(pkg));
        navigate('/wizard');
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <main className="max-w-6xl mx-auto py-16 px-6">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">החבילות הכי משתלמות בשוק</h1>
                    <p className="text-gray-500 text-lg">בחר את המסלול המתאים לך והתחבר תוך דקות</p>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-medium">טוען חבילות...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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