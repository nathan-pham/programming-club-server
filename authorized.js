const authorized = (cleared = []) => (req, res, next) => {
    const username = req.headers["x-replit-user-name"]

    if (username && cleared.includes(username)) {
        next()
    } else {
        res.status(403).json({
            errors: ["You do not have permission to do this action."]
        })
    }
}

export default authorized