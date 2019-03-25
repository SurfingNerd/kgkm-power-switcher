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

async function testPowerDistributer() {
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

exports.powerOn = powerOn;
exports.powerOff = powerOff;
exports.testPowerDistributer = testPowerDistributer;
