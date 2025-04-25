// backend/routes/blogRoutes.js
const express = require('express')
const Blog = require('../models/blog')
const upload = require('../config/multerg');
const router = express.Router()

// Prepare up to N images (extend as needed)
// const fieldArray = Array.from({ length: 10 }, (_, i) => ({ name: `blocks[${i}][file]` }));

// Route to create a new blog
router.post('/add', upload.any(), async (req, res) => {
  console.log('🔑 Request body:', req.body);
  console.log('📂 Request files:', req.files);

  try {
    const { title, blocks } = req.body;

    // If blocks is an array, process each block directly
    const processedBlocks = blocks.map((block, index) => {
      const { type, content } = block;

      if (type === 'image') {
        const imageFile = req.files.find(f => f.fieldname === `blocks[${index}][file]`);
        const imageUrl = imageFile ? imageFile.path : '';
        
        return { type: 'image', content: imageUrl };
      } else {
        // For other block types like 'heading', 'text', etc.
        return { type, content };
      }
    });

    console.log('📝 Final blocks array:', processedBlocks);

    // Save blog to DB
    const blog = new Blog({ title, blocks: processedBlocks });
    await blog.save();

    res.status(201).json({ message: '✅ Blog saved!', blog });
  } catch (err) {
    console.error('Error in createBlog:', err);
    res.status(500).json({ message: '❌ Error saving blog', error: err.message });
  }
});



// Route to get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
    res.status(200).json(blogs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch blogs' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await Blog.findById(id);
    if (!blogs) {
      return res.status(404).json({ message: 'blog not found' });
    }
    res.json(blogs);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch blogs' })
  }
})

module.exports = router