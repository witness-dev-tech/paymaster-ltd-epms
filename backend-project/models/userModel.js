const db = require('../config/db');

class User {
    static async findByUsername(username) {
        const [rows] = await db.execute('SELECT * FROM Users WHERE username = ?', [username]);
        return rows[0];
    }

    static async create(username, passwordHash) {
        const [result] = await db.execute(
            'INSERT INTO Users (username, passwordHash) VALUES (?, ?)',
            [username, passwordHash]
        );
        return result.insertId;
    }
}

module.exports = User;