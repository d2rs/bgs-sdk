const { bgs } = require('./bundle.js');
const { classic } = require('./bundle.js');

const { Channel } = require('./src/rpc/Channel.js');
const { ErrorCode } = require('./src/rpc/ErrorCode.js');
const { Message } = require('./src/rpc/Message.js');
const { loadService, getMethodName } = require('./src/rpc/Service.js');

module.exports = {
  bgs,
  classic,
  Channel,
  ErrorCode,
  Message,
  loadService,
  getMethodName,
};