const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema ({
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    
    category: {
        type: String,
        required: true,
        trim: true,
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        required: true,
        default: "Low"
    },
    
    status: {
        type: String,
        enum: ["Open", "InProgress", "Pending", "Resolved"],
    },

    userEmail: {
        type: String,
    },

    // Track who created the ticket
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    }
   },  {
        timestamps: true,
    },
);

module.exports = mongoose.model('Ticket', TicketSchema);

