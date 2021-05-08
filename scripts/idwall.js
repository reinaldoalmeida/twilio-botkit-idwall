const process = require("process");
const axios = require("axios");

module.exports.createReport = async (document) => {
    const config = {
        method: "POST",
        url: `${process.env.IDWALL_BASE_URL}/relatorios`,
        headers: {
            Authorization: process.env.IDWALL_TOKEN,
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            matriz: process.env.IDWALL_MATRIZ_OCR,
            parametros: {
                doc_imagem_completa: document,
            },
        }),
    };
    return await axios(config)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(`[ERROR][000][createReport] => ${err}`);
            return false;
        });
};

module.exports.paramsReport = async (protocol) => {
    const config = {
        method: "GET",
        url: `${process.env.IDWALL_BASE_URL}/relatorios/${protocol}/parametros`,
        headers: {
            Authorization: process.env.IDWALL_TOKEN,
            "Content-Type": "application/json",
        },
    };
    return await axios(config)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(`[ERROR][000][getReport] => ${err}`);
            return false;
        });
};
