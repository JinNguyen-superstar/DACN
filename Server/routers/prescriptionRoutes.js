import { Router } from "express";
import {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription,
} from "../controllers/prescriptionController.js";

const router = Router();

// Create
router.post("/", createPrescription);

// List
router.get("/", getAllPrescriptions);

// Get by id
router.get("/:id", getPrescriptionById);

// Update
router.put("/:id", updatePrescription);

// Delete
router.delete("/:id", deletePrescription);

export default router;
