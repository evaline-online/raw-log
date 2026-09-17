const { RawLogPlugin } = require('./raw-log.js');

const adapters = {
  openai: (client, options) => {
    const logger = new RawLogPlugin(options);
    const originalCreate = client.chat.completions.create.bind(client.chat.completions);
    client.chat.completions.create = async (params) => {
      const userMsg = params.messages?.find(m => m.role === 'user');
      if (userMsg) logger.logUserMessage(userMsg.content, { model: params.model });
      return originalCreate(params);
    };
    return client;
  },

  anthropic: (client, options) => {
    const logger = new RawLogPlugin(options);
    const originalCreate = client.messages.create.bind(client.messages);
    client.messages.create = async (params) => {
      const userMsg = params.messages?.find(m => m.role === 'user');
      if (userMsg) logger.logUserMessage(userMsg.content, { model: params.model });
      return originalCreate(params);
    };
    return client;
  },

  langchain: (chain, options) => {
    const logger = new RawLogPlugin(options);
    const originalCall = chain.call.bind(chain);
    chain.call = async (inputs) => {
      const input = typeof inputs === 'string' ? inputs : JSON.stringify(inputs);
      logger.logUserMessage(input);
      return originalCall(inputs);
    };
    return chain;
  },

  generic: (handler, options) => {
    const logger = new RawLogPlugin(options);
    return async (input, ...args) => {
      logger.logUserMessage(typeof input === 'string' ? input : JSON.stringify(input));
      return handler(input, ...args);
    };
  }
};

function createLogger(options) {
  return new RawLogPlugin(options);
}

module.exports = { adapters, createLogger, RawLogPlugin };
