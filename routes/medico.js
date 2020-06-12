var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// ==========================================
// Obtener todos los medicoes
// ==========================================
app.get('/', (req, res, next) => {

    Medico.find({}, 'nombre img usuario hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                res.status(200).json({
                    
                     medicos
                });



            });
});

// ==========================================
// Obtener un medico concreto
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;
    
    Medico.findById(id, (err, medico) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El medico con el id ' + id + ' no existe',
                        errors: { message: 'No existe un medico con ese ID' }
                    });
                }

                res.send(medico)



            });
});


// ==========================================
// Actualizar medico
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }


        medico.nombre = body.nombre;
      
        medico.usuario = body.usuario;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                console.log(err);
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            medicoGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo medico
// ==========================================
app.post('/',  (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            medicotoken: req.medico
        });


    });

});


// ============================================
//   Borrar un medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar medico',
                errors: err
            });
        }



        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});


module.exports = app;