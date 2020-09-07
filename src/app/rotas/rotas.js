module.exports = (app) => {
    app.get('/', function(req, resp) {
    resp.send(
        `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                </body> 
            </html>
        `
    );
});

app.get('/livros', function(req, resp) {
    resp.marko(
        require('../views/livros/lista/lista.marko')

    );
});
}

