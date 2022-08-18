const DAO = require('./DAO.js');
const md5 = require('md5');

class RequestController {

    constructor() {
        this.dao = new DAO();
    }

    async register(username, password, email, birthdate) {
        //Ensure the input fields exists and are not empty
        if (username && password && email && birthdate) {
            password = md5(password);
            const data = await this.dao.register(username, password, email, birthdate);
            return { ok: data[0], error: data[1] };
        }
        else {
            return { ok: false, error: -2 }
        }
    }

    async login(username, password) {
        //Ensure the input fields exists and are not empty
        if (username && password) {
            password = md5(password);
            const data = await this.dao.login(username, password);
            console.log({ ok: data[0], error: data[1], data: data[2] })
            return { ok: data[0], error: data[1], data: data[2] }
        }
        else {
            return { ok: false, error: -1, data: { username: '' } };
        }
    }

    async searchUser(username) {
        if (!username || username == null) { //username nullo
            return { ok: false, error: -4, data: { username: '' } }
        }
        else {
            const data = await this.dao.searchUser(username);
            return { ok: true, error: data[1], data: data[2] };
        }
    }

    async getBestRoadmap() {
        const data = await this.dao.getBestRoadmap();
        return { ok: data[0], error: data[1], data: data[2]}
    }


    async getExNovoStages() {
        const data = await this.dao.getExNovoStages();
        return { ok: data[0], error: data[1], data: data[2]}
    }

    async getDataUser(id) {
        const data = await this.dao.getDataUser(id);
        return { ok: data[0], error: data[1], data: data[2]}
    }

}

module.exports = RequestController;