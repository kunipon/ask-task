"use strict";
const Alexa = require('ask-sdk-core');
const common = require('./commonHandlers');
const interceptor = require('./interceptor');
const regist = require('./registHandler');
const confirm = require('./confirmHandler');

exports.handler = Alexa.SkillBuilders.custom()
     .addRequestHandlers(common.LaunchHandler,
                         common.SessionEndedRequestHandler,
                         common.NoIntentHandler,
                         regist.SelectRegistHandler,
                         regist.TaskRegistHandler,
                         confirm.SelectConfirmHandler,
                         confirm.SpeechNextTaskHandler,
                         confirm.SpeechPreviousTaskHandler,
                         common.UnhandledIntentHandler)
                        //  HelpIntentHandler,
                        //  CancelAndStopIntentHandler)
     .addRequestInterceptors(interceptor.LocalizationInterceptor)
     .addErrorHandlers(common.ErrorHandler)
     .lambda();