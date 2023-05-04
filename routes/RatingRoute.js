const RatingRoute = require("express").Router();
const Rating = require("../models/RatingsSchema");
const asyncHandler = require("express-async-handler");
const verify = require("../middleware/verify")

RatingRoute.post(
  "/rating/create_rating",
  asyncHandler(async (req, res) => {
    const { ratingCreatedBy, ratedTo, ratingCommentary } = req.body;

    if (!ratingCreatedBy || !ratedTo || !ratingCommentary)
      res.json({ msg: "fields cannot be blank" });

    const rating = await Rating.create({
      ratingCreatedBy,
      ratedTo,
      ratingCommentary,
    });

    res.json({ rating });
  })
);

RatingRoute.get(
  "/rating/show_all",
  asyncHandler(async (req, res) => {
    const ratings = await Rating.find();

    res.json({ ratings });
  })
);


RatingRoute.get("/rating/show_rated_to", verify, asyncHandler(async(req, res) => {



const rating = await Rating.findOne({ratedTo: req.user.id })

res.json({rating})



})
 )

module.exports = RatingRoute;
