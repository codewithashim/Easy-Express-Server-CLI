import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../shared/middleware/jwt/generateTokens.js";

// User registration
const registerUser = async (req, res) => {
    try {
        const { email, username, password, confirmPassword } = req.body;


        if (confirmPassword !== password) {
            return res.status(400).json({
                status: "fail",
                message: "Passwords do not match"
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            email,
            username,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
        }

        res.status(201).json({
            status: "success",
            data: newUser
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User login


const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid username or password",
            });
        }

        const isMatch = bcrypt.compareSync(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid username or password",
            });
        }

        const token = generateToken(user._id, res);

        res.status(200).json({
            status: "success",
            token,
            data: user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User logout
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    });
};

export { registerUser, loginUser, logoutUser };
