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

    // Track who created the ticket
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
   },  {
        timestamps: true,
    },
);

module.exports = mongoose.model('Ticket', TicketSchema);

