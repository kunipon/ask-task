'use strict';
const SKILL_NAME = 'task scheduler';
const SKILL_NAME_JA = 'タスクスケジューラー';

module.exports = Object.freeze({
    'en-US': {
        translation: {
            PLEASE_LOGIN: 'Please, log-in.',
            WELCOME: 'welcome',
            WELCOME_REPROMPT: 'Please say registraiton or confirm.',
            DEFAULT_ERROR: 'Oops, something went wrong.',
            TELLME_REGIST_CONTENTS: 'Please, tell me task-title and deadline.',
            TASK_COUNT: 'There are 3 registered tasks. Would you like me to read your tasks one by one?',
            ASK_RESUME: 'hoge',
            ASK_FINISH: 'hoge',
            REGIST_FINISH: 'hoge',
            TASK_READ_LIMIT: 'hoge',
            TASK_READ_CANT_BACK: 'hoge',
            ASK_READ_RESUME: 'hoge',
            READ_TASK: 'hoge'
        }
    },
    'ja-JP': {
        translation: {
            PLEASE_LOGIN: 'スキルを利用するためにログインを許可してください。',
            WELCOME: 'ようこそ、タスクスケジューラーへ。タスクの登録と確認、どちらにしますか？',
            WELCOME_REPROMPT: '登録か確認のいずれかをおっしゃってください。',
            DEFAULT_ERROR: 'すいません。エラーが発生したようです。',
            TELLME_REGIST_CONTENTS: 'タスクの内容と期日を教えてください。',
            TASK_COUNT: '登録済みのタスクは{{count}}件です。一件ずつ読み上げますか？',
            ASK_RESUME: 'まだ続ける場合は、登録か確認とおっしゃってください。',
            ASK_FINISH: '終了する場合は、終わりと言ってください。',
            REGIST_FINISH: 'タスクを登録しました。まだ続ける場合は、登録か確認とおっしゃってください。',
            TASK_READ_LIMIT: '登録済みのタスクは以上です。戻りたいときは前へ、終了したいときは終わりと言ってください。',
            TASK_READ_CANT_BACK: 'これ以上は前に戻れません。まだ続ける場合は、登録か確認とおっしゃってください。',
            ASK_READ_RESUME: '次に進みたいときは次へ、戻りたいときは前へ、終了したいときは終わりと言ってください。',
            READ_TASK: '{{index}}件目。期日、{{deadline}}。内容、{{title}}。'
        }
    }
});