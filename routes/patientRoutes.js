import express from 'express';
import {
    addNewPatient,
    deletePatient,
    getOnePatient,
    getPatients,
    updatePatient,
} from '../controllers/patientController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

export const patientRoutes = express.Router();

patientRoutes
    .route('/')
    .post(checkAuth, addNewPatient)
    .get(checkAuth, getPatients);

patientRoutes
    .route('/:id')
    .get(checkAuth, getOnePatient)
    .put(checkAuth, updatePatient)
    .delete(checkAuth, deletePatient);
