const Conversation = require('../../custom/node_modules/alexa-conversation-model-assert/dist/src');
const app = require('../../custom');
const helper = require('./helper');
const config = require('../../custom/config');
const td = require('../../custom/node_modules/testdouble');
const axios = require('../../custom/node_modules/axios');

describe('タスク確認', () => {
    before(() => {
        if(config.TESTDOUBLE_ENABLE) {
            // アクセストークン取得処理のスタブ
            td.replace(
                helper,
                'fetchAccessToken',
                (username, password) => {
                    return 'xxxxxxxxx-yyyyyyyyy-zzzzzzzzz';
                }
            );

            // axiosのスタブ作ってくよ
            td.replace(axios, 'get');

            // タスク登録件数取得APIのスタブ
            td.when(
                axios.get(
                    '/api/tasks/count',
                    td.matchers.anything()
                )
                // ,{delay: 300} // 省略可
            ).thenResolve(2);

            // パスで指定したインデックスのタスク内容取得APIのスタブ
            const firstTask = {
                title: 'タスク1件目',
                deadline: '2018-11-11'
            };
            td.when(
                axios.get(
                    '/api/tasks/0?idtype=list',
                    td.matchers.anything()
                )
                // ,{delay: 300} // 省略可
            ).thenResolve(firstTask);

            const secondTask = {
                title: 'タスク2件目',
                deadline: '2018-12-12'
            };
            td.when(
                axios.get(
                    '/api/tasks/1?idtype=list',
                    td.matchers.anything()
                )
                // ,{delay: 300} // 省略可
            ).thenResolve(secondTask);
        }
    });

    it('正常系', async () => {
        accesstoken = await helper.fetchAccessToken('test@example.com', 'password');

        const onLaunchOptions = {
            context: {
                System: {
                    user: {accessToken: accesstoken}
                }
            }
        };

        // test
        const condition = {
            handler: app.handler,
            request: {
                locale: 'ja-JP'
            },
            testDescription: 'タスクが複数件（2件）登録されているときの、「前へ」「次へ」などの応答が正常であること'
        };

        Conversation.init(condition)
            .requestIntent('LaunchRequest', onLaunchOptions)
                .equalPlain({
                    speech: 'ようこそ、タスクスケジューラーへ。タスクの登録と確認、どちらにしますか？',
                    reprompt: '登録か確認のいずれかをおっしゃってください。'
                })
            .requestIntent('SelectConfirmIntent')
                .equalPlain({
                    speech: `登録済みのタスクは2件です。一件ずつ読み上げますか？`,
                    reprompt: `登録済みのタスクは2件です。一件ずつ読み上げますか？`
                })
            .requestIntent('AMAZON.NextIntent')
                .equalPlain({
                    speech: '次に進みたいときは次へ、戻りたいときは前へ、終了したいときは終わりと言ってください。1件目。期日、2018-11-11。内容、タスク1件目。',
                    reprompt: '次に進みたいときは次へ、戻りたいときは前へ、終了したいときは終わりと言ってください。'
                })
            .requestIntent('AMAZON.NextIntent')
                .equalPlain({
                    speech: '2件目。期日、2018-12-12。内容、タスク2件目。',
                    reprompt: '次に進みたいときは次へ、戻りたいときは前へ、終了したいときは終わりと言ってください。'
                })
            .requestIntent('AMAZON.NextIntent')
                .equalPlain({
                    speech: '登録済みのタスクは以上です。戻りたいときは前へ、終了したいときは終わりと言ってください。',
                    reprompt: '登録済みのタスクは以上です。戻りたいときは前へ、終了したいときは終わりと言ってください。'
                })
            .requestIntent('AMAZON.PreviousIntent')
                .equalPlain({
                    speech: '1件目。期日、2018-11-11。内容、タスク1件目。',
                    reprompt: '次に進みたいときは次へ、戻りたいときは前へ、終了したいときは終わりと言ってください。'
                })
            .requestIntent('AMAZON.PreviousIntent')
                .equalPlain({
                    speech: 'これ以上は前に戻れません。まだ続ける場合は、登録か確認とおっしゃってください。',
                    reprompt: 'これ以上は前に戻れません。まだ続ける場合は、登録か確認とおっしゃってください。'
                })
            .end();
    });
});