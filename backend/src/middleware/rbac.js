const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ error: 'Access denied. Role not found.' });
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Insufficient permissions for role: ' + req.user.role });
        }
    };
};

module.exports = authorize;
