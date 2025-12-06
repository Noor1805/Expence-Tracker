export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(401).json
                ({
                    success: false,
                    message: "You are not authorized to access this resource"
                });
        }
        next();
    };
};