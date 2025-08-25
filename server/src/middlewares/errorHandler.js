// Centralized error handler
module.exports = (err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
};
