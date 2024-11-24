const jwt=require('jsonwebtoken');
const authMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.cookies.accessToken;
        console.log(token);
        if(token){
          jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) return res.status(403).json("Token is not valid!");
            req.user = user;
            next();
          });
        }

        else{
          return res.status(401).json("You are not authenticated!");
        }
    },
    veriyTokenAndAdminAuth:(req, res, next) => {
      authMiddleware.verifyToken(req, res, () => {
        if( req.user.isAdmin){
          next();
        }
        else{
          return res.status(403).json("You are not allowed to make changes!");
        }
      });
    }
}
module.exports = authMiddleware;