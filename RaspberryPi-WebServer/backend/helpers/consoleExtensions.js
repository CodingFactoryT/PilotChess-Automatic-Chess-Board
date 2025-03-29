console.logConnectionStatus = function (...args) {
	console.log("\x1b[36m%s\x1b[0m", ...args); //log message in cyan
};

console.error = function (...args) {
	console.log("\x1b[31m%s\x1b[0m", ...args); //log error in red
};

console.status = function (...args) {
	console.log("\x1b[32m%s\x1b[0m", ...args); //log status in green
};
