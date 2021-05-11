module.exports = function (controller) {
    const { BotkitConversation } = require("botkit");
    const flow = new BotkitConversation("ocrDocumentFinish", controller);

    flow.addAction("ocrDocumentFinish");

    flow.before("ocrDocumentFinish", async (convo) => {
        const props = convo.vars.props ? convo.vars.props : {};
        const { documento_ocr, tipo_detectado } = props;
        if (tipo_detectado) {
            convo.setVar("documento_ocr", documento_ocr);
            if (tipo_detectado == "CNH") {
                await convo.gotoThread("ocrDocumentFinishCNH");
            } else {
                await convo.gotoThread("ocrDocumentFinishRG");
            }
        } else {
            convo.setVar("messageFail", props.messageFail);
            await convo.gotoThread("ocrDocumentFinishFail");
        }
    });

    flow.addMessage(" ", "ocrDocumentFinish");

    flow.addMessage(
        {
            text: (template, vars) =>
                `🔍 Olha o que eu consegui extrair do seu documento 🤩.\n\
                \n*Tipo:* ${vars.documento_ocr.tipo_detectado}\
                \n*CPF:* ${vars.documento_ocr.cpf}\
                \n*Nascimento:* ${vars.documento_ocr.data_de_nascimento}\
                \n*Pai:* ${vars.documento_ocr.nome_do_pai}\
                \n*Mãe:* ${vars.documento_ocr.nome_da_mae}\
                \n*Categoria:* ${vars.documento_ocr.categoria}\
                \n*Registro:* ${vars.documento_ocr.numero_registro}\
                \n*Validade:* ${vars.documento_ocr.validade}\
                \n*1a Habilitação:* ${vars.documento_ocr.data_primeira_habilitacao}\
                \n*Permissão:* ${vars.documento_ocr.permissao}\
                \n*Emissão:* ${vars.documento_ocr.data_de_emissao}\
                \n*Orgao Emissor:* ${vars.documento_ocr.orgao_emissor}\
                \n*Local Emissão:* ${vars.documento_ocr.local_emissao}\
                \n*Estado Emissão:* ${vars.documento_ocr.estado_emissao}\
                \n*Renach:* ${vars.documento_ocr.numero_renach}\
                \n*Espelho:* ${vars.documento_ocr.numero_espelho}\
                \n*Observações:* ${vars.documento_ocr.observacoes}\
                `,
        },
        "ocrDocumentFinishCNH"
    );

    flow.addMessage(
        {
            text: (template, vars) =>
                `🔍 Olha o que eu consegui extrair do seu documento 🤩.\n\
                \n*Tipo:* ${vars.documento_ocr.tipo_detectado}\
                \n*CPF:* ${vars.documento_ocr.cpf}\
                \n*RG:* ${vars.documento_ocr.rg}\
                \n*Nascimento:* ${vars.documento_ocr.data_de_nascimento}\
                \n*Pai:* ${vars.documento_ocr.nome_do_pai}\
                \n*Mãe:* ${vars.documento_ocr.nome_da_mae}\
                \n*Naturalidade:* ${vars.documento_ocr.naturalidade}\
                \n*Emissão:* ${vars.documento_ocr.data_de_expedicao}\
                \n*Orgao Emissor:* ${vars.documento_ocr.orgao_emissor}\
                \n*Estado Emissão:* ${vars.documento_ocr.estado_emissao}\
                `,
        },
        "ocrDocumentFinishRG"
    );

    flow.addMessage(
        {
            text: (template, vars) =>
                `🚨 Infelizmente encontrei um *problema no documento*. Por favor, tente novamente!\n\n_${vars.messageFail}_`,
        },
        "ocrDocumentFinishFail"
    );

    flow.after(async () => {});

    controller.addDialog(flow);
};
