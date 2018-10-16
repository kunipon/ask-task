module.exports = {
    getMessage (handlerInput, label, options) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return requestAttributes.t(label, options);
    },
};