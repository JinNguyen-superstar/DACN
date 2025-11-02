import { Router } from "express";
import {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    getInvoiceByNumber,
    updateInvoice,
    payInvoice,
    cancelInvoice,
    deleteAllInvoices,
    deleteInvoice,
} from "../controllers/invoiceController.js";

const router = Router();

// Create invoice
router.post("/", createInvoice);

// List invoices
router.get("/", getAllInvoices);

// Get by invoice number
router.get("/number/:number", getInvoiceByNumber);

// Get by invoice id
router.get("/:id", getInvoiceById);

// Update invoice (limited operations)
router.put("/:id", updateInvoice);

// Pay invoice
router.post("/:id/pay", payInvoice);

// Cancel invoice
router.post("/:id/cancel", cancelInvoice);

// Delete all (dev)
router.delete("/all", deleteAllInvoices);

// Delete one (permanent)
router.delete("/:id", deleteInvoice);

export default router;
