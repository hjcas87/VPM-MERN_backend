import express from 'express';
import { conectarDB } from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { veterinaryRoutes } from './routes/veterinaryRoutes.js';
import { patientRoutes } from './routes/patientRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

const allowedDomains = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors(corsOptions));

app.use('/api/veterinary', veterinaryRoutes);
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('servidor funcionando');
});
