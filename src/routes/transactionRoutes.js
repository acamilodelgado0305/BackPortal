import express from "express";
import * as transactionController from "../controllers/TransactionController.js";

const router = express.Router();

// api/transactions
router.post("/", transactionController.createTransactionHandler);
router.get("/", transactionController.getAllTransactionsHandler);
router.get("/studentId/:studentId", transactionController.getTransactionsByStudentIdHandler);
router.get("/teacherId/:teacherId", transactionController.getTransactionsByTeacherIdHandler);
router.get("/:id", transactionController.getTransactionByIdHandler);
router.delete("/:id", transactionController.deleteTransactionByIdHandler);

export default router;
