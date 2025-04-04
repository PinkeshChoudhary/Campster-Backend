
const Contact = require('../models/contactSchema.js')
const express = require("express");
const router = express.Router();
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body
    const newMessage = new Contact({ name, email, message })
    await newMessage.save()
    res.status(200).json({ message: 'Message sent successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' })
  }
})

router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    res.status(200).json(messages)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Message resolved and deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' })
  }
})
module.exports = router
