class Rover {
    constructor(position) {
        this.position = Number(position);
        this.mode = 'NORMAL';
        this.generatorWatts = 110;
        if (!(typeof this.position === 'number') || !this.mode || !this.generatorWatts) {
            throw Error(`Position required. mode should be '${this.mode}' and generatorWatts should be ${this.generatorWatts}.`);
        }
    }

    receiveMessage(message) {
        let resultArray = [];
        let commandResult;
        for (let command of message.commands) {
            switch (command.commandType) {
                case 'MOVE':
                    let isNumber = typeof Number(command.value) === 'number';
                    let systemNormal = this.mode !== 'LOW_POWER';
                    this.position = isNumber ? this.position + command.value : this.position;
                    commandResult = { completed: isNumber && systemNormal };
                    break;
                case 'STATUS_CHECK':
                    commandResult = { completed: true, roverStatus: { mode: this.mode, generatorWatts: this.generatorWatts, position: this.position } };
                    break;
                case 'MODE_CHANGE':
                    this.mode = command.value;
                    commandResult = { completed: true };
                    break;
                default:
                    commandResult = { completed: false, message: `Invalid input entered... Command Type ${command.commandType} and value is ${command.value}.` };
                    break;
            }
            resultArray.push(commandResult);
        }
        return { message: message.name, results: resultArray };
    }

};


module.exports = Rover;
