const mailDao = require('../dao/mail-dao')

class MailService {
    async sendMail(email, message) {
        if (email !== ""){
            if (/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
                await mailDao.sendMail(email, message)
            } else {
                await mailDao.sendMailNoMail(message)
            }
        } else {
            await mailDao.sendMailNoMail(message)
        }
    }
}

module.exports = exports = new MailService();
