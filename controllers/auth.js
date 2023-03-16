const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');

module.exports = {
    register: async(req, res) => {
        const user = await User.create({...req.body});

        const token = user.createJWT();

        res.status(StatusCodes.CREATED).json({user:{email: user.email, lastname: user.lastname, location: user.location, name: user.name, token}});
    },
    login: async(req, res) => {
        const {email, password} = req.body;

        if(!email || !password){
            throw new BadRequestError('Please provide email and password');
        }

        const user = await User.findOne({email});
        
        if(!user){
            throw new UnauthenticatedError('Invalid credentials');
        }
        
        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect){
            throw new UnauthenticatedError('Invalid credentials');
        }

        const token = user.createJWT();
        res.status(StatusCodes.OK).json({user:{email: user.email, lastname: user.lastname, location: user.location, name: user.name, token}});
    },
    updateUser: async(req, res) => {
        const {name, email, lastname, location} = req.body;
        console.log(req.user);
        if(!name || !email || !lastname || !location){
            throw new BadRequestError(`Please provide all values`);
        }

        const user = await User.findOne({_id: req.user.userId});

        user.name = name;
        user.email = email;
        user.lastname = lastname;
        user.location = location;

        await user.save();

        const token = user.createJWT();
        res.status(StatusCodes.OK).json({user: {name: user.name, email: user.email, lastname: user.lastname, location: user.location, token}});
    }
}