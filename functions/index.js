const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const nodemailer = require('nodemailer');

exports.checkout = functions.database.ref('/users/{uid}/checkout').onWrite((event) => {
    // Grab the text parameter.
    var checkout = event.data.val();
    if (checkout) {
        var uid = event.params.uid;
        console.log("Checking out for:",uid);
        event.data.ref.parent.child("cart").once('value', function(snapshot) {
            var cart = snapshot.val();
            var count = cart["01003610"];
            var price = 20;
            var total = price * count;

/*
            const gmailEmail = functions.config().gmail.email;
            const gmailPassword = functions.config().gmail.password;
            const mailTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmailEmail,
                    pass: gmailPassword,
                },
            });

            const APP_NAME = 'Simple Cart';

            const mailOptions = {
                from: `${APP_NAME} <noreply@firebase.com>`,
                to: 'slantedwalker@gmail.com',
            };

            // The user subscribed to the newsletter.
            mailOptions.subject = `Welcome to ${APP_NAME}!`;
            mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
            mailTransport.sendMail(mailOptions).then(() => {
                return console.log('New welcome email sent to:', email);
            });
            */

            return event.data.ref.parent.child("total").set(total);
        });
    }
});