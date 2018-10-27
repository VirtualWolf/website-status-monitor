#!/usr/bin/env node

const request = require('superagent');
const mailer = require('nodemailer');
const config = require('./config');

const transporter = mailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: true,
    auth: {
        user: config.smtpUsername,
        pass: config.smtpPassword,
    },
});

for (const url of config.urls) {
    request
        .get(url)
        .catch(async err => {
            try {
                await transporter.sendMail({
                    from: `${config.fromUser} <${config.smtpUsername}>`,
                    to: config.smtpUsername,
                    subject: `[${url.replace(/https?:\/\//, '')}] ${err.message}`,
                    text: 'Uh oh.',
                });
            } catch (err) {
                console.log('Error sending email', err.message);
            }
        });
}

