'use strict';

const {describe, it} = require('mocha');
const {assert} = require('chai');
const {createDummyTx} = require('../testUtil');

const factory = require('../testFactory');

describe('MessageInventory', () => {
    before(async function() {
        this.timeout(15000);
        await factory.asyncLoad();
    });

    after(async function() {
        this.timeout(15000);
    });

    it('should create empty message', async () => {
        const msg = new factory.Messages.MsgInv();
        assert.isOk(msg.network);
        assert.equal(msg.network, factory.Constants.network);
        assert.isOk(msg.isInv());
    });

    it('should set/get inventory', async () => {
        const msg = new factory.Messages.MsgInv();

        const inv = new factory.Inventory();
        const tx = new factory.Transaction(createDummyTx());
        inv.addTx(tx);

        const block = new factory.Block();
        block.addTx(tx);
        inv.addBlock(block);

        msg.inventory = inv;

        const restoredInv = msg.inventory;
        assert.isOk(restoredInv);
    });

    it('should encode/decode message', async () => {
        const msg = new factory.Messages.MsgInv();

        const inv = new factory.Inventory();
        const tx = new factory.Transaction(createDummyTx());
        inv.addTx(tx);

        const block = new factory.Block();
        block.addTx(tx);
        inv.addBlock(block);

        msg.inventory = inv;
        const buffMsg = msg.encode();
        assert.isOk(Buffer.isBuffer(buffMsg));
        const restoredMsg = new factory.Messages.MsgInv(buffMsg);

        const wrapper = () => restoredMsg.inventory;
        assert.doesNotThrow(wrapper);
    });

    it('should fail to decode malformed message', async () => {
        const msg = new factory.Messages.MsgInv();
        msg.payload = Buffer.from('123');

        const wrapper = () => msg.inventory;
        assert.throws(wrapper);
    });

});