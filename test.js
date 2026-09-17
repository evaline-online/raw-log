const { RawLogPlugin } = require('./raw-log.js');
const { adapters, createLogger } = require('./adapters.js');

async function test() {
  const logger = createLogger({ logFile: 'test-raw.log' });

  logger.logUserMessage("Hello, this is a test message");
  logger.logUserMessage("Another user message", { sessionId: "abc-123" });

  console.log("Logs:", logger.getLogs());

  const wrapped = adapters.generic(async (msg) => `Response to: ${msg}`);
  const result = await wrapped("Test input");
  console.log("Result:", result);
  console.log("Logs after:", logger.getLogs());
}

test();
