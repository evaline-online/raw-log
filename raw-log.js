class RawLogPlugin {
  constructor(options = {}) {
    this.logFile = options.logFile || 'raw.log';
    this.fs = require('fs');
    this.path = require('path');
  }

  logUserMessage(message, metadata = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      role: 'user',
      content: message,
      ...metadata
    };
    this.append(entry);
    return entry;
  }

  append(entry) {
    const line = JSON.stringify(entry) + '\n';
    this.fs.appendFileSync(this.logFile, line);
  }

  getLogs() {
    if (!this.fs.existsSync(this.logFile)) return [];
    return this.fs.readFileSync(this.logFile, 'utf-8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(JSON.parse);
  }
}

if (typeof module !== 'undefined') {
  module.exports = { RawLogPlugin };
}
