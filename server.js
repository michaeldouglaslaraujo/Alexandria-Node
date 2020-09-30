const app = require('./src/config/custom-express');
const cors = require('cors');

app.use((req, res, next) => {
    console.log('Mid ok');
   // res.header("Acess-Control-Allow-Origin", "*");
    //app.use(cors());
    //next();
});

app.listen(3800, function(){
    console.log('Servidor rodando na porta 3800');
})

