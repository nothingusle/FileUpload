import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ mes: "Authorization token missing" });
    }
    const token = authHeader.split(" ")[1];
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = token_decode;
    next();
  } catch (err) {
    res.status(403).json({ mes: "Invalid or Expired Token" });
  }
};

export default jwtAuth;
