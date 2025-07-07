const express = require('express');
const ticketController = require('../controllers/ticketController');
const { authenticateToken, requireAdmin, filterByUserRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authenticateToken, ticketController.createTicket);
router.get('/all', authenticateToken, ticketController.getAllTickets);
router.get('/user-tickets/:userId', authenticateToken, ticketController.getUserTickets);
router.patch('/:id/status', authenticateToken, ticketController.updateTicketStatus);
router.put('/:id', authenticateToken, ticketController.updateTicket);
router.delete('/:id', authenticateToken, ticketController.deleteTicket);

module.exports = router;