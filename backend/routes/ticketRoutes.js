const express = require('express');
const ticketController = require('../controllers/ticketController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authenticateToken, ticketController.createTicket);
router.get('/all', authenticateToken, ticketController.getTickets);
router.get('/:id', authenticateToken, ticketController.getTicketById);
router.put('/:id', authenticateToken, ticketController.updateTicket);
router.delete('/:id', authenticateToken, ticketController.deleteTicket);

module.exports = router;