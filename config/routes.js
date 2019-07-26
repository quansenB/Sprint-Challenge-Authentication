const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authenticate, checkCredentials } = require("../auth/authenticate");
const db = require("../auth/authDbHelpers");

module.exports = server => {
  server.post("/api/register", checkCredentials, register);
  server.post("/api/login", checkCredentials, login);
  server.get("/api/jokes", authenticate, getJokes);
};

async function register(req, res) {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 12);
    const user = await db.add({
      username: req.body.username,
      password: req.body.password
    });
    if (user) {
      const token = generateToken(user);
      return res
        .status(201)
        .json({ message: "User created successfully", token });
    } else {
      return res.status(400).json({ message: "User could not be created" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await db.findByName(req.body.username);
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateToken(user);
      return res.status(201).json({ message: "Login successful", token });
    } else if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(400).json({ message: "Invalid password" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}

function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "30d"
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
