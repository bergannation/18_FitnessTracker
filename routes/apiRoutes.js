const Workout = require("../models/workout");

const router = require("express").Router();

router.get("/api/workouts", (req, res) => {
  Workout.find({})
    .then((dbWorkout) => {
      dbWorkout.forEach((workout) => {
        var total = 0;
        workout.exercises.forEach((e) => {
          total += e.duration;
        });
        workout.totalDuration = total;
      });
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

// ADD Exercise(s)
router.put("/api/workouts/:id", (req, res) => {
  Workout.findOneAndUpdate(
    { _id: req.params.id },
    {
      $inc: { totalDuration: req.body.duration },
      $push: { exercises: req.body },
    },
    { new: true }
  )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

// CREATE Workout
router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Show Workout Range
router.get("/api/workouts/range", async (req, res) => {
  try {
    const workouts = await Workout.aggregate([])
      .limit(7)
      .sort({ day: -1 })
      .addFields({ totalDuration: { $sum: "$exercises.duration" } });
    res.status(200).json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
