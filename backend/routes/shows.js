const express = require("express");
const router = express.Router();
const Show = require("../models/Show");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const search = req.query.search ? req.query.search.trim() : "";
    const type = req.query.type ? req.query.type.trim() : "";

    const pipeline = [];

    const userAge = req.user.age;

    if (userAge < 18) {
      pipeline.push({
        $match: {
          rating: { $ne: "R" },
        },
      });
    }

    if (type === "Movie" || type === "TV Show") {
      pipeline.push({
        $match: {
          type,
        },
      });
    }

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { cast: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    
    pipeline.push({
      $addFields: {
        parsedDate: {
          $dateFromString: {
            dateString: "$date_added",
          },
        },
      },
    });

    
    pipeline.push({
      $sort: {
        parsedDate: -1,
      },
    });

    const skip = (page - 1) * limit;

    pipeline.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    });

    const aggregationResult = await Show.aggregate(pipeline);

    const shows = aggregationResult[0]?.data || [];
    const total = aggregationResult[0]?.total?.[0]?.count || 0;

    res.json({
      data: shows,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({ error: "something went wrong" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({ error: "not found" });
    }

    const userAge = req.user.age;
    if (userAge < 18 && show.rating === "R") {
      return res.status(403).json({ error: "age-restricted content" });
    }

    res.json(show);
  } catch (error) {
    console.error("Error fetching show detail:", error);
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = router;
