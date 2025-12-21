import User from '../models/User.js';

// @desc    Get all users with pending verification status
// @route   GET /api/admin/users/pending
// @access  Private/Admin
export const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ verificationStatus: 'pending' }).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user verification status
// @route   PUT /api/admin/verify/:userId
// @access  Private/Admin
export const verifyUser = async (req, res) => {
    try {
        const { status } = req.body; // 'verified' or 'rejected'

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.verificationStatus = status;
        await user.save();

        res.json({
            message: `User marked as ${status}`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                verificationStatus: user.verificationStatus
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
