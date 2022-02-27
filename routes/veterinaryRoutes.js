import express from 'express';
import {
    autenticate,
    chooseNewPassword,
    confirmAccount,
    passwordReset,
    profile,
    register,
    verifyToken,
    upadateProfile,
    updatePassword
} from '../controllers/veterinaryController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

export const veterinaryRoutes = express.Router();

// Public Routes
veterinaryRoutes.post('/', register);

veterinaryRoutes.get('/confirm/:token', confirmAccount);

veterinaryRoutes.post('/login', autenticate);

veterinaryRoutes.post('/password-reset', passwordReset);

veterinaryRoutes
    .route('/password-reset/:token')
    .get(verifyToken)
    .post(chooseNewPassword);

// Privates Routes
veterinaryRoutes.get('/profile', checkAuth, profile);
veterinaryRoutes.put('/profile/:id', checkAuth, upadateProfile);
veterinaryRoutes.put('/update-password', checkAuth, updatePassword);
