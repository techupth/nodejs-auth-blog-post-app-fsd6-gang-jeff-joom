export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      req.user = verifyToken(token);
      next(); 
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  const verifyToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user;
  };
  