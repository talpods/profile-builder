const authenticateUser = require('../usecases/authenticateUser');
const tokenService = require('../services/tokenService');
const jwtClient = require('../infrastructure/jwtClient'); 

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authenticateUser(email, password);
        res.status(201).send({ token });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const tokenData = await tokenService.getTokenByRefreshToken(refreshToken);

        if (!tokenData.refreshToken || tokenData.refreshTokenInvalidated) {
            return res.status(401).json({ error: 'expired or Invalid refresh token' });
        }

        jwtClient.verifyToken(refreshToken, process.env.JWT_SECRET);
        const decoded = jwtClient.decodeToken(tokenData.accessToken, { complete: true });

        const newAccessToken = jwtClient.generateToken(
            { email: decoded.payload.email, firstName: decoded.payload.firstName, lastName: decoded.payload.lastName, roles: decoded.payload.roles, permissions: decoded.payload.permissions },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        const newAccessTokenExpiration = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
        await tokenService.updateTokens(newAccessToken, refreshToken, newAccessTokenExpiration);

        res.status(201).json({ accessToken: newAccessToken, refreshToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};

exports.validate = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        res.status(200).json({ message: "valid user", user: req.user });
    } catch (error) {
        console.error('Error validating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.me = (req, res) => {
    res.status(200).json({ user: req.user });
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await tokenService.invalidateRefreshToken(refreshToken);
        await tokenService.invalidateToken(refreshToken);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error logging out' });
    }
};
