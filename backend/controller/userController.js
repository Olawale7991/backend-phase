import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../model/userModel.js'

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body
        const file = req.file

    if (!name || !email || !password) {
        return res.status(400).json({error: 'all field are required'})
    }

    const existingUser = await User.findOne({email})
    if (existingUser) {
        return res.status(400).json({error: 'user already exist'})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const createUser = new User({
        name,
        email,
        password: hashedPassword,
    });
    await createUser.save();

    res.status(200).json({
        message: 'user registered successfully',
        data:createUser
    })

    } catch (error) {
        console.log('error registering user', error);
        res.status(500).json({error: error.message})
    }

}

export const login = async (req, res) => {

        const {email, password} = req.body 
        
        const user  = await User.findOne({email})
        if (!user) {
        return res.status(400).json({error: 'incorrect email or password'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const accessToken = jwt.sign({name: user.name, role: user.role}, process.env.ACCESS_TOKEN_KEY)
            
            if(user.role === 'Admin'){
                return res.json({message: 'Welcome Admin!', accessToken})
            }else{
                return res.json({message: 'Welcome User!', accessToken})
            }
        
            }else{
                return res.status(400).send('Invalid Username or Password')
            }    
}

export const getUsers = async (req, res) => {
        const user = await User.find()
        res.status(200).json({message: 'Users fetched successfully', data: user})
      
}

export const getUserId = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.json({message: 'User fetched successfully', data: user})
    } catch (error) {
        console.log('error fetching user', error);
        res.status(500).json({error: error.message})
    }
}

export const updateUser = async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
        if (!users) {
            return res.status(404).json({error: 'user not found'})
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).json({message: 'User updated successfully', data: user})
    } catch (error) {
        console.log('error updating user', error);
        res.status(500).json({error: error.message})
    }
}

export const deleteUser = async (req, res) => {
    try {

        const users = await User.findById(req.params.id)
        if (!users) {
            return res.status(404).json({error: 'User not found'})
        }
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).json({message: 'User deleted successfully', data: user})
    } catch (error) {
        console.log('error deleting user', error);
        res.status(500).json({error: error.message})
    }

}