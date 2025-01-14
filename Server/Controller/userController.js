const md5 = require('md5');
const config = require('../config/config.js');

class UserController {
    constructor(dao) {
        this.dao = dao;
    }
    async register(username, password, email, birthdate) {
        //Ensure the input fields exists and are not empty
        if (username && password && email && birthdate) {

            var isBanned = (await this.dao.isBanned(email))[2].banned;

            if (isBanned) {
                return { ok: false, error: -777, data: {} } //banned alert
            } else {
                password = md5(password);
                const data = await this.dao.register(username, password, email, birthdate);
                return { ok: data[0], error: data[1], data: data[2] };
            }
        }
        else {
            return { ok: false, error: -2 }
        }
    }
    async login(username, password) {
        if (username && password) {
            password = md5(password);
            const data = await this.dao.login(username, password);
            return { ok: data[0], error: data[1], data: data[2] }
        }
        else {
            return { ok: false, error: -1, data: { username: '' } };
        }
    }
    async getDataUser(id_query, id_session) {
        const data = await this.dao.getDataUser(id_query, id_session);
        return { ok: data[0], error: data[1], data: data[2] }
    }
    async getUserStatus(id_session) {
        const data = await this.dao.getMinimalDataUser(id_session, id_session); //use getdatauser again but in anotha way
        return { ok: data[0], error: data[1], data: data[2] }
    }

    async setRoadmapFavouriteState(user_id, roadmap_id, newStatus) {
        const data = await this.dao.setRoadmapFavouriteState(user_id, roadmap_id, newStatus);
        return { ok: data[0], error: data[1], data: data[2] };
    }

    async setRoadmapCheckedState(user_id, roadmap_id, newStatus) {
        const data = await this.dao.setRoadmapCheckedState(user_id, roadmap_id, newStatus);
        return { ok: data[0], error: data[1], data: data[2] };
    }
    async updateAvatar(id, new_avatar_index) {
        if(new_avatar_index !== null && new_avatar_index > 0)
        {
            const data = await this.dao.updateAvatar(id, "/storage/avatar/Avatar_" + new_avatar_index + ".png");
            return { ok: data[0], error: data[1], data: data[2] }
        }
        
    }

}

module.exports = UserController;