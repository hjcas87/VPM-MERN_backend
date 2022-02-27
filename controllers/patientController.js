import { Patients } from '../models/Patient.js';

export const addNewPatient = async (req, res) => {
    const newPatient = new Patients(req.body);
    newPatient.vet = req.veterinary._id;
    try {
        const savePatient = await newPatient.save();
        res.json(savePatient);
    } catch (error) {
        console.log(error);
    }
};
export const getPatients = async (req, res) => {
    const listPatients = await Patients.find()
        .where('vet')
        .equals(req.veterinary);
    res.json(listPatients);
};

export const getOnePatient = async (req, res) => {
    const { id } = req.params;

    const patient = await Patients.findById(id);

    if (!patient) {
        return res.status(404).json({ msg: 'Patient not found' });
    }
    if (patient.vet._id.toString() !== req.veterinary._id.toString()) {
        return res.json({ msg: 'Invalid action' });
    }

    res.json(patient);
};
export const updatePatient = async (req, res) => {
    const { id } = req.params;

    const patient = await Patients.findById(id);

    if (!patient) {
        return res.status(404).json({ msg: 'Patient not found' });
    }

    if (patient.vet._id.toString() !== req.veterinary._id.toString()) {
        return res.json({ msg: 'Invalid action' });
    }

    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptom = req.body.symptom || patient.symptom;
    try {
        const updatedPatient = await patient.save();
        res.json(updatedPatient);
    } catch (error) {
        console.log(error);
    }
};
export const deletePatient = async(req, res) => {
    const { id } = req.params;

    const patient = await Patients.findById(id);

    if (!patient) {
        return res.status(404).json({ msg: 'Patient not found' });
    }

    if (patient.vet._id.toString() !== req.veterinary._id.toString()) {
        return res.json({ msg: 'Invalid action' });
    }
    try {
        await patient.deleteOne();
        res.json({ msg: 'Eliminated patient' });
    } catch (error) {
        console.log(error);
    }
};
