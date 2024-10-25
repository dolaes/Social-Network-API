import { Router } from 'express';
const router = Router();

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} from '../../controllers/userController.js';

router.route('/').get(getAllUsers).post(createUser);
router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);
export { router as userRouter };

