const jwt = require("jsonwebtoken");


const jwtKey =
  process.env.JWT_SECRET ||
  "add a .env file to root of project with the JWT_SECRET variable";

// quickly see what this file exports
module.exports = {
  authenticate,
  checkCredentials
};

// implementation details
function authenticate(req, res, next) {
  const token = req.get("Authorization");

  if (token) {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) return res.status(401).json(err);

      req.decoded = decoded;

      next();
    });
  } else {
    return res.status(401).json({
      error: "No token provided, must be set on the Authorization Header"
    });
  }
}

function checkCredentials(req, res, next) {
  if (!req.body.username) {
    return res.status(400).json({ message: "Please provide username" });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: "Please provide password" });
  }
  if (req.body.username.length < 5) {
    return res.status(400).json({ message: "Username is to short (less than 5 characters)" });
  }
  if (req.body.password.length < 5) {
    return res.status(400).json({ message: "Password is to short (less than 5 characters)" });
  }
  next();
}
