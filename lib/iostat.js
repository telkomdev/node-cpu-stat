const spawn = require('child_process').spawn;

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,'');
  }

const IOSTAT_COMMAND = 'iostat';

function execIOStat(interval = '1', socket, cb) {

    const child = spawn(IOSTAT_COMMAND, ['-w', interval]);

    child.stdout.on('data', (data) => {
        let out = data.toString('utf8');
        let outArr = out.trim().split(/\s+/);
        outArr = outArr.filter((cv, index, arr) => {
            return !isNaN(cv);
        });

        let outArrFloat = outArr.map((cv, index, arr) => {
            return parseFloat(cv);
        });

        const stat = {
            date: new Date().toLocaleString(),
            disk: {
                kbPerT: outArrFloat[0],
                tps: outArrFloat[1],
                mbPerS: outArrFloat[2]
            },
            cpu: {
                user: outArrFloat[3],
                system: outArrFloat[4],
                idle: outArrFloat[5]
            }
        }

        cb(stat, null);
    });

    child.on('error', (error) => {
        cb(null, error);
    });
    
    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

module.exports = execIOStat;