const process = require("process");

module.exports = function (controller) {
    const { BotkitConversation } = require("botkit");
    const flow = new BotkitConversation("intro", controller);

    flow.addAction("welcome");

    flow.addMessage(
        {
            text:
                "[IMAGE]Olá, seja bem-vindo(a) 😎\
                \n\nEu sou o _*ZapWall*_ 👮🏻‍♂️\
                \n\n🚨 Gostaria de demonstrar algumas formas de utilizar o _*WhatsApp em processos de Onbord*_, mantendo a _*privacidade*_ e _*segurança*_ de um cliente.",
            channelData: {
                mediaUrl: `${process.env.IMAGE_URL}/zapwall-logo@640x640.png`,
            },
        },
        "welcome"
    );

    flow.addQuestion(
        "Digite o *número de uma das opções abaixo* que você deseja experimentar:\
        \n\n1️⃣ OCR - CNH ou RG\
        \n2️⃣ Face Match\
        \n3️⃣ CPF Regular\
        \n4️⃣ CPF + CEP\
        \n5️⃣ CNPJ Regular\
        \n6️⃣ CNPJ + CPF\
        \n7️⃣ P.E.P\
        \n8️⃣ M.F.A\
        \n9️⃣ Social Login\
        \n🔟 WhiteList\
        \n\n0️⃣ Sair",
        [
            {
                pattern: "1",
                type: "string",
                handler: async (response, convo, bot) => {
                    await bot.cancelAllDialogs();
                    await bot.beginDialog("ocrDocument");
                },
            },
            {
                pattern: new RegExp("^0$|Sair"),
                type: "regex",
                handler: async (response, convo) => {
                    await convo.cancelAllDialogs();
                    await convo.gotoThread("exit");
                },
            },
            {
                default: true,
                handler: async (response, convo, bot) => {
                    await bot.say(
                        "Por favor, digite uma das opções ou 0 para sair!"
                    );
                    return await convo.repeat();
                },
            },
        ],
        "welcomeMenuChoice",
        "welcome"
    );

    flow.after(async () => {});

    controller.addDialog(flow);
};
