import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from '../env'
import { MultiAccountUser } from '../routes/auth/modal'
import { BASE_URL } from '../../utilities/constant'

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET
    },
    (jwtPayload, done) => {
      try {
        if (Date.now() > jwtPayload.expires) return done('Token expired')
        return done(null, jwtPayload.userDetails)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: `${BASE_URL}/api/authentication/auth/facebook/callback`,
      authType: 'rerequest',
      profileFields: [
        'id',
        'displayName',
        'picture.type(large)',
        'email',
        'gender'
      ]
    },
    function(accessToken, refreshToken, profile, cb) {
      MultiAccountUser.findOne({ 'facebook.id': profile.id }, (err, user) => {
        if (err) {
          return cb(err)
        }
        if (!user) {
          MultiAccountUser.create(
            {
              gender: profile.gender,
              facebook: {
                id: profile.id,
                displayName: profile.displayName,
                profilePic:
                  profile.photos &&
                  profile.photos.length > 0 &&
                  profile.photos[0].value,
                gender: profile.gender || '',
                email: profile.email || ''
              }
            },
            (err, user) => {
              cb(err, user)
            }
          )
        } else {
          cb(err, user)
        }
      })
    }
  )
)

export default passport
