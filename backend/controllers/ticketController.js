const Ticket = require('../models/ticket'); 

const createTicket = async (req, res) => {
    try {
         const { subject, category, priority } = req.body;

        // Validate required fields
       if (!subject || !category || !priority) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newTicket = new Ticket({
            subject,
            category,
            priority,
            createdBy: req.user.id 
        });

        await newTicket.save();

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: newTicket
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

 const getTickets = async (req, res) => {
    try {
let filter = {};

if (req.user.role !== 'admin') {
    filter.createdBy = req.user._id; // Only fetch tickets created by the user
}

        const tickets = await Ticket.find(filter).populate('createdBy', 'fullname email') // Populate createdBy field with user details;
        
    res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTicketById = async (req, res) => {
    try {
    const { id } = req.params;

    const ticketId = typeof id === 'object' ? id.id : id; // Handle both string and object ID formats
    
    const ticket = await Ticket.findById(ticketId).populate('createdBy', 'fullname email'); // Populate createdBy field with user details

    if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
    }

     // Check if user can access this ticket
        if (req.user.role !== 'admin' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

    res.status(200).json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ticket ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

 const updateTicket = async (req, res) => {
    try {
    const { id } = req.params;
    const { subject, category, priority } = req.body;

    const ticketId = typeof id === 'object' ? id.id : id; // Handle both string and object ID formats

    const existingTicket = await Ticket.findById(ticketId);

     if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

         // Check if user can update this ticket
        if (req.user.role !== 'admin' && ticket.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            { subject, category, priority },
            { new: true }
        );

        res.status(200).json({
            message: 'Ticket updated successfully',
            ticket: updatedTicket,
        });
    } catch (error) {
        console.error('Error updating ticket:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ticket ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTicket = async (req, res) => {
    try {
    const { id } = req.params;

    const ticketId = typeof id === 'object' ? id.id : id; 

    const ticket = await Ticket.findByIdAndDelete(ticketId);

        if (!ticket) {
         return res.status(404).json({ message: 'Ticket not found' });
        }
        
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ message: 'Server error' });
    }
};  

module.exports = {
    createTicket,   
    getTickets,
    getTicketById,
    updateTicket,
    deleteTicket
};

