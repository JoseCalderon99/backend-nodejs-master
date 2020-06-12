// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var imagenesRoutes=require('./routes/imagenes');
var uploadRoutes =require('./routes/upload');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');



// Conexión a la base de datos
mongoose.Promise = global.Promise; 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    

});


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);


// Escuchar peticiones
app.listen(4000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});