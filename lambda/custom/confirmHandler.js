const helper = require('./helper');
const config = require('./config');
const axios = require('axios');

module.exports = {
    /**
     * タスク確認モード開始
     */
    SelectConfirmHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
    
            return request.type === 'IntentRequest'
                && request.intent.name === 'SelectConfirmIntent';
        },
        async handle(handlerInput) {
            const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

            const requestConfig = {
                baseURL: `${config.API_PROTO}://${config.API_HOST}/`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                timeout: 5000
            };
            
            const count = await axios.get('/api/tasks/count', requestConfig);
            const speechText = helper.getMessage(
                                    handlerInput,
                                    'TASK_COUNT',
                                    {count: count});
            
            // セッションに情報保存
            let attributes = handlerInput.attributesManager.getSessionAttributes();
            attributes.taskCount = count;
            attributes.taskIndex = -1;
            attributes.action = 'confirm';
            handlerInput.attributesManager.setSessionAttributes(attributes);
    
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
    },
    /**
     * 次の1件を読み上げハンドラー
     */
    SpeechNextTaskHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            const intentName = request.intent.name;
            const action = handlerInput.attributesManager.getSessionAttributes().action;
            
            return request.type === 'IntentRequest'
                && action === 'confirm'
                && (intentName === 'AMAZON.YesIntent' || intentName === 'AMAZON.NextIntent');
        },
        async handle(handlerInput) {
            // セッションに保存
            let attributes = handlerInput.attributesManager.getSessionAttributes();
            attributes.action = 'confirm';
            handlerInput.attributesManager.setSessionAttributes(attributes);

            // 読み上げるタスクのインデックス
            const nextIndex = attributes.taskIndex+1;
            
            // index validation
            if(nextIndex >= attributes.taskCount) {
                const speechText = helper.getMessage(handlerInput, 'TASK_READ_LIMIT');
    
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
            }
            
            // 現在のインデックスを保存
            attributes.taskIndex = nextIndex;
            handlerInput.attributesManager.setSessionAttributes(attributes);
            
            // task取得
            const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

            // const task = JSON.parse(await sendApiRequest(options));
            const requestConfig = {
                baseURL: `${config.API_PROTO}://${config.API_HOST}/`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                timeout: 5000
            };
            
            const task = await axios.get(`/api/tasks/${nextIndex}?idtype=list`, requestConfig);

            // ユーザーへの返信
            // 最初だけ説明入れるよ
            // TODO: DynamoDBにセッション情報を保持して、最初の最初だけにしても良い
            const repromptText = helper.getMessage(handlerInput, 'ASK_READ_RESUME');
            const explanation = nextIndex===0 ? repromptText : '';
            const taskText = helper.getMessage(
                                handlerInput,
                                'READ_TASK',
                                {index: nextIndex+1, deadline: task.deadline, title: task.title});
    
            return handlerInput.responseBuilder
                .speak(`${explanation}${taskText}`)
                .reprompt(repromptText)
                .getResponse();
        }
    },
    /**
     * 前の1件を読み上げハンドラー
     */
    SpeechPreviousTaskHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            const intentName = request.intent.name;
            const action = handlerInput.attributesManager.getSessionAttributes().action;
    
            return request.type === 'IntentRequest' &&
                action === 'confirm' &&
                intentName === 'AMAZON.PreviousIntent';
        },
        async handle(handlerInput) {
            // セッションに保存
            let attributes = handlerInput.attributesManager.getSessionAttributes();
            attributes.action = 'confirm';
            handlerInput.attributesManager.setSessionAttributes(attributes);

            // 読み上げるタスクのインデックス
            const previousIndex = attributes.taskIndex-1;

            // index validation
            if(previousIndex < 0) {
                const speechText = helper.getMessage(handlerInput, 'TASK_READ_CANT_BACK');
    
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
            }
            
            // 現在のインデックスを保存
            attributes.taskIndex = previousIndex;
            handlerInput.attributesManager.setSessionAttributes(attributes);
            
            // task取得
            const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

            // const task = JSON.parse(await sendApiRequest(options));

            const requestConfig = {
                baseURL: `${config.API_PROTO}://${config.API_HOST}/`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                timeout: 5000
            };
            
            const task = await axios.get(`/api/tasks/${previousIndex}?idtype=list`, requestConfig);
            
            // ユーザーへの返信
            const repromptText = helper.getMessage(handlerInput, 'ASK_READ_RESUME');
            const taskText = helper.getMessage(
                                handlerInput,
                                'READ_TASK',
                                {index: previousIndex+1, deadline: task.deadline, title: task.title});
    
            return handlerInput.responseBuilder
                .speak(`${taskText}`)
                .reprompt(repromptText)
                .getResponse();
        }
    }
};