const config = require('../../custom/config');
const axios = require('../../custom/node_modules/axios');

module.exports = {
    /**
     * アクセストークン取得は、本来alexa serviceがやってくれるが
     * ローカルテストなので自前で行う。
     * ただし、基本的にはスタブが使用される。
     * API越しに取得したいときは{workspaceFolder}/custom/config.jsのTESTDOUBLE_ENABLEをfalseにすること。
     * テスト使用なので、アクセストークン取得方法はリソースオーナーパスワードクレデンシャルでコードグラントではない。
     * @param {*} username 
     * @param {*} password 
     */
    async fetchAccessToken(username, password) {
        const form = {
            grant_type: "password",
            username: username,
            password: password
        };
    
        const requestConfig = {
            baseURL: `${config.API_PROTO}://${config.API_HOST}/`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            auth: {
                username: 'alexa-skill',
                password: 'alexa-skill-secret'
            },
            params: form,
            timeout: 5000
        };
    
        const response = await axios.post('/oauth/token', undefined, requestConfig);
    
        return response.data.access_token;
    },
};