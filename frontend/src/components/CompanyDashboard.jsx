import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logoutUser, getEvents } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import EventFeed from './EventFeed';
import { Briefcase, CheckCircle, Search, TrendingUp } from 'lucide-react';

const CompanyDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeSponsorships: 0,
        clubsSupported: 0,
        totalInvested: 0
    });
    const navigate = useNavigate();

    const fetchDashboardData = useCallback(async () => {
        try {
            const userData = await getCurrentUser();
            if (userData.role !== 'company') {
                navigate('/login');
                return;
            }
            setUser(userData);

            // Fetch Stats
            const allEvents = await getEvents();
            let invested = 0;
            let active = 0;
            const clubs = new Set();

            allEvents.forEach(event => {
                const mySponsorships = event.sponsors?.filter(s => {
                    const sId = s.sponsor?._id || s.sponsor;
                    return sId === userData._id;
                }) || [];

                if (mySponsorships.length > 0) {
                    active++;
                    if (event.organizer) {
                        const clubId = event.organizer._id || event.organizer;
                        clubs.add(clubId);
                    }
                    mySponsorships.forEach(s => invested += s.amount);
                }
            });

            setStats({
                activeSponsorships: active,
                clubsSupported: clubs.size,
                totalInvested: invested
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
                        Company <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Portal</span>
                    </h1>
                    <p className="text-slate-500 text-lg">Find events and manage sponsorships.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/company/create-gig')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center"
                    >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Post Gig
                    </button>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-blue-100 text-blue-700 border-blue-200 flex items-center">
                        Company
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.activeSponsorships}</h3>
                    <p className="text-slate-500 font-medium text-sm">Active Sponsorships</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.clubsSupported}</h3>
                    <p className="text-slate-500 font-medium text-sm">Clubs Supported</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">₹{stats.totalInvested.toLocaleString()}</h3>
                    <p className="text-slate-500 font-medium text-sm">Total Invested</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6">Explore <span className="text-blue-600">Events</span></h2>
                <EventFeed userType="company" onSponsorshipSuccess={fetchDashboardData} />
            </div>
        </DashboardLayout>
    );
};

export default CompanyDashboard;
