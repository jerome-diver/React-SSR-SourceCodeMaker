import expressJwt from 'express-jwt'

const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if (!authorized) return res.status('403').json({error: "User is not authorized"})
    next()
}
