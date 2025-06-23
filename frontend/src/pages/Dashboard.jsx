import React from 'react';
import Sidebar from '../components/AdminSidebar';
import TicketStats from './TicketStats';
import '../styles/Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
        <Sidebar />
        <TicketStats />
        </div>
    )
};

export default Dashboard;