const CityChat = require('../models/CommunityChat.js')

// Get all messages in a city
 const getMessagesByCity = async (req, res) => {
  try {
    const messages = await CityChat.find({ city: req.params.city }).sort({ createdAt: -1 })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
}

// Send a new top-level message
 const sendMessage = async (req, res) => {
  const { city, userId, username, message } = req.body
  try {
    console.info("send message", city, userId, username, message )
    const newMsg = new CityChat({ city, userId, username, message, replies: [] })
    await newMsg.save()
    res.status(201).json(newMsg)
  } catch (err) {
    res.status(500).json({ error: 'Failed is it ok to send message' })
  }
}

// ✅ Anyone can reply to any top-level message
 const replyToMessage = async (req, res) => {
  const { userId, username, message } = req.body
  const { messageId } = req.params

  try {
    const originalMsg = await CityChat.findById(messageId)
    if (!originalMsg) return res.status(404).json({ error: 'Message not found' })

    const reply = { message, userId, username }
    originalMsg.replies.push(reply)
    await originalMsg.save()

    res.status(201).json(reply)
  } catch (err) {
    res.status(500).json({ error: 'Reply failed' })
  }
}

module.exports = { getMessagesByCity, sendMessage, replyToMessage,  };

