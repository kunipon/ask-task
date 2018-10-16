const Conversation = require('../../custom/node_modules/alexa-conversation-model-assert/dist/src');
const app = require('../../custom'); 

const condition = {
    handler: app.handler,
    request: {
        locale: 'ja-JP'
    },
    testDescription: 'Not log-in user launch.'
};

const scenario = Conversation.init(condition);

scenario
    .requestIntent('LaunchRequest')
    .equalSsml({
        speech: "<speak>スキルを利用するためにログインを許可してください。</speak>"
    })
    .end();