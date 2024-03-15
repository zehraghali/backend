const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');


// Get all events
router.get('/', auth, eventController.getEvents);

// Add a new event
router.post('/', auth, eventController.addEvent);

// Get a single event by ID
router.get('/:id', auth, eventController.getEvent);

// Delete an event by ID
router.delete('/:id', auth, eventController.deleteEvent);

// Update an event by ID
router.put('/:id', auth, eventController.updateEvent);

module.exports = router;
