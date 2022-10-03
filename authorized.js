const authorized = (cleared = []) => (req, res, next) => {
    const username = req.headers["x-replit-user-name"]
    const authorization = req.headers["authorization"]

    const token = authorization.split(" ").pop()

    if ((username && cleared.includes(username)) || token === process.env["BEARER_BYPASS"]) {
        next()
    } else {
        res.status(403).json({
            errors: ["You do not have permission to do this action."]
        })
    }
}

export default authorized