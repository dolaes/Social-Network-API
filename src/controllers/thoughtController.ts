import { Request, Response } from 'express';
import { User, Thought } from "../models/index.js";

export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getThoughtById = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });
        if (thought) {
            res.json(thought);
        } else {
            res.status(404).json({ message: 'No thought found with that ID' });
        }

    } catch (err) {
        res.status(500).json(err);
    }
};

export const createThought = async (req: Request, res: Response) => {
    try {
        const { userId, ...thoughtData } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'No user found with that ID' });
        }

        const thought = await Thought.create(thoughtData);

        await User.findByIdAndUpdate(
            userId,
            { $push: { thoughts: thought._id } },
            { new: true }
        );

        return res.json(thought);
    } catch (err) {
        return res.status(500).json(err);
    }
};

export const updateThought = async (req: Request, res: Response) => {
    try {        
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (thought) {
            res.json(thought);
        } else {
            res.status(404).json({ message: 'No thought found with that ID' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with that ID' });
        }

        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Thought deleted' });

    } catch (err) {
        return res.status(500).json(err);
    }
};

export const addReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $push: { reactions: req.body } },
            { new: true }
        );
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const removeReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
};
