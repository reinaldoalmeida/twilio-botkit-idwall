module.exports = function (controller) {
    // this middleware add URL and Type when media incoming on message
    controller.middleware.receive.use(function (bot, message, next) {
        const {
            incoming_message: { channelId },
        } = message;
        if (channelId === "twilio-sms") {
            const {
                NumMedia: media_qtd,
                MediaContentType0: media_type,
                MediaUrl0: media_url,
            } = message;
            if (media_qtd > 0) {
                message.media = {
                    media_url: media_url,
                    media_type: media_type,
                };
            }
        }
        next();
    });
};
