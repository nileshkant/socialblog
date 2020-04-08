import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from '../env'
import { MultiAccountUser } from '../routes/auth/modal'

// passport.serializeUser(function(user, done) {
//   console.log('user', user)
//   done(null, user.id)
// })

// passport.deserializeUser(function(id, done) {
//   console.log('userID', id)
//   MultiAccountUser.findById(id, function(err, user) {
//     done(err, user)
//   })
// })

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET
    },
    async (jwtPayload, done) => {
      try {
        if (Date.now() > jwtPayload.expires) return done('Token expired')
        const user = await MultiAccountUser.findById(jwtPayload.id).lean()
        return done(null, user)
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
      callbackURL:
        'http://localhost:3000/api/authentication/auth/facebook/callback',
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
                  profile.photos[0].value
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
