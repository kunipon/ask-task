const helper = require('./helper');
const config = require('./config');
const axios = require('axios');

module.exports = {
    /**
     * 登録モード開始
     */
    SelectRegistHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
    
            return request.type === 'IntentRequest'
                && request.intent.name === 'SelectRegistIntent';
        },
        handle(handlerInput) {
            // セッションに保存
            let attributes = handlerInput.attributesManager.getSessionAttributes();
            attributes.action = 'regist';
            handlerInput.attributesManager.setSessionAttributes(attributes);
            
            const speechText = helper.getMessage(handlerInput, 'TELLME_REGIST_CONTENTS');
    
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
    },
    /**
     * タスク登録ハンドラー
     */
    TaskRegistHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
    
            return request.type === 'IntentRequest'
                && request.intent.name === 'TaskRegistIntent';
        },
        async handle(handlerInput) {
            
            const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
            const slots = handlerInput.requestEnvelope.request.intent.slots;

            const requestConfig = {
                baseURL: `${config.API_PROTO}://${config.API_HOST}/`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                timeout: 5000
            };

            const data = {
                deadline:`${slots.date.value}`,
                title:`${slots.title.value}`
            };

            const response = await axios.post('/api/tasks', data, requestConfig);
            if(response.status>=400) {
                const message = `${response.status}: ${response.statusText}`;
                throw new Error(message);
            }
            const speechText = helper.getMessage(handlerInput, 'REGIST_FINISH');
    
            // セッションに保存
            let attributes = handlerInput.attributesManager.getSessionAttributes();
            attributes.action = 'regist';
            handlerInput.attributesManager.setSessionAttributes(attributes);

            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
    },
};