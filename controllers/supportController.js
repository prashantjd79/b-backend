const Support = require('../models/Support');

exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const ticket = new Support({
      userId: req.user.id,
      subject,
      message,
    });

    await ticket.save();
    res.status(201).json({ message: 'Support ticket created successfully', ticket });
  } catch (error) {
    res.status(500).json({ error: 'Error creating ticket' });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Support.find({ userId: req.user.id });
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving tickets' });
  }
};
