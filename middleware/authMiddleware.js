const JWT = require('jsonwebtoken');
const { TOKEN_SALT } = require('../constants/constants');

module.exports = (req, res, next) => {
    const authToken = req.get('x-auth-token');
    if(!authToken){
        res.status(401).json('Please login first to access this endpoint!');
        return;
    }
    try{
        const decodedToken = JWT.verify(authToken, TOKEN_SALT);
        if(!decodedToken){
            res.status(401).json('Please login first to access this endpoint!');
            return;
        }
        req.userId = decodedToken._id;
        req.userRole = decodedToken.role;
    }
    catch (error) {
        console.log(error);
        res.status(500).json('Internal server error');
        return;
    }
    next();
}