const assert = require('assert');
const Message = require('../message.js');
const Command = require('../command.js');


describe("Message class", function() {
    it("throws error if a name is NOT passed into the constructor as the first parameter",
        function() {
            assert.throws(function() { new Message(); }, { message: 'name required.' });
        });

    it("constructor sets name",
        function() {
            let testObject = new Message('test');
            assert.strictEqual(testObject.name, 'test');
        });

    it("contains a commands array passed into the constructor as 2nd argument",
        function() {
            let testCommand = new Command('test', 'test');
            let testMessage = new Message('test', [testCommand, testCommand]);
            let isArray = Array.isArray(testMessage.commands);
            let isNotEmpty = testMessage.commands.length >= 1;
            let consistsOfCommandObjects = testMessage.commands.every
                (element => element instanceof Command);
            assert.strictEqual(isArray && isNotEmpty && consistsOfCommandObjects, true);
        });
});
