const ticket = require('../models/ticket');
const Ticket = require('../models/ticket'); 
const User = require('../models/user');

const createTicket = async (req, res) => {
    try {
         const { subject, category, description, priority } = req.body;
         const createdBy = req.user._id;

        // Validate required fields
       if (!subject || !category || !priority || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const ticket = new Ticket({
            subject,
            description,
            category,
            priority,
            status: "Open",
            userEmail: req.user.email,
            createdBy
        });

        const savedTicket = await ticket.save();
        await savedTicket.populate('createdBy', 'name email');

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: savedTicket
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create ticket',
            error: error.message
        });
    }
};

// Get all tickets for admin
 const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('createdBy', 'name email').sort({ createdAt: -1});
        
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tickets",
            error: error.message
        });
    }

let filter = {};

if (req.user.role !== 'admin') {
    filter.createdBy = req.user._id; // Only fetch tickets created by the user
}

};


// Get user-specific tickets
const getUserTickets = async (req, res) => {
    try {
    const userId = req.params.userId || req.user._id;
    
    const tickets = await Ticket.find({ createdBy: userId }).populate('createdBy', 'name email').sort({ createdAt: -1 });
    
    if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
    }

     // Check if user can access this ticket
        if (req.user.role !== 'admin' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error fetching user tickets:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user tickets",
            error: error.message
        });
    }
};

// Update ticket status specifically
const updateTicketStatus = async (req, res) => {
    try {
   const { id, ticketId } = req.params;
   const actualId = id || ticketId;
   const { status } = req.body;

   // Validate status
   const validStatuses = ["Open", "InProgress", "Pending", "Resolved"];
   if (!validStatuses.includes(status)) {
    return res.status(400).json({
        success: false,
        message: "Invalid status value"
    });
   }

   const ticket = await Ticket.findById(actualId);
   if (!ticket) {
    return res.status(404).json({
        success: false,
        message: "Ticket not found"
    });
   }

   // Check if user can update this ticket
   if (req.user.role !== "admin" && ticket.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied "});
   }

   const updatedTicket = await Ticket.findByIdAndUpdate(actualId, 
    { status, updatedAt: new Date() },
    { new: true, runValidators: true}
   ).populate('createdBy', 'name email');

   res.status(200).json({
    success: true, 
    message: "Ticket status updated successfully",
    ticket: updatedTicket
   });
} catch (error) {
    console.error("Error updating", error);
}
}

// Update Ticket
 const updateTicket = async (req, res) => {
    try {
    const { id } = req.params;
    const updateData = req.body;

      // Check if user can update this ticket
        if (req.user.role !== 'admin' && ticket.createdBy !== req.user._id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        console.log('req.params:', req.params);
        console.log('req.user:', req.user);
         console.log('req.body:', req.body);


    
    const updatedTicket = await Ticket.findByIdAndUpdate(id, {
        ...updateData, updatedAt: new Date(),
    },
    {
        new: true, //Return the updated documet
        runValidators: true  // Run model validators
    }
).populate('createdBy', 'name email');

     if (!updateTicket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        res.status(200).json({success: true, message: "Ticket upfated successfully", ticket: updatedTicket});
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update ticket",
            error: error.message
        });

    }
};

const deleteTicket = async (req, res) => {
    try {
    const { id } = req.params;

    const deletedTicket = await Ticket.findByIdAndDelete(id);

        if (!deletedTicket) {
         return res.status(404).json({ success: false, message: 'Ticket not found' });
        }
        
        res.status(200).json({ success: true, message: 'Ticket deleted successfully', ticketId: id });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ message: 'Server error' });
    }
};  

module.exports = {
    createTicket,   
    getAllTickets,
    getUserTickets,
    updateTicketStatus,
    updateTicket,
    deleteTicket
};

