const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get all courses
router.get('/', [auth], async (req, res) => {
  try {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a course (Admin and Teacher only)
router.post('/', [auth, roleCheck(['admin', 'teacher'])], async (req, res) => {
    const { name, description } = req.body;

    if(!name || !description) {
        return res.status(400).json({ error: 'Name and description are required'});
    }
  try {
    const { data, error } = await supabase.from('courses').insert([{ name, description, teacher_id: req.user.id }]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ... other course routes (get by id, update, delete)

module.exports = router;
