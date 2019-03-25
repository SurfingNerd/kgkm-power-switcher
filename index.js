
var http = require('http');

console.debug('hello');

 const util = require('util');
 const exec = util.promisify(require('child_process').exec);

 function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function powerOn(powerPort) {
  const { stdout, stderr } = await exec('sispmctl -o ' + powerPort);
  
  if (stderr.length > 0) {
    console.log('Error powering on:' + stderr);
  }
}

async function powerOff(powerPort) {
  const { stdout, stderr } = await exec('sispmctl -f 1');
  
  if (stderr.length > 0) {
    console.log('Error powering off:' + stderr);
  }
}

async function test_power_distributer() {
    const { stdout, stderr } = await exec('sispmctl -o 1');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    console.log('waitin...');
    await sleep(3000);
    console.log('switching off...');
    await exec('sispmctl -f 1');
    console.log('waiting');
    await sleep(3000);
    console.log('switching on...');
    await exec('sispmctl -o 1');
  }

//test_power_distributer();
//console.debug('world');

var streamIsOnline = false;
var serverPort = 56378;

console.log('popping up Server on Port ' + serverPort + 'for debug purpose');
http.createServer(async function (req, res) {
  console.log('http request: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('streamIsOnline: ' + streamIsOnline);

  if (req.url.endsWith('/off')) {
    console.log('switching off power');
    await powerOff(1);
    await powerOff(2);
    await powerOff(3);
    await powerOff(4);
  } else if (req.url.endsWith('/on')) {
    console.log('switching on power');
    await powerOn(1);
    await powerOn(2);
    await powerOn(3);
    await powerOn(4);
  }
}).listen(serverPort);

