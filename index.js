const fs = require('fs');
const http = require('http');
const config = require('config');
const Web3 = require('web3');
const powerSwitcher = require('./power-switcher');
const { StreemWatcher } = require('./streem-watcher');

const streemAdapterAbi = JSON.parse(fs.readFileSync(config.contract.abiPath, 'utf8'));
const web3 = new Web3(config.network.rpcUrl);
const contract = new web3.eth.Contract(streemAdapterAbi, config.contract.address);
const sw = new StreemWatcher(contract, config.eventNames, config.receiver);

powerSwitcher.powerOff(config.powerPort);
sw.start();
sw.onStreemsStarted = () => {
  console.log('Streems started: power on.');
  powerSwitcher.powerOn(config.powerPort);
};
sw.onStreemsStopped = () => {
  console.log('Streems stopped: power off.');
  powerSwitcher.powerOff(config.powerPort);
};

console.log('popping up Server on Port ' + config.webServer.port + ' for debug purpose');
http.createServer(async function (req, res) {
  console.log('http request: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('streamIsOnline: ' + (sw.numberOpenStreems > 0));

  if (req.url.endsWith('/off')) {
    console.log('switching off power');
    await powerSwitcher.powerOff(1);
    await powerSwitcher.powerOff(2);
    await powerSwitcher.powerOff(3);
    await powerSwitcher.powerOff(4);
  } else if (req.url.endsWith('/on')) {
    console.log('switching on power');
    await powerSwitcher.powerOn(1);
    await powerSwitcher.powerOn(2);
    await powerSwitcher.powerOn(3);
    await powerSwitcher.powerOn(4);
  }
}).listen(config.webServer.port);
