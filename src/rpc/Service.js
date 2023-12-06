const protobuf = require('protobufjs');

const { ErrorCode } = require('./ErrorCode.js');
const { fnv1a32, camelize } = require('../utils.js');

const jsonDescriptor = require('../../bundle-json.json');
const root = protobuf.Root.fromJSON(jsonDescriptor);

const kOptionDescriptorName = '(service_options).descriptor_name';
const kOptionDescriptorHash = '(service_options).descriptor_hash';
// NOTE: inbound and outbound is reversed for servers 
// because the protos are dumped from the client. This
// can be fixed in the dumper to choose if it's for server/client
// then reverse the options there instead which makes it always be correct.
const kOptionInbound = '(sdk_service_options).outbound';
const kOptionOutbound = '(sdk_service_options).inbound';
const kOptionMethodId = '(method_options).id';

const serviceMethodNames = new Map();

/**
 * 
 * @param {Connection} conn 
 * @param {string} name 
 */
function loadService(conn, name) {
  const Svc = root.lookupService(name);
  let svc = null;
  if (Svc.getOption(kOptionOutbound)) {
    svc = Svc.create((method, requestData, callback) => {
      /** @type {protobuf.Method} */
      const m = svc.methods.get(method.name);
      svc.conn.sendRequest(svc.hash, m.getOption(kOptionMethodId), requestData, callback);
    });
  } else {
    svc = Svc.create(() => {
      throw Error(`tried to call method on inbound service ${Svc.name}`);
    });
  }

  if (Svc.getOption(kOptionDescriptorName)) {
    svc.hash = fnv1a32(Svc.getOption(kOptionDescriptorName));
  } else if (Svc.getOption(kOptionDescriptorHash)) {
    svc.hash = Svc.getOption(kOptionDescriptorHash);
  }

  serviceMethodNames[svc.hash] = {
    name: Svc.name,
    fullName: Svc.fullName,
    methods: new Map(),
  }

  /** @type {Map<string, protobuf.Method>} */
  svc.methods = new Map();
  for (const method of Svc.methodsArray) {
    svc.methods.set(method.name, method);
    serviceMethodNames[svc.hash].methods[method.getOption(kOptionMethodId)] = {
      name: method.name,
      fullName: method.fullName,
    };
    if (!Svc.getOption(kOptionOutbound)) {
      // replace default methods with ones that return NOT_IMPLEMENTED
      svc[camelize(method.name)] = function () {
        if (!method.responseType.includes('NO_RESPONSE')) { return ErrorCode.NOT_IMPLEMENTED; }
      }
    }
  }

  if (Svc.getOption(kOptionInbound)) {
    svc.callMethod = async function (methodId, data) {
      for (const [name, method] of svc.methods) {
        if (method.getOption(kOptionMethodId) == methodId) {
          const req = method.resolvedRequestType.decode(data);
          if (process.env.RPC_LOG_PROTO == 1) {
            if (method.name !== "Echo") {
              console.log(`${Svc.name}::${name} ${JSON.stringify(req)}`);
            }
          }
          const res = await svc[camelize(name)](req);
          if (method.responseType.includes('NO_RESPONSE') || res === null) {
            return null;
          }
          if (process.env.RPC_LOG_PROTO == 1) {
            if (method.name !== "Echo") {
              console.log(`${Svc.name}::${name} ${JSON.stringify(res)}`);
            }
          }
          if (Number.isInteger(res)) { return res; }
          return method.resolvedResponseType.encode(res).finish();
        }
      }
    }
  }
  svc.conn = conn;
  return svc;
}

function getMethodName(service, method) {
  if (!serviceMethodNames.get(service)) { return `0x${service.toString(16)}::${method}`; }
  if (!serviceMethodNames[service].methods.get(method)) { return `${serviceMethodNames[service].name}::${method}`; }
  return `${serviceMethodNames[service].name}::${serviceMethodNames[service].methods[method].name}`;
}

module.exports = {
  loadService,
  getMethodName,
}