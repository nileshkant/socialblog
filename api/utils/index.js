import passport from 'passport'
/**
 * middleware for checking authorization with jwt
 */
export const authorized = (request, response, next) => {
  passport.authenticate('jwt', { session: false }, (error, token) => {
    if (error || !token) {
      response.status(401).json({ message: 'Unauthorized' })
    } else {
      request.user = token
      next()
    }
  })(request, response, next)
}
