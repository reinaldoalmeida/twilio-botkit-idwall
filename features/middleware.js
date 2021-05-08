const path = require("path");
const extName = require("ext-name");
const fetch = require("node-fetch");

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
                if (media_type == "image/jpeg") {
                    const extension = extName.mime(media_type)[0].ext;
                    const mediaSid = path.basename(new URL(media_url).pathname);
                    const filename = `${mediaSid}.${extension}`;
                    //
                    message.media = {
                        media_url: extractMediaURL(media_url), // because twilio redirects to a bucket on aws s3
                        media_type: media_type,
                        media_name: filename,
                    };
                }
            }
        }
        next();
    });

    async function extractMediaURL(url) {
        await fetch(url)
            .then((res) => {
                console.log(res.url);
                return res.url;
            })
            .catch(() => {
                return undefined;
            });
    }
};
