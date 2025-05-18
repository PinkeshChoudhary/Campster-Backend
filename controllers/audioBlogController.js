const AudioStory = require('../models/audioStory');

const uploadAudioStory = async (req, res) => {
  try {
    const { title, description, category, coverImageUrl, uploadedBy } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Audio file is required' });

    const newStory = new AudioStory({
      title,
      description,
      category,
      coverImageUrl,
      audioUrl: req.file.path,
      uploadedBy,
    });

    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAudioStories = async (req, res) => {
  try {
    const stories = await AudioStory.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingleAudioStory = async (req, res) => {
  try {
    const story = await AudioStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAudioStory = async (req, res) => {
  try {
    await AudioStory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadAudioStory,
  getAudioStories,
  getSingleAudioStory,
  deleteAudioStory,
};