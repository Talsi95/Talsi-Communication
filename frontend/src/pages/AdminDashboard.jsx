import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        const { data } = await api.get('/admin/agents');
        setAgents(data);
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
        await api.patch(`/admin/agents/${id}/status`, { status: newStatus });
        fetchAgents(); // רענון הרשימה
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
            <h1 className="text-3xl font-black mb-8">ניהול סוכנים במערכת</h1>

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-right">
                    <thead className="bg-gray-900 text-white">
                        <tr>
                            <th className="p-4">שם סוכן</th>
                            <th className="p-4">אימייל</th>
                            <th className="p-4">סטטוס</th>
                            <th className="p-4">פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map(agent => (
                            <tr key={agent._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-bold">{agent.name}</td>
                                <td className="p-4">{agent.email}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${agent.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {agent.status === 'Active' ? 'פעיל' : 'חסום'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleStatus(agent._id, agent.status)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition ${agent.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
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
    );
};

export default AdminDashboard;