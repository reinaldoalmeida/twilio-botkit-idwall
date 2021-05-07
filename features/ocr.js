module.exports = function (controller) {
    const path = require("path");
    const process = require("process");
    const { BotkitConversation } = require("botkit");
    const flow = new BotkitConversation("ocrMessage", controller);

    const idWall = require(path.join(process.cwd(), "scripts", "idWall.js"));

    flow.addAction("ocrMessage");

    flow.before("ocrMessage", async (convo) => {
        const props = convo.vars.props ? convo.vars.props : {};
        const success = await idWall.postDocument(props.media);
        if (success) {
            await convo.gotoThread("ocrMessageSuccess");
        } else {
            await convo.gotoThread("ocrMessageFail");
        }
    });

    flow.addMessage("", "ocrMessage");

    flow.addMessage(
        "🔍 Inicimos o processo de *leitura e análise* do seu documento.\n\nAssim que finalizarmos o processamento avisarei por aqui 😉",
        "ocrMessageSuccess"
    );

    flow.addMessage(
        "Houve um *problema no envio de seus documentos*. Por favor, tente novamente mais tarde!",
        "ocrMessageFail"
    );

    flow.after(async (results, bot) => {
        await bot.cancelAllDialogs();
        await bot.beginDialog("exit");
    });

    controller.addDialog(flow);
};
