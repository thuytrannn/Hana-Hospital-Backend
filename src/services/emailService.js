require('dotenv').config()
import nodemailer from 'nodemailer'

let sendEmailBooking = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    });

    const info = await transporter.sendMail({
        from: '"Hana Hospital 👻" <thuytran13565@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html: `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám miễn phí trên website Hana.</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Vui lòng click vào đường link bên dưới để xác nhận lịch hẹn theo những thông tin trên:</p>
        <div>
        <a href=${dataSend.redirectLink} target='_blank'>Click here</a>
        </div>
        <div>Xin chân thành cảm ơn!</div>
        `
    });
}

let sendAttachment = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    });

    const info = await transporter.sendMail({
        from: '"Hana Hospital 👻" <thuytran13565@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        attachments: [{
            filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: 'base64'
        }],
        html: `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã sử dụng dịch vụ tại Hana Hospital.</p>
        <p>Thông tin hóa đơn được gửi trong file đính kèm.</p>
        
        <div>Xin chân thành cảm ơn!</div>
        `
    });
}

module.exports = {
    sendEmailBooking,
    sendAttachment,
}