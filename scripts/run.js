const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function run(cmd) {
  console.log('>', cmd);
  const { stdout, stderr } = await exec(cmd);
  if (stdout)
    console.log(stdout);
  if (stderr)
    console.error('err:', stderr);
}
module.exports = run;
