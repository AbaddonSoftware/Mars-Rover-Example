const assert = require('assert');
const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

describe("Rover class",
    function() {
        it("constructor sets position and default values for mode and generatorWatts",
            function() {
                let roverObject = new Rover(1);
                let isPositionSet = roverObject.position === 1;
                let isModeDefault = roverObject.mode === 'NORMAL';
                let isGeneratorWattsDefault = roverObject.generatorWatts === 110;
                assert.strictEqual(isPositionSet && isModeDefault && isGeneratorWattsDefault, true);
            });

        it("response returned by receiveMessage contains name of message",
            function() {
                let commandObject = new Command('test', 'test');
                let messageObject = new Message('name', [commandObject]);
                let roverMessage = new Rover(0).receiveMessage(messageObject);
                assert.strictEqual(roverMessage.message, 'name');
            });

        it("response returned by receiveMessage includes two results if two commands are sent in the message",
            function() {
                let commandObject = new Command('test', 'test');
                let messageObject = new Message('name', [commandObject, commandObject]);
                let roverObject = new Rover(0);
                let roverMessage = roverObject.receiveMessage(messageObject);
                let resultLength = roverMessage.results.length;
                assert.strictEqual(resultLength, 2);
            });

        it("responds correctly to status check command",
            function() {
                let commandObject = new Command('STATUS_CHECK');
                let setMessage = 'check status';
                let messageObject = new Message(setMessage, [commandObject]);
                let setPosition = 0;
                let roverObject = new Rover(setPosition);
                let roverMessage = roverObject.receiveMessage(messageObject);
                assert.deepStrictEqual(roverMessage,
                    {
                        message: setMessage,
                        results: [{
                            completed: true,
                            roverStatus: {
                                mode: 'NORMAL',
                                generatorWatts: 110,
                                position: setPosition
                            }
                        }
                        ]
                    }
                );
            });

        it("responds correctly to mode change command",
            function() {
                let roverObject = new Rover(0);
                let commandObject = new Command('MODE_CHANGE', 'LOW_POWER');
                let messageObject = new Message('Mode Change Command', [commandObject]);
                roverObject.receiveMessage(messageObject);
                assert.strictEqual(roverObject.mode, 'LOW_POWER');
            });

        it("responds with false completed value when attempting to move in LOW_POWER mode",
            function() {
                let roverObject = new Rover(0);
                let commandObject1 = new Command('MODE_CHANGE', 'LOW_POWER');
                let commandObject2 = new Command('MOVE', 10000);
                let messageObject = new Message('Mode Change to Low Power and then attempt Move Command',
                    [commandObject1, commandObject2]);
                let roverMessage = roverObject.receiveMessage(messageObject);
                let complete = roverMessage.results[1].completed;
                assert.strictEqual(complete, false);
            });

        it("responds with position for move command",
            function() {
                let commandObject = new Command('MOVE', 10000);
                let messageObject = new Message('Does it move?', [commandObject]);
                let roverObject = new Rover(0);
                roverObject.receiveMessage(messageObject);
                assert.strictEqual(roverObject.position, 10000);
            });

        it("completed false and a message for an unknown command",
            function() {
                let commandObject = new Command(['GarbageIn'], 'GarbageOut');
                let messageObject = new Message('GiGo Command', [commandObject]);
                let roverObject = new Rover(0);
                let roverMessage = roverObject.receiveMessage(messageObject);
                let complete = roverMessage.results[0].completed;
                let message = roverMessage.results[0].message;
                let checks = complete === false &&
                    typeof message === 'string';
                assert.strictEqual(checks, true);
            });

        it("self-destruct command causes mars rover to blow up the planet mars",
            function() {
                pending('Mwahahahaahahaha!!! Will write in the future.');
            });

    });
