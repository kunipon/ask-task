const helper = require('./helper');

module.exports = {
    /**
     * 初回呼び出し、もしくは「最初に戻って」などの発話によって呼び出されるインテント
     */
    LaunchHandler: {
        canHandle(handlerInput) {
            return (
                handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
                (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
                  handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent')
            );
        },
        handle(handlerInput) {
            const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
            
            // アカウントリンク必須
            if (accessToken === undefined) {
                // トークン未定義の場合はユーザーに許可を促す
                const speechText = helper.getMessage(handlerInput, 'PLEASE_LOGIN');
                
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .withLinkAccountCard()
                    .getResponse();
            }
    
            const speechText = helper.getMessage(handlerInput, 'WELCOME');
            const repromptText = helper.getMessage(handlerInput, 'WELCOME_REPROMPT');
            
            // セッションに保存
            let attributes = handlerInput.attributesManager.getSessionAttributes();
            attributes.action = 'launch';
            handlerInput.attributesManager.setSessionAttributes(attributes);
    
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    },
    /**
     * NoIntentハンドラー
     * 今回のスキルでは終了を意味するときに来るようにVUI設計している（つもり）
     */
    NoIntentHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
    
            return request.type === 'IntentRequest'
                && request.intent.name === 'NoIntent';
        },
        handle(handlerInput) {
            const speechText = helper.getMessage(handlerInput, 'ASK_RESUME');
            const repromptText = helper.getMessage(handlerInput, 'ASK_FINISH');
    
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    },
    /**
     * セッション終了時に呼ばれるハンドラー
     */
    SessionEndedRequestHandler: {
        canHandle(handlerInput) {
              const request = handlerInput.requestEnvelope.request;
              return request.type === 'SessionEndedRequest';
          },
          handle(handlerInput) {
              console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
              // TODO: 必要であればセッション情報をDynamoDBに保存して永続化
              return handlerInput.responseBuilder.getResponse();
          }
    },
    /**
     * 該当するハンドラーがないときに呼ばれるハンドラー
     */
    UnhandledIntentHandler: {
        canHandle() {
            return true;
        },
        handle (handlerInput) {
            console.info('Unhandled');

            const speechText = helper.getMessage(handlerInput, 'DEFAULT_ERROR');
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
    },
    /**
     * エラー発生時に呼ばれるハンドラー
     */
    ErrorHandler: {
        canHandle() {
            return true;
        },
        handle(handlerInput, error) {
            console.log(`Error handled: ${error.message}`);
            console.info('Full error: ', error);
            
            const speechText = helper.getMessage(handlerInput, 'DEFAULT_ERROR');
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }  
    }
};