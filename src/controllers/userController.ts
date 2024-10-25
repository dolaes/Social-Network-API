import { Request, Response } from 'express';
import { User, Thought } from "../models/index.js";

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'No user found with that ID' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.userId }, 
            req.body,
            { new: true, runValidators: true }
        );

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'No user found with that ID' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (user) {
            await Thought.deleteMany({ username: user.username });
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'No user found with that ID' });
        }

    } catch (err) {
        res.status(500).json(err);
    }
};

export const addFriend = async (req: Request, res: Response) => {
    try {
        const { userId, friendId } = req.params;

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { friends: friendId } },
            { runValidators: true, new: true }
        );

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'No user found with that ID' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const removeFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};