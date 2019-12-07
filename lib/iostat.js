const spawn = require('child_process').spawn;

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,'');
  }

const IOSTAT_COMMAND = 'iostat';

class ChildIOStat {

    constructor(interval = '1') {
        this.interval = interval;
    }

    connect() {
        this.child = spawn(IOSTAT_COMMAND, ['-w', this.interval]);

        this.child.on('error', (error) => {
            console.log('error connect child ', error);
        });
        
        this.child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    execCommand(cb) {
        this.child.stdout.on('data', (data) => {
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

            console.log(stat);

            cb(stat, null);
        });
    }

    disconnect() {
        this.child.kill();
    }

    isConnected() {
        if (!this.child) {
            return false;
        }

        return !this.child.killed;
    }
}

module.exports = ChildIOStat;