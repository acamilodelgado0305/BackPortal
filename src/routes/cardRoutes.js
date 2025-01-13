import express from 'express';
const router = express.Router();
import * as cardController from "../controllers/cardController.js";

router.post('/cards', cardController.createCardHandler);
router.get('/user/:userId', cardController.getCardsByUserHandler);
router.put('/cards/:id', cardController.updateCardHandler);
router.delete('/cards/:id', cardController.deleteCardHandler);

export default router;
