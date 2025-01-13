function isAdmin(req, res, next) {
    // Check if the user is not authenticated or not an admin
    if (!req.user || req.user.isAdmin === false) {
        return res.status(401).send("Unauthorized Access!!");
    }

    next();
}

module.exports = isAdmin;
