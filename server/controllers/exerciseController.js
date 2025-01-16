import Exercise from '../models/exerciseModel.js';
import mongoose from 'mongoose';

const exerciseController = {};

exerciseController.getLatestExerciseForAllTypes = async (req, res) => {
  try {
    // const userId = req.userId; // Assuming userId is attached by the authenticate middleware
    const userId = new mongoose.Types.ObjectId(req.userId); // Convert to ObjectId
    console.log('Fetching exercises for userId:', userId);

    const exercises = await Exercise.aggregate([
      { $match: { userId } }, // Filter by userId
      { $sort: { type: 1, date: -1 } }, // Sort by type (A-Z) and date (latest first)
      {
        $group: {
          _id: '$type', // Group by type
          latestExercise: { $first: '$$ROOT' }, // Select the first document in each group
        },
      },
      {
        $project: {
          'latestExercise.__v': 0, // Exclude the __v field from the latestExercise
        },
      },
    ]);

    console.log(
      `getLatestExerciseForAllTypes for userID ${req.userId}`,
      exercises
    );
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error fetching grouped exercises:', error);
    res.status(500).json({ message: 'Failed to fetch grouped exercises' });
  }
};

exerciseController.getAllExercisesByType = async (req, res) => {
  const { type } = req.params;
  try {
    console.log('Fetching exercises for type:', type);

    const exercises = await Exercise.find({ type, userId: req.userId }).sort({
      date: -1,
    });

    console.log(
      `getAllExercisesByType of type ${type} userID ${req.userId}`,
      exercises
    );
    res.status(200).json(exercises);
  } catch (error) {
    console.error(`error fetching all ${type}`, error);
    res.status(500).json({ message: `Failed to fetch all ${type} exercises` });
  }
};
exerciseController.createExercise = async (req, res) => {
  try {
    const { type, distance, duration, date, caloriesBurned } = req.body;
    console.log(
      'in createExercise',
      {
        type,
        distance,
        duration,
        date,
        caloriesBurned,
      },
      req.userId
    );

    // Validate required fields
    if (!type || !duration) {
      return res.status(400).json({ error: 'Type and duration are required' });
    }
    // Create new exercise
    const exercise = await Exercise.create({
      type,
      distance,
      duration,
      date,
      caloriesBurned,
      // userId: req.userId,
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    res
      .status(201)
      .json({ message: 'Exercise created successfully', exercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
};

exerciseController.updateExercise = async (req, res) => {
  const { id } = req.params;
  const { type, distance, duration, date, caloriesBurned } = req.body;
  console.log('in updateExercise: ', id, {
    type,
    distance,
    duration,
    date,
    caloriesBurned,
  });
  try {
    // Validate required fields
    if (!type || !duration) {
      return res.status(400).json({ error: 'Type and duration are required' });
    }
    const exerciseUpdated = await Exercise.findByIdAndUpdate(
      id,
      { type, distance, duration, date, caloriesBurned },
      { new: true }
    );
    if (!exerciseUpdated) {
      res.status(404).json({ error: 'Failed to Update exercise' });
    }
    res.status(200).json('Exercise is updated successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to Update exercise' });
  }
};

exerciseController.deleteExercise = async (req, res) => {
  const { id } = req.params;
  console.log('in deleteExercise: ', id);

  try {
    const exerciseDeleted = await Exercise.findByIdAndDelete(id);
    if (!exerciseDeleted) {
      res.status(404).json({ error: 'Failed to delete exercise' });
    }
    res.status(200).json('Exercise is delete successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
};
export default exerciseController;
