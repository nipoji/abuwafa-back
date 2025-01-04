// activityControllers.js
const Activity = require('./activity');

const createActivity = async (req, res) => {
  try {
    const { quality, activities, duration, notes } = req.body;
    const userId = req.user.id;  // Get userId from the token

    if (quality === undefined || activities === undefined || duration === undefined) {
      return res.status(400).send({
        error: true,
        message: 'Quality, activities, and duration are required'
      });
    }

    if (isNaN(quality) || isNaN(duration)) {

      return res.status(400).send({

        error: true,

        message: 'Quality and duration must be numbers'

      });

    }

    const activity = new Activity(userId, quality, activities, duration, notes);
    await activity.save();

    return res.status(201).send({
      error: false,
      message: 'Activity created successfully',
      id: activity.id  // Return only the id
    });
  } catch (error) {
    console.error("Error creating activity:", error.message);
    return res.status(500).send({
      error: true,
      message: 'Internal server error'
    });
  }
};

const getActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id;  // Get userId from the token
    const activity = await Activity.get(userId, activityId);
    if (!activity) {
      return res.status(404).send({
        error: true,
        message: 'Activity not found'
      });
    }
    const { time_stamp, time, quality, activities, duration, notes } = activity;
    return res.send({
      error: false,
      message: 'Activity fetched successfully',
      activity: {
        time,
        time_stamp,
        quality,
        activities,
        duration,
        notes
      }
    });
  } catch (error) {
    console.error("Error fetching activity:", error.message);
    return res.status(500).send({
      error: true,
      message: 'Internal server error'
    });
  }
};

const listActivities = async (req, res) => {
  try {
    const userId = req.user.id;  // Get userId from the token
    const activities = await Activity.list(userId);
    activities.sort((a, b) => {
      if (a.time_stamp === b.time_stamp) {
        return new Date(`1970-01-01T${b.time}Z`) - new Date(`1970-01-01T${a.time}Z`);
      }
      return new Date(b.time_stamp) - new Date(a.time_stamp);
    });
    return res.send({
      error: false,
      message: 'Activities fetched successfully',
      activities: activities.map(activity => ({
        id: activity.id,
        time: activity.time,
        time_stamp: activity.time_stamp,
        quality: activity.quality,
        activities: activity.activities,
        duration: activity.duration,
        notes: activity.notes
      }))
    });
  } catch (error) {
    console.error("Error listing activities:", error.message);
    return res.status(500).send({
      error: true,
      message: 'Internal server error'
    });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id;  // Get userId from the token
    const updates = req.body;

    if (updates.quality !== undefined && isNaN(updates.quality)) {

      return res.status(400).send({

        error: true,

        message: 'Quality must be a number'

      });

    }

    if (updates.duration !== undefined && isNaN(updates.duration)) {

      return res.status(400).send({

        error: true,

        message: 'Duration must be a number'

      });

    }

    await Activity.update(userId, activityId, updates);
    return res.send({
      error: false,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error("Error updating activity:", error.message);
    return res.status(500).send({
      error: true,
      message: 'Internal server error'
    });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id;  // Get userId from the token
    await Activity.delete(userId, activityId);
    return res.send({
      error: false,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting activity:", error.message);
    return res.status(500).send({
      error: true,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createActivity,
  getActivity,
  listActivities,
  updateActivity,
  deleteActivity
};
