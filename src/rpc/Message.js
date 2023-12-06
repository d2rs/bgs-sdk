const { bgs } = require('../../bundle.js');
const { ErrorCode } = require('./ErrorCode.js');

class Message {
  /** @type {bgs.protocol.Header} */
  header;

  /** @type {Uint8Array} */
  payload;

  /**
   * @param {WebSocket.RawData} data 
   * @returns {Message}
   */
  static deserialize(data) {
    const rawHeaderLength = data.readUInt16BE(0);
    const rawHeader = data.subarray(2, rawHeaderLength + 2);

    const msg = new Message;
    msg.header = bgs.protocol.Header.decode(rawHeader, rawHeaderLength);
    msg.payload = data.subarray(rawHeaderLength + 2);
    return msg;
  }

  serialize() {
    let payloadLength = 0;
    if (this.payload !== null) {
      if (Number.isInteger(this.payload)) {
        this.header.status = this.payload;
      } else {
        this.header.size = this.payload.length;
        payloadLength = this.payload.length;
        this.header.status = ErrorCode.OK;
      }
    }

    const headerEncoded = bgs.protocol.Header.encode(this.header).finish();
    const buffer = new ArrayBuffer(2 + headerEncoded.length + payloadLength);
    const bufferView = new DataView(buffer);
    // write encoded header length
    bufferView.setUint16(0, headerEncoded.length, false);
    // write encoded header
    headerEncoded.map((value, index) => { bufferView.setUint8(2 + index, value); });
    // write payload if any
    if (payloadLength > 0) {
      this.payload.map((value, index) => { bufferView.setUint8(2 + headerEncoded.length + index, value); });
    }
    return buffer;
  }
}

module.exports = {
  Message,
}