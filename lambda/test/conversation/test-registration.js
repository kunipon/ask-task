const Conversation = require('../../custom/node_modules/alexa-conversation-model-assert');
const axios = require('../../custom/node_modules/axios');
const app = require('../../custom');
const helper = require('./helper');
const config = require('../../custom/config');
const td = require('../../custom/node_modules/testdouble');

describe('タスク登録', () => {
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

            // タスク登録APIのスタブ
            // TODO: 異常系テスト増やしたときとかにanythingを変更して分岐
            td.replace(axios, 'post');
            td.when(
                axios.post(
                    td.matchers.anything(),
                    td.matchers.anything(),
                    td.matchers.anything()
                )
                // ,{delay: 300} // 省略可
            ).thenResolve({status: 201, statusText: ''});
        }
    });

    afterEach(() => {
        if(config.TESTDOUBLE_ENABLE) {
            td.reset();
        }
    });

    it('正常系', async () => {
        const accesstoken = await helper.fetchAccessToken('test@example.com', 'password');

        const onLaunchOptions = {
            context: {
                System: {
                    user: {accessToken: accesstoken}
                }
            }
        };

        const onTaskRegistOptions = {
            request: {
                intent: {
                    slots: {
                        date: {
                            name: 'date',
                            value: '2018-10-11'
                        },
                        title: {
                            name: 'title',
                            value: 'テストタスク'
                        }
                    }
                }
            },
            context: {
                System: {
                    user: {accessToken: accesstoken}
                }
            }
        };

        const condition = {
            handler: app.handler,
            request: {
                locale: 'ja-JP'
            },
            testDescription: 'Task registration.',
            // isEnabledTrace: true
        };

        Conversation.init(condition)
            .requestIntent('LaunchRequest', onLaunchOptions)
                .equalPlain({
                    speech: 'ようこそ、タスクスケジューラーへ。タスクの登録と確認、どちらにしますか？',
                    reprompt: '登録か確認のいずれかをおっしゃってください。'
                })
            .requestIntent('SelectRegistIntent')
                .equalPlain({
                    speech: 'タスクの内容と期日を教えてください。',
                    reprompt: 'タスクの内容と期日を教えてください。'
                })
            .requestIntent('TaskRegistIntent', onTaskRegistOptions)
                .equalPlain({
                    speech: 'タスクを登録しました。まだ続ける場合は、登録か確認とおっしゃってください。',
                    reprompt: 'タスクを登録しました。まだ続ける場合は、登録か確認とおっしゃってください。'
                })
            .end();
    });
});