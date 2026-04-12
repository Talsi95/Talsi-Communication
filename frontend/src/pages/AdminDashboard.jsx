import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, ShoppingBag, Calendar, User, Phone, CheckCircle, Ban, ArrowLeft } from 'lucide-react';
import Loader from '../components/Loader';

const AdminDashboard = () => {
    const [agents, setAgents] = useState([]);
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [agentsRes, appsRes] = await Promise.all([
                api.get('/admin/agents'),
                api.get('/applications/all')
            ]);
            setAgents(agentsRes.data);
            setApplications(appsRes.data);
        } catch (err) {
            console.error("Error fetching admin data", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
        await api.patch(`/admin/agents/${id}/status`, { status: newStatus });
        fetchData();
    };

    if (loading) return <Loader text=' טוען נתונים...' />

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans" dir="rtl">
            <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">לוח בקרה אדמין</h1>
                    <p className="text-gray-500 font-medium">ניהול סוכנים והזמנות נכנסות בזמן אמת</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20' : 'text-gray-400 hover:text-white'}`}
                    >
                        <ShoppingBag size={18} />
                        הזמנות
                    </button>
                    <button
                        onClick={() => setActiveTab('agents')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'agents' ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Users size={18} />
                        סוכנים
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {activeTab === 'orders' ? (
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="p-6 text-gray-400 font-black uppercase text-xs tracking-widest">לקוח (שם, ת"ז, מייל)</th>
                                        <th className="p-6 text-gray-400 font-black uppercase text-xs tracking-widest">פירוט קווים וחבילות</th>
                                        <th className="p-6 text-gray-400 font-black uppercase text-xs tracking-widest">סה"כ</th>
                                        <th className="p-6 text-gray-400 font-black uppercase text-xs tracking-widest">תאריך</th>
                                        <th className="p-6 text-gray-400 font-black uppercase text-xs tracking-widest">מקור</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr key={app._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                            <td className="p-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-lg text-white group-hover:text-teal-400 transition-colors">
                                                        {app.fullName}
                                                    </span>
                                                    <span className="text-gray-400 text-sm font-mono">ת"ז: {app.idNumber}</span>
                                                    <span className="text-gray-500 text-xs italic">{app.email}</span>
                                                    <span className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                                        <Phone size={12} /> {app.phone}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="p-6">
                                                <div className="flex flex-col gap-2">
                                                    {app.lines?.map((line, index) => (
                                                        <div key={index} className="bg-white/5 p-2 rounded-lg border border-white/5 text-sm">
                                                            <div className="flex justify-between items-center gap-4">
                                                                <span className="font-mono font-bold text-teal-400">{line.phoneNumber}</span>
                                                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${line.type === 'new' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                                    {line.type === 'new' ? 'חדש' : 'ניוד'}
                                                                </span>
                                                            </div>
                                                            <div className="text-gray-400 text-xs mt-1">
                                                                חבילה: <span className="text-white">{line.package?.name || 'לא ידוע'}</span>
                                                            </div>
                                                            <div className="text-gray-400 text-xs mt-1">
                                                                מחיר: <span className="text-white">{line.package?.price || 'לא ידוע'}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="p-6">
                                                <span className="text-xl font-black text-white">₪{app.totalAmount}</span>
                                            </td>

                                            <td className="p-6 text-gray-400 text-sm font-medium">
                                                {new Date(app.createdAt).toLocaleDateString('he-IL')}
                                            </td>

                                            <td className="p-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${app.source === 'web'
                                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                        }`}>
                                                        {app.source === 'web' ? 'אתר (B2C)' : 'סוכן (B2B)'}
                                                    </span>
                                                    <span className="text-xs text-gray-400 mr-1">
                                                        {app.agentId ? app.agentId.name : 'מערכת אוטומטית'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="p-6 text-gray-400 font-black uppercase text-xs tracking-widest">סוכן</th>
                                        <th className="p-6 text-gray-400 font-black uppercase text-xs tracking-widest">סטטוס</th>
                                        <th className="p-6 text-gray-400 font-black uppercase text-xs tracking-widest">פעולות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agents.map(agent => (
                                        <tr key={agent._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20">
                                                        <User className="text-teal-400" size={20} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white">{agent.name}</span>
                                                        <span className="text-gray-500 text-sm">{agent.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${agent.status === 'Active' ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {agent.status === 'Active' ? <CheckCircle size={12} /> : <Ban size={12} />}
                                                    {agent.status === 'Active' ? 'פעיל' : 'חסום'}
                                                </span>
                                            </td>
                                            <td className="p-6 text-left">
                                                <button
                                                    onClick={() => toggleStatus(agent._id, agent.status)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${agent.status === 'Active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20'}`}
                                                >
                                                    {agent.status === 'Active' ? 'חסום סוכן' : 'שחרר חסימה'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;