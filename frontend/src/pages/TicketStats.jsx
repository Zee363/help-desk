import React from "react";
import '../styles/TicketStats.css'; 

const TicketStats = () => {
    return (
        <div className="ticket-stats">
            <div className="headings">
            <h3>HelpDesk Pro</h3> 
            <h3 className="second-heading">Admin Dashboard</h3>
            </div>
            <div className="ticket-info">
          <div className="total">
            <h4>Total</h4>
            <p>150</p>
        </div>
            <div className="open">
                <h4>Open</h4>
                <p>75</p>
            </div>
            <div className="in-progress">
                <h4>In Progress</h4>
                <p>25</p>
            </div>
            <div className="pending">
                <h4>Pending</h4>
                <p>25</p>
            </div>
            <div className="resolved">
            <h4>Resolved</h4>
                <p>50</p>
            </div>
            </div>

            <h2>Admin Ticket Dashboard</h2>
           <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Date Created</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#001</td>
            <td>Login issue</td>
            <td>Open</td>
            <td>High</td>
            <td>2025-06-01</td>
            <td>Technical</td>
          </tr>
          <tr>
            <td>#002</td>
            <td>Cannot reset password</td>
            <td>Pending</td>
            <td>Medium</td>
            <td>2025-06-02</td>
            <td>Technical</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
</div>
    );
};

export default TicketStats;