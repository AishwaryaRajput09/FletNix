const express = require('express');
const router = express.Router();
const Show = require('../models/Show');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const search = req.query.search ? req.query.search.trim() : '';
    const type = req.query.type ? req.query.type.trim() : '';

    const query = {};

    const userAge = req.user.age;
    if (userAge < 18) {
      query.rating = { $ne: 'R' };
    }

    if (type === 'Movie' || type === 'TV Show') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { cast: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [shows, total] = await Promise.all([
      Show.find(query)
        .skip(skip)
        .limit(limit)
        .lean(),
      Show.countDocuments(query)
    ]);

    res.json({
      data: shows,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    
    if (!show) {
      return res.status(404).json({ error: 'Show not found.' });
    }

    const userAge = req.user.age;
    if (userAge < 18 && show.rating === 'R') {
      return res.status(403).json({ error: 'Access Denied. You must be 18 or older to view this R-rated content.' });
    }

    res.json(show);
  } catch (error) {
    console.error('Error fetching show detail:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
