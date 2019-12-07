const express = require('express');
const router = express.Router();

module.exports = (childIOStat) => {
    router.get('/', (req, res, next) => {
        res.render('index');
    });

    router.get('/connect', (req, res, next) => {
        if (childIOStat.isConnected()) {
            return res.json({'success': false, 'message': 'process already connected'});
        }
    
        childIOStat.connect();
        res.json({'success': true, 'message': 'success'});
    });

    router.get('/disconnect', (req, res, next) => {
        if (!childIOStat.isConnected()) {
            return res.json({'success': false, 'message': 'process already diconnected'});
        }
    
        childIOStat.disconnect();
        res.json({'message': 'success'});
    });

    return router;
}