var nodemailer = require('nodemailer');
const transporterEmail = 'aqpmaintainer@gmail.com'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: transporterEmail,
        pass: 'aqpmaintainerpassword'
    }
});

class MailDao {
    async sendMail(email, message) {
        var mailOptions = {
            from: transporterEmail,
            to: transporterEmail,
            subject: 'Feedback email from the AQP website from user email: '+email,
            text: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        console.log('sent mail from feedback')
    }

    async sendMailNoMail(message) {
        var mailOptions = {
            from: transporterEmail,
            to: transporterEmail,
            subject: 'Feedback email from the AQP website. User did not specify his email',
            text: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        console.log('sent mail from feedback')
    }
}

module.exports = exports = new MailDao();
