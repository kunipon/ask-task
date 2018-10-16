const language = require('./language');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

module.exports = {
    LocalizationInterceptor: {
        process(handlerInput) {
            // ヘルパー関数の定義
            const localizationClient = i18n.use(sprintf).init({
                lng: handlerInput.requestEnvelope.request.locale,
                overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
                resources: language,
                returnObjects: true
            });
    
            // リクエスト情報の取得
            const attributes = handlerInput.attributesManager.getRequestAttributes();
            // リクエスト情報への注入
            attributes.t = function (...args) {
                return localizationClient.t(...args);
            };
        }
    },
};
