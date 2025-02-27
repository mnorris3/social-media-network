import { Request, Response } from "express";
import { User } from "../models/index.js";

/**
 * GET All Courses /courses
 * @returns an array of Courses
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET Course based on id /course/:id
 * @param string id
 * @returns a single Course object
 */
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * POST Course /courses
 * @param object name, inPerson, students
 * @returns a single Course object
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { username, email } = req.body;
    const newUser = await User.create({
      username,
      email,
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    console.log(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * PUT Course based on id /courses/:id
 * @param object id, username
 * @returns a single Course object
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!user) {
      res.status(404).json({ message: "No course with this id!" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * DELETE Course based on id /courses/:id
 * @param string id
 * @returns string
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      res.status(404).json({
        message: "No user with that ID",
      });
    } else {
      await User.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and Thoughts deleted!" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addFriend = async (req: Request, res: Response) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      user.friends.push(friendId);

      res.json({ message: "Friend added!" });

      await user.save();
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteFriend = async (req: Request, res: Response) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { friends: friendId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.save();

    return res.json({ message: "Friend removed." });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
