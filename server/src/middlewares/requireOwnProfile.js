function requireOwnProfile(req, res, next) {
  const userIdFromToken = req.user?.userId;
  const userRole = req.user?.role;
  const userIdFromParams = req.params.id;

  if (userRole === "admin" || String(userIdFromToken) === String(userIdFromParams)) { 
   return next();
  } else {
    return res.status(403).json({ error: "Access denied." });
  }
}


export default requireOwnProfile;