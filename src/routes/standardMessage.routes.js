import express from 'express';
import * as StandardMessageController from '../controllers/standardMessageController.js';

const router = express.Router();

router.post("/", StandardMessageController.createStandardMessage);
router.get("/:id", StandardMessageController.getStandardMessageById);
router.get("/chatId/:chatId",StandardMessageController.getStandardMessagesByChatId)
router.put("/:id", StandardMessageController.updateStandardMessage)
router.delete("/:id", StandardMessageController.deleteStandardMessageById);

export default router;