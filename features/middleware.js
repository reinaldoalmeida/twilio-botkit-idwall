const path = require("path");
const extName = require("ext-name");
const fetch = require("node-fetch");

module.exports = async (controller) => {
    // this middleware add URL and Type when media incoming on message
    controller.middleware.receive.use(async (bot, message, next) => {
        const {
            incoming_message: { channelId },
        } = message;
        if (channelId === "twilio-sms") {
            const {
                NumMedia: media_qtd,
                MediaContentType0: media_type,
                MediaUrl0: original_media_url,
            } = message;
            if (media_qtd > 0) {
                if (media_type == "image/jpeg") {
                    const extension = extName.mime(media_type)[0].ext;
                    const mediaSid = path.basename(
                        new URL(original_media_url).pathname
                    );
                    const filename = `${mediaSid}.${extension}`;
                    //
                    await fetch(original_media_url)
                        .then((res) => {
                            message.media = {
                                media_url: res.url,
                                media_type: media_type,
                                media_name: filename,
                            };
                            return res.url;
                        })
                        .catch(() => {
                            message.media = {
                                media_url: undefined,
                                media_type: media_type,
                                media_name: filename,
                            };
                        });
                }
            }
        }
        next();
    });

    controller.middleware.send.use((bot, message, next) => {
        let delay = message.text.length * 15;
        if (message.text.includes("[IMAGE]")) {
            delay = 3000;
            message.text = message.text.replace("[IMAGE]", "");
        }
        setTimeout(async () => {
            next();
        }, delay);
    });
};
