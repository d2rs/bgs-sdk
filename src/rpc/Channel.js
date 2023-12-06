const EventEmitter = require('node:events');
const WebSocket = require('ws');

const { Message } = require('./Message.js');
const { loadService, getMethodName } = require('./Service.js');
const { bgs } = require('../../bundle.js');

class Channel extends EventEmitter {
  /** @type {number} */
  token = 1;

  /** @type {Map<number, protobuf.RPCImplCallback>} */
  pendingRequests = new Map();

  /** @type {WebSocket} */
  ws = null;

  /** @type {Map<number, protobuf.rpc.Service>} */
  services = new Map();

  constructor(ws = null) {
    super();

    if (ws) {
      this.ws = ws;
      this.ws.on('message', data => this.handleMessage(data));
    }
  }

  addService(name) {
    const svc = loadService(this, name);
    if (svc.callMethod) {
      this.services.set(svc.hash, svc);
    }
    return svc;
  }

  sendRequest(service, method, data, callback) {
    const message = new Message;
    message.header = bgs.protocol.Header.create({
      token: this.token,
      serviceId: service,
      serviceHash: service,
      methodId: method,
      isResponse: false,
      size: data.length,
    });
    message.payload = data;
    this.pendingRequests.set(this.token, callback);
    this.ws.send(message.serialize());

    ++this.token;
  }

  handleMessage(data) {
    try {
      const message = Message.deserialize(data);
      //console.log(`Request header ${JSON.stringify(request.header)}`);

      if (message.header.isResponse || message.header.serviceId == 0xFE) {
        this.handleRequest(message);
      } else {
        this.handleResponse(message);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      if (error.stack) {
        console.log(error.stack);
      }
      this.ws.terminate();
    }
  }

  handleRequest(message) {
    const callback = this.pendingRequests.get(message.header.token);
    if (!callback) {
      throw Error(`Response callback for callback with token ${message.header.token} not found`);
    }
    this.pendingRequests.delete(message.header.token);

    if (message.header.status) {
      callback(`method returned error ${message.header.status}`, null);
    }

    callback(null, message.payload);
  }

  handleResponse(message) {
    const serviceHash = message.header.serviceHash ? message.header.serviceHash : message.header.serviceId;
    if (!this.services.has(serviceHash)) {
      console.log(`Server tried to call unimplemented method ${getMethodName(serviceHash, message.header.methodId)}`);
      // could respond with unimplemented here
      return;
    }

    const svc = this.services.get(serviceHash);
    // TODO: this could use Message.create(request) if we modify it to take an object instead
    const response = new Message;
    response.header = message.header;
    response.header.serviceId = message.header.serviceId > 0xFE ? message.header.serviceId : 0xFE;
    response.header.objectId = 2525111537;
    response.header.isResponse = true;
    if (this.clientid) {
      response.header.clientId = this.clientid;
    }
    svc.callMethod(message.header.methodId, message.payload).then(data => {
      response.payload = data;
      // null means no response
      if (response.payload) {
        this.ws.send(response.serialize());
      }
      //console.log(`Response header ${JSON.stringify(response.header)}`);
    }).catch(console.log);
  }
}

module.exports = {
  Channel
}