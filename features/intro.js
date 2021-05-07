module.exports = function (controller) {
    const { BotkitConversation } = require("botkit");
    const flow = new BotkitConversation("intro", controller);

    flow.addAction("welcomeMessage");

    flow.addMessage("Olá, seja bem-vindo(a) 😎", "welcomeMessage");

    flow.addQuestion(
        {
            text:
                "Envie seu RG e/ou CNH para que possamos analisar as informações",
        },
        [
            {
                pattern: new RegExp("^0$"),
                type: "regex",
                handler: async (response, convo, bot) => {
                    await bot.cancelAllDialogs();
                    await bot.beginDialog("exit");
                },
            },
            {
                default: true,
                handler: async (response, convo, bot, message) => {
                    if (message.media) {
                        // obtained by middleware
                        if (message.media.media_type == "image/jpeg") {
                            const props = convo.vars.props
                                ? convo.vars.props
                                : {};
                            props.media = message.media.media_url;
                            //
                            await bot.say(
                                "_Estamos enviando seus documentos, por favor aguarde ..._"
                            );
                            //
                            await bot.cancelAllDialogs();
                            await bot.beginDialog("ocrMessage", {
                                props,
                            });
                        } else {
                            await bot.say(
                                "Por favor, envie uma *foto válida* do seu documento ou 0 para sair!"
                            );
                            return await convo.repeat();
                        }
                    } else {
                        await bot.say(
                            "Por favor, envie uma *foto válida* do seu documento ou 0 para sair!"
                        );
                        return await convo.repeat();
                    }
                },
            },
        ],
        "welcomeMessageDocument",
        "welcomeMessage"
    );

    flow.after(async (results, bot) => {
        await bot.cancelAllDialogs();
        await bot.beginDialog("exit");
    });

    controller.addDialog(flow);
};
