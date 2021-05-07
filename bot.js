const process = require("process");
const path = require("path");
const { Botkit } = require("botkit");
const { TwilioAdapter } = require("botbuilder-adapter-twilio-sms");
require("dotenv").config();

const adapter = new TwilioAdapter({
    twilio_number: process.env.TWILIO_NUMBER,
    account_sid: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
});

const controller = new Botkit({
    adapter,
});

controller.ready(() => {
    controller.loadModules(path.join(process.cwd(), "features"));
    controller.on("message", async (bot, message) => {
        await bot.beginDialog("intro", {
            message: message.Body,
        });
    });
    console.log("\n\n=============  Botkit initialized  ==============\n\n");
});
