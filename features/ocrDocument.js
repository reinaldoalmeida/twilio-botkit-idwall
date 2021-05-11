module.exports = function (controller) {
    const path = require("path");
    const process = require("process");
    const { BotkitConversation } = require("botkit");
    const flow = new BotkitConversation("ocrDocument", controller);

    const idWall = require(path.join(process.cwd(), "scripts", "idwall.js"));
    const wait = require(path.join(process.cwd(), "scripts", "wait.js"));

    flow.addAction("ocrDocument");

    flow.addMessage(
        {
            text:
                "Essa opção é muito interessante! 😎\
                \n\n🚨 Através do *OCR de documentos* eu consigo extrair informações adicionais, como *validade do documento* e a *filiação da pessoa*, além de poder ser um facilitador na hora do preenchimento de dados. 😉\
                \n\n🚨 Eu consigo também analisar se é um *documento válido* (RG ou CNH), sem que você precise perguntar ao seu cliente.\
                \n\n🚨 Também faço um processo de checagem e segurança adiconal, *comparando os dados extraidos com um birô* para te oferecer ainda mais segurança",
            channelData: {
                mediaUrl: `${process.env.IMAGE_URL}/zapwall-ocr-document@640x640.png`,
            },
        },
        "ocrDocument"
    );

    flow.addQuestion(
        {
            text:
                "🔍 Agora, envie uma foto de seu *documento de identidade (RG)* ou *Carteira Nacional de Habilitação (CNH)*.\
            \n\n📷 _*A foto precisa estar como o exemplo acima* e de forma legível, para que possamos *identificar com clareza seu rosto* e o *número de seu CPF*._\
            \n\n0️⃣ Sair",
            channelData: {
                mediaUrl: `${process.env.IMAGE_URL}/zapwall-cnh@640x640.jpg`,
            },
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
                            props.document = message.media;
                            convo.setVar("props", props);
                            await convo.gotoThread("ocrDocumentProcess");
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
        "ocrDocumentDocument",
        "ocrDocument"
    );

    flow.before("ocrDocumentProcess", async (convo, bot) => {
        await bot.say(
            "_Estou analisando seu documento, por favor aguarde..._\n\n_*Isso pode levar até 15 segundos*_ 😉"
        );
        const props = convo.vars.props ? convo.vars.props : {};
        if (!props.document) {
            await convo.gotoThread("ocrDocumentProcessFail");
        }
        const createReport = await idWall.createReport(
            props.document.media_url
        );

        if (createReport) {
            const {
                result: { numero: protocol },
            } = createReport;

            // wait until the status changes from PRE-PROCESSING to PROCESSING
            // so, even before finalizing, it is already possible to get information -> /parametros
            await wait.delay(10000); // 10s
            const paramsReport = await idWall.paramsReport(protocol);
            const { result } = paramsReport;

            const props = convo.vars.props ? convo.vars.props : {};
            const { documento_ocr } = result;
            const { tipo_detectado } = documento_ocr;
            props.documento_ocr = documento_ocr;
            props.tipo_detectado = tipo_detectado;
            if (!tipo_detectado) {
                const { mensagem: message } = result;
                props.messageFail = message;
            }

            convo.setVar("props", props);
            await bot.cancelAllDialogs();
            await bot.beginDialog("ocrDocumentFinish", { props: props });
        } else {
            await convo.gotoThread("ocrDocumentProcessFail");
        }
    });

    flow.addMessage(" ", "ocrDocumentProcess");

    flow.addMessage(
        {
            text: () =>
                `🚨 Encontrei um *problema no envio do seu documento*. Por favor, tente novamente!`,
        },
        "ocrDocumentProcessFail"
    );

    flow.after(async () => {});

    controller.addDialog(flow);
};
