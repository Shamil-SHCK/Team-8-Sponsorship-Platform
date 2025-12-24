import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logoutUser, getEvents } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import EventFeed from './EventFeed';
import { Heart, History, Award } from 'lucide-react';

const AlumniDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalContributed: 0,
        eventsSupported: 0,
        impactBadges: 0
    });
    const navigate = useNavigate();

    const fetchDashboardData = useCallback(async () => {
        try {
            const userData = await getCurrentUser();
            if (userData.role !== 'alumni-individual') {
                navigate('/login');
                return;
            }
            setUser(userData);

            // Fetch Stats
            const allEvents = await getEvents();
            let invested = 0;
            let active = 0;

            allEvents.forEach(event => {
                const mySponsorships = event.sponsors?.filter(s => {
                    const sId = s.sponsor?._id || s.sponsor;
                    return sId === userData._id;
                }) || [];

                if (mySponsorships.length > 0) {
                    active++;
                    mySponsorships.forEach(s => invested += s.amount);
                }
            });

            setStats({
                totalContributed: invested,
                eventsSupported: active,
                impactBadges: Math.floor(invested / 5000)
            });

        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            logoutUser();
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <DashboardLayout user={user}>
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold font-heading text-slate-900 mb-2">
                        Alumni <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Space</span>
                    </h1>
                    <p className="text-slate-500 text-lg">Support your alma mater and students.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-amber-100 text-amber-700 border-amber-200">
                    Alumni / Individual
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">₹{stats.totalContributed.toLocaleString()}</h3>
                    <p className="text-slate-500 font-medium text-sm">Total Contributed</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                        <History className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.eventsSupported}</h3>
                    <p className="text-slate-500 font-medium text-sm">Events Supported</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                        <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.impactBadges}</h3>
                    <p className="text-slate-500 font-medium text-sm">Impact Badges</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6">Support <span className="text-rose-600">Causes</span></h2>
                <EventFeed userType="alumni" onSponsorshipSuccess={fetchDashboardData} />
            </div>
        </DashboardLayout>
    );
};

export default AlumniDashboard;
