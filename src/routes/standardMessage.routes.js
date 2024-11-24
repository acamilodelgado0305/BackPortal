import express from 'express';
import * as StandardMessageController from '../controllers/standardMessageController.js';

const router = express.Router();

router.post("/", StandardMessageController.createStandardMessage);
router.get("/:id", StandardMessageController.getStandardMessageById);
router.get("/chatId/:chatId",StandardMessageController.getStandardMessagesByChatId);
router.get("/userId/:userId", StandardMessageController.getStandardsMessagesChatsByUserId);
router.put("/:id", StandardMessageController.updateStandardMessage);
router.delete("/:id", StandardMessageController.deleteStandardMessageById);
router.delete("/chatId/:chatId", StandardMessageController.deleteStandardMessagesByChatId);

export default router;