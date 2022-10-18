import { Strategy } from 'passport-google-oauth20';
import { PassportStatic } from 'passport';
import { Student } from '../app/models';
import { messageVietnamese } from '../utils/message';

const GoogleStrategy = Strategy;

export const googlePassport = (passport: PassportStatic) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser<any>((user, done) => {
    done(null, user);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        callbackURL: '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        const accessOrganization = process.env.ACCESS_ORGANIZATION!
        const organization = profile['_json'].hd;
        const studentEmail = profile['_json'].email

        // Only accept email organization
        if(organization !== accessOrganization) {
          return done(null, false, { type: 'message', message: messageVietnamese.RES006(accessOrganization) });
        }
        
        const student = await Student.findOne({email: studentEmail})
        if(!student) {
          return done(null, false, { type: 'message', message: messageVietnamese.RES007 })
        }

        const studentSession = {
          studentId: student['_id'],
          fullname: student['fullname'],
          schoolId: student['schoolId'],
          email: student['email'],
          isLogged: true
        }

        return done(null, studentSession);
      }
    )
  );
};
