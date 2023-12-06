module.exports = {
  /**
   * 
   * @param {String} str 
   */
  fnv1a32: function (str) {
    let hash = 0x811C9DC5;
    for (let i = 0; i < str.length; ++i) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
  },

  camelize: function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
}