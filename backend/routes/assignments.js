const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get all assignments for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('course_id', req.params.courseId);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create an assignment (Admin and Teacher only)
router.post('/', [auth, roleCheck(['admin', 'teacher'])], async (req, res) => {
  const { course_id, title, description } = req.body;

  if(!course_id || !title || !description) {
    return res.status(400).json({ error: 'Course ID, title and description are required'});
  }

  try {
    const { data, error } = await supabase
      .from('assignments')
      .insert([{ course_id, title, description }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit an assignment (Student only)
router.post('/:assignmentId/submit', [auth, roleCheck(['student'])], async (req, res) => {
  const { content } = req.body;

  if(!content) {
    return res.status(400).json({ error: 'Content is required'});
  }

  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([{ assignment_id: req.params.assignmentId, user_id: req.user.id, content }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
