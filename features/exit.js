module.exports = function (controller) {
    const { BotkitConversation } = require("botkit");
    const flow = new BotkitConversation("exit", controller);

    flow.addAction("exitMessage");

    flow.before("exitMessage", async () => {});

    flow.addMessage(
        "Quando quiser falar novamente, é só mandar um *Oi*. Até a próxima!",
        "exitMessage"
    );

    flow.after(async () => {});

    controller.addDialog(flow);
};
