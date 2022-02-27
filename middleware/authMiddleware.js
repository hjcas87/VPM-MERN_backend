import jwt from 'jsonwebtoken';
import { Veterinary } from '../models/Veterinary.js';

export const checkAuth = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.veterinary = await Veterinary.findById(decoded.id).select(
                '-password -token -confirm'
            );
            return next();
        } catch (err) {
            const error = new Error('Token does not exist');
            return res.status(403).json({ msg: error.message });
        }
    }

    if (!token) {
        const error = new Error('Token does not exist or is invalid');
        res.status(403).json({ msg: error.message });
    }

    next();
};
