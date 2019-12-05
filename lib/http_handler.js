class HttpHandler {
    constructor(){}

    index(req, res, next) {
        res.render('index');
    }
}
  
module.exports = HttpHandler;