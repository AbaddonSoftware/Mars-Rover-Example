const Command = require('./command.js');

class Message {
    constructor(name, commands) {
        this.name = name;
        if (!name) {
            throw Error('name required.');
        }
        this.commands = commands;
    }
}


module.exports = Message;
