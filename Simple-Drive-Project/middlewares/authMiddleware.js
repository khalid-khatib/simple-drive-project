module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== process.env.TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
