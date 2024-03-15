const Event = require('../models/eventModel');

// get all Events
const getEvents = async (req, res) => {
  const user_id = req.user._id

  try {
    const events = await Event.find({ user_id }).sort({ createdAt: -1 })
    res.status(200).json(events)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Add one Event
const addEvent = async (req, res) => {
  const { title, description, date, location } = req.body;

  try {
    const user_id = req.user._id;
    const newEvent = new Event({ title, description, date, location, user_id });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Get Event by ID
const getEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such event' });
  }

  try {
    const user_id = req.user._id;
    const event = await Event.findById(id).where('user_id').equals(user_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Delete Event by ID
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const event = await Event.findByIdAndDelete({ _id: id, user_id: user_id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Update Event by ID
const updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const event = await Event.findOneAndUpdate(
      { _id: id, user_id: user_id },
      { ...req.body },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = {
  getEvents,
  addEvent,
  getEvent,
  deleteEvent,
  updateEvent,
};
