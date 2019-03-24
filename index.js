
console.debug('hello');

 const util = require('util');
 const exec = util.promisify(require('child_process').exec);

 function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function test_power_distributer() {
    const { stdout, stderr } = await exec('sudo sispmctl -o 1');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    console.log('waitin...');
    await sleep(3000);
    console.log('switching off...');
    await exec('sudo sispmctl -f 1');
    console.log('waiting');
    await sleep(3000);
    console.log('switching on...');
    await exec('sudo sispmctl -o 1');
  }

  test_power_distributer();
//console.debug('world');