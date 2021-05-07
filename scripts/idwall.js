const process = require("process");
const axios = require("axios");

module.exports.postDocument = async (document) => {
    const config = {
        method: "GET",
        url: `${process.env.IDWALL_BASE_URL}/relatorios`,
        headers: {
            Authorization: process.env.IDWALL_TOKEN,
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            matriz: "nome_da_matriz",
            parametros: {
                cnh_imagem_completa: document,
            },
        }),
    };
    return await axios(config)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(`[ERROR][000][postDocument] => ${err}`);
            return false;
        });
};
