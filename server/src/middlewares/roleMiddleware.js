

function requireAdmin(req, res, next) {
  const userRole = req.user?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Access denied. Requires admin role." });
  }

  next();
}


function requirePM(req, res, next) {
  const userRole = req.user?.role;

  if (userRole !== "project manager") {
    return res.status(403).json({ error: "Access denied. Requires project manager role." });
  }

  next();
}

export {
  requirePM,
  requireAdmin
};