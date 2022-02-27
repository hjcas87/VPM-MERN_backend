import { Veterinary } from '../models/Veterinary.js';
import { generateJWT } from '../helpers/generateJWT.js';
import { generateId } from '../helpers/generateId.js';
import { emailConfirmation } from '../helpers/emailConfirmation.js';
import { emailRecoverPassword } from '../helpers/emailRecoverPassword.js';

export const register = async (req, res) => {
    const { email, name } = req.body;

    const hasAccount = await Veterinary.findOne({ email });
    if (hasAccount) {
        const error = new Error('The user is already registered');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const veterinary = new Veterinary(req.body);
        const saveVeterinary = await veterinary.save();

        emailConfirmation({
            name,
            email,
            token: saveVeterinary.token,
        });

        res.json(saveVeterinary);
    } catch (error) {
        console.log(error);
    }
};

export const confirmAccount = async (req, res) => {
    const { token } = req.params;

    const userConfirmation = await Veterinary.findOne({ token });

    if (!userConfirmation) {
        const error = new Error('Invalid token');
        return res.status(404).json({ msg: error.message });
    }
    try {
        userConfirmation.token = null;
        userConfirmation.confirm = true;
        await userConfirmation.save();
        res.json({ msg: 'User has been confirmed successfully' });
    } catch (error) {
        console.log(error);
    }
};

export const autenticate = async (req, res) => {
    const { email, password } = req.body;
    const user = await Veterinary.findOne({ email });
    // Corroborar que el usuario existe
    if (!user) {
        const error = new Error('User does not exist');
        return res.status(403).json({ msg: error.message });
    }
    // Corroborar que el usuario este confirmado
    if (!user.confirm) {
        const error = new Error('This account has not been confirmed');
        return res.status(403).json({ msg: error.message });
    }
    // Corroborar que el password sea correcto
    if (await user.checkPassword(password)) {
        console.log(user.id);
        // res.json({ token: generateJWT(user.id) });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            web: user.web,
            token: generateJWT(user.id),
        });
    } else {
        const error = new Error('Wrong password');
        return res.status(403).json({ msg: error.message });
    }
};

export const passwordReset = async (req, res) => {
    const { email } = req.body;
    const userExist = await Veterinary.findOne({ email });
    if (!userExist) {
        const error = new Error('User does not exist');
        return res.status(400).json({ msg: error.message });
    }

    try {
        userExist.token = generateId();
        await userExist.save();
        emailRecoverPassword({
            email,
            name: userExist.name,
            token: userExist.token,
        });
        res.json({ msg: 'We have sent an email with the instructions' });
    } catch (error) {
        console.log(error);
    }
};

export const verifyToken = async (req, res) => {
    const { token } = req.params;

    const isAValidToken = await Veterinary.findOne({ token });
    if (isAValidToken) {
        res.json({ msg: 'Valid token' });
    } else {
        const error = new Error('Invalid token');
        return res.status(400).json({ msg: error.message });
    }
};

export const chooseNewPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const isAValidUser = await Veterinary.findOne({ token });
    if (!isAValidUser) {
        const error = new Error('There was an error');
        return res.status(400).json({ msg: error.message });
    }
    try {
        isAValidUser.token = null;
        isAValidUser.password = password;
        await isAValidUser.save();
        res.json({ msg: 'Password changed successfully' });
    } catch (error) {
        console.log(error);
    }
};

export const profile = (req, res) => {
    const { veterinary } = req;

    res.json(veterinary);
};

export const upadateProfile = async (req, res) => {
    const veterinary = await Veterinary.findById(req.params.id);
    if (!veterinary) {
        const error = new Error('There was an error');
        return res.status(400).json({ msg: error.message });
    }
    const { email } = req.body;
    if (veterinary.email !== req.body.email) {
        const existingMail = await Veterinary.findOne({ email });
        if (existingMail) {
            const error = new Error('Email is already in use');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinary.name = req.body.name;
        veterinary.email = req.body.email;
        veterinary.phone = req.body.phone;
        veterinary.web = req.body.web;

        const updatedProfile = await veterinary.save();
        res.json(updatedProfile);
    } catch (error) {
        console.log(error);
    }
};

export const updatePassword = async (req, res) => {
    // leer datos
    const { id } = req.veterinary;
    const { password1, password2 } = req.body;
    // comprobar que el vaterinario existe
    const veterinary = await Veterinary.findById(id);
    if (!veterinary) {
        const error = new Error('There was an error');
        return res.status(400).json({ msg: error.message });
    }
    // comprobar su password
    if (await veterinary.checkPassword(password1)) {
        // Almacenar password
        veterinary.password = password2
        await veterinary.save()
        res.json({msg: 'Password stored correctly'})
    } else {
        const error = new Error('The password you entered is incorrect');
        return res.status(400).json({ msg: error.message });
    }
};
