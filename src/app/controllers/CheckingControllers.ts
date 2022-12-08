import { Request, Response, NextFunction } from 'express'
import {notificationMailAuto} from '../../utils/mail'
import {Event, Scores, Student} from '../models'
import path from 'path'
import {QueryOptions} from 'mongoose'
import moment from 'moment-timezone'
import {ComposeEmail} from '../../utils/mail'
import {UserSession} from '../../types'
import {injectFile} from '../../utils/inject'

interface Path {
    css: string,
    js: string,
    lib: string
}
  
interface File {
    cssFile: string,
    jsFile: string,
    libFile: string
}

const environment: string = process.env.NODE_ENV!
const dirOptions: { deployment: string, testing: string } = {
    deployment: path.join(__dirname, '../template/event.ejs'),
    testing: path.join(__dirname, '../../../template/event.ejs')
}

const templateMailDir = environment === 'development' ? dirOptions.testing : dirOptions.deployment

const forWebpackDir: Path = {
    css: path.join(__dirname, '../public/css'),
    js: path.join(__dirname, '../public/js'),
    lib: path.join(__dirname, '../public/lib')
}

const defaultDir: Path = {
    css: path.join(__dirname, '../../../public/css'),
    js: path.join(__dirname, '../../../public/js'),
    lib: path.join(__dirname, '../../../public/lib')
}

const files: File = {
    cssFile: injectFile(environment === 'development' ?  defaultDir.css : forWebpackDir.css, 'style'),
    jsFile: injectFile(environment === 'development' ? defaultDir.js : forWebpackDir.js, 'scripts'),
    libFile: injectFile(environment === 'development' ? defaultDir.lib : forWebpackDir.lib, 'confetti')
};

class CheckingControllers {

    // [GET] /checking/record 
    async checkingEvent(req: Request, res: Response, next: NextFunction) {
        try {
            if(!req.user) {
                return res.redirect('/failed')
            }

            const infoStudent: UserSession = req.user
            const eventId = req.session.eventIdParam
            const event = await Event.findOne({eventId: eventId})
            
            // Scores is exist
            const queryOptions: QueryOptions = {
                student: infoStudent!['studentId'],
                "event.event": event!['_id'], 
                "event.scores": { $ne: null }
            }
            const scoresExist = await Student.findOne(queryOptions)
            if(scoresExist) {
                return res.status(200).json('Student has already scores')
            }

            // Save of update scores
            const checkScores = await Student.findOne({student: infoStudent!['studentId']})
            if(checkScores) {
                // Update
                const scoresQuery = await Scores.findById(checkScores['_id']) 
                if(!scoresQuery!['event']) {
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
                    }
                    await scoresQuery?.updateOne({$set: saveScores})
                } else {
                    let totalEventScores = scoresQuery!['event'].reduce((accumulator, object: any) => {
                        return accumulator + object.scores;
                    }) as number
                    const saveScores = {
                        totalEvent: totalEventScores + 7,
                        month: moment().month() + 1,
                        student: infoStudent!['studentId'],
                        system: moment().format()
                    }

                    const infoEvent = {
                        scores: 7,
                        event: event!['_id']
                    }
                    await scoresQuery?.updateOne({$set: saveScores, $push: {event: infoEvent}})
                }
            } else {
                // Save new
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
                }
                const newScores = new Scores(saveScores);
                await newScores.save();
            }

            const composeMail: ComposeEmail = {
                infoSender: 'Greenwich University Clubs',
                receiverEmail: infoStudent!['email'],
                subjectEmail: 'Xác nhận tham gia hoạt động sự kiện',
                dataPass: {
                    fullname: infoStudent!['fullname'],
                    schoolId: infoStudent!['schoolId'],
                    eventName: event!['name'],
                    time: moment().format('h:mm:ss a  dddd, MMMM Do YYYY')
                }
            }

            // Send confirm email
            await notificationMailAuto(templateMailDir, composeMail)
            req.session.studentName = infoStudent['fullname']
            req.session.eventName = event!['name']
            res.redirect('/record-success')

        } catch (error) {
            console.log(error)
        }
    }


    // [GET] /record-success
    successChecking(req: Request, res: Response, next: NextFunction) {
        try {
            const studentName = req.session.studentName
            const eventName = req.session.eventName
            res.status(200).render('success', {files, studentName, eventName})
        } catch (error) {
            console.log(error)
        }
    }

}

export default new CheckingControllers