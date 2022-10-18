import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import ejs, {Data} from 'ejs'

export interface ComposeEmail {
  infoSender: string
  receiverEmail: string
  subjectEmail: string
  dataPass: Data
}

const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN_GMAIL });

export const notificationMailAuto = async (direction: string, compose: ComposeEmail) => {
  try {
    const data = await ejs.renderFile(direction, compose.dataPass)
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

    // Mail Configuration
    const mailOptions = {
      from: compose.infoSender,
      to: compose.receiverEmail,
      subject: compose.subjectEmail,
      html: data
    };
    const resultIdea = await transport.sendMail(mailOptions);
    return resultIdea;
  } catch (error) {
    return error;
  }
};
