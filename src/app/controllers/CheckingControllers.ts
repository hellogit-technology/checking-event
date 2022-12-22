import { Request, Response, NextFunction } from 'express';
import { notificationMailAuto } from '../../utils/mail';
import { Event, Scores, Student } from '../models';
import path from 'path';
import { QueryOptions } from 'mongoose';
import moment from 'moment-timezone';
import { ComposeEmail } from '../../utils/mail';
import { AccountSession } from '../../types';
import { injectFile } from '../../utils/inject';

interface Path {
  css: string;
  js: string;
  lib: string;
}

interface File {
  cssFile: string;
  jsFile: string;
  libFile: string;
}

const templateMailDir = path.join(__dirname, '../../../template/event.ejs');

const assetsDir: Path = {
  css: path.join(__dirname, '../../../public/css'),
  js: path.join(__dirname, '../../../public/js'),
  lib: path.join(__dirname, '../../../public/lib')
};

const files: File = {
  cssFile: injectFile(assetsDir.css, 'style'),
  jsFile: injectFile(assetsDir.js, 'scripts'),
  libFile: injectFile(assetsDir.lib, 'confetti')
};

class CheckingControllers {
  // [GET] /checking/:id/slug
  async checkingEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.redirect('/attendance');
      }

      const infoStudent: AccountSession = req.user;
      const eventId = req.params.id;
      const event = await Event.findOne({ eventId: eventId });

      if(!event) {
        return res.redirect('/event-not-exist')
      }

      // Scores is exist
      const queryOptions: QueryOptions = {
        student: infoStudent!['studentId'],
        'event.event': event!['_id'],
        'event.scores': { $ne: null }
      };
      const scoresExist = await Scores.findOne(queryOptions);
      if (scoresExist) {
        req.session.showInfo = 'already';
        return res.redirect('/checking/record-success')
      }

      // Save of update scores
      const checkScores = await Scores.findOne({ student: infoStudent!['studentId'] });

      // Save new
      if (!checkScores) {
        const saveScores = {
          event: [
            {
              scores: 7,
              event: event!['_id']
            }
          ],
          totalEvent: 7,
          month: moment().month() + 1,
          student: infoStudent!['studentId'],
          system: moment().format()
        };
        const newScores = new Scores(saveScores);
        await newScores.save();
      }

      // Update
      if (checkScores) {
        const scoresQuery = await Scores.findById(checkScores['_id']);
        if (!scoresQuery!['event']) {
          const saveScores = {
            event: [
              {
                scores: 7,
                event: event!['_id']
              }
            ],
            totalEvent: 7,
            month: moment().month() + 1,
            student: infoStudent!['studentId'],
            system: moment().format()
          };
          await scoresQuery?.updateOne({ $set: saveScores });
        } else {
          let totalEventScores = scoresQuery!['event'].reduce((accumulator, object: any) => {
            return accumulator + object.scores;
          }) as number;
          const saveScores = {
            totalEvent: totalEventScores + 7,
            month: moment().month() + 1,
            student: infoStudent!['studentId'],
            system: moment().format()
          };

          const infoEvent = {
            scores: 7,
            event: event!['_id']
          };
          await scoresQuery?.updateOne({ $set: saveScores, $push: { event: infoEvent } });
        }
      }

      // Send confirm mail
      const composeMail: ComposeEmail = {
        infoSender: 'Greenwich University Clubs',
        receiverEmail: infoStudent!['email'],
        subjectEmail: 'Xác nhận tham gia hoạt động sự kiện',
        dataPass: {
          fullname: infoStudent!['fullName'],
          schoolId: infoStudent!['schoolId'],
          eventName: event!['name'],
          time: moment().format('h:mm:ss a  dddd, MMMM Do YYYY')
        }
      };
      await notificationMailAuto(templateMailDir, composeMail);

      // Show info page
      req.session.showInfo = 'new';
      req.session.studentName = infoStudent['fullName'];
      req.session.eventName = event!['name'];
      req.session.poster = event?.poster as string
      res.redirect('/checking/record-success');
    } catch (error) {
      console.log(error);
    }
  }

  // [GET] /checking/record-success
  successChecking(req: Request, res: Response, next: NextFunction) {
    try {
      const showInfo = req.session.showInfo;
      const studentName = req.session.studentName;
      const eventName = req.session.eventName;
      const themePage = req.session.poster
      res.status(200).render('success', { files, studentName, eventName, showInfo, themePage });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new CheckingControllers();
