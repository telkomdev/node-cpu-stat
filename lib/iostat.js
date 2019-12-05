const exec = require('child_process').exec;

const IOSTAT_COMMAND = 'iostat';

function execIOStat(interval = 1) {
    return new Promise((resolve, reject) => {
        exec(IOSTAT_COMMAND+ ' -w '+ interval, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = execIOStat;