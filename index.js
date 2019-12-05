const execIOStat = require('./lib/iostat');

execIOStat().then(out => {
    console.log(out);
}).catch(err => {
    console.log('err ', err);
});