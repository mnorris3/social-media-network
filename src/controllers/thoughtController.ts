import { IReaction } from "../models/Reaction.js";
import { Thought, User } from "../models/index.js";
import { Request, Response } from "express";

// TODO: Create an aggregate function to get the number of students overall

/**
 * GET All Students /students
 * @returns an array of Students
 */
export const getAllThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();

    res.json(thoughts);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET Student based on id /students/:id
 * @param string id
 * @returns a single Student object
 */
export const getThoughtById = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;
  try {
    const student = await Thought.findById(thoughtId);

    res.json(student);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * POST Student /students
 * @param object student
 * @returns a single Student object
 */

export const createThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.create(req.body);
    const thoughtId = thought._id;
    const username = thought.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(500).json({
        message: "User not found",
      });
    }

    user.thoughts.push(thoughtId);

    await user.save();

    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);
  }
};
/**
 * DELETE Student based on id /students/:id
 * @param string id
 * @returns string
 */

export const deleteThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findOneAndDelete({
      _id: req.params.thoughtId,
    });

    if (!thought) {
      return res.status(404).json({ message: "No such thought exists" });
    }

    return res.json({ message: "Thought successfully deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

/**
 * POST Assignment based on /students/:studentId/assignments
 * @param string id
 * @param object assignment
 * @returns object student
 */

export const addReaction = async (req: Request, res: Response) => {
  try {
    const { thoughtId } = req.params;

    const { reactionBody, username } = req.body;

    const thought = await Thought.findById(thoughtId);

    const reaction = <IReaction>{ reactionBody, username };

    if (!thought) {
      return res.status(404).json({
        message: "No thought found",
      });
    } else {
      thought.reactions.push(reaction);

      await thought.save();

      return res.json({ message: "Reaction added!" });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * DELETE Assignment based on /students/:studentId/assignments
 * @param string assignmentId
 * @param string studentId
 * @returns object student
 */

export const removeReaction = async (req: Request, res: Response) => {
  // console.log("hello");

  try {
    const { thoughtId, reactionId } = req.params;

    const thought = await Thought.findByIdAndUpdate(
      { _id: thoughtId },
      { $pull: { reactions: { reactionId } } },
      { new: true }
    );

    console.log(thought);

    if (!thought) {
      return res.status(404).json({
        message: "Thought not found",
      });
    } else {
      await thought.save();

      return res.json({ message: "Reaction removed." });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
