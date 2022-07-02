import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import moment from 'moment';

const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN_GMAIL });

export const notificationMailAuto = async (option: string, email: string, receiver: string, clubName: string) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'gwgradinghellogit@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN_GMAIL,
        accessToken: accessToken
      }
    } as SMTPTransport.Options);

    //? Mail Configuration
    const infoSender = 'CLUBS GRADING CMS - GREENWICH UNIVERSITY';

    const noticeInputScores = {
      from: infoSender,
      to: email,
      subject: `Remind nhập điểm tháng ${moment(Date.now()).format('M')} - CLB ${clubName}`,
      html: `
          
            `
    };

    const noticeMentors = {
      from: infoSender,
      to: email,
      subject: 'Kiểm tra nội dung nhập điểm các CLB',
      html: `
            `
    };

    if (option === 'leader') {
      const resultIdea = await transport.sendMail(noticeInputScores);
      return resultIdea;
    }

    if (option === 'mentor') {
      const resultIdea = await transport.sendMail(noticeMentors);
      return resultIdea;
    }
  } catch (error) {
    return error;
  }
};
