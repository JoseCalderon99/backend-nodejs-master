var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

// ==========================================
// Obtener todos los hospitales
// ==========================================
app.get('/', (req, res, next) => {

    Hospital.find({}, 'nombre usuario')
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }

                res.status(200).json({
                     hospitales
                });



            });
});
// ==========================================
// Obtener un hospital concreto
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }

                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El hospital con el id ' + id + ' no existe',
                        errors: { message: 'No existe un hospital con ese ID' }
                    });
                }

                res.send(hospital)



            });
});


// ==========================================
// Actualizar hospital
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }


        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = body.usuario;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            hospitalGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo hospital
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
        
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            hospitaltoken: req.hospital
        });


    });

});


// ============================================
//   Borrar un hospital por el id
// ============================================
app.delete('/:id',  (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        res.status(200).json({
           hospitalBorrado
        });

    });

});


module.exports = app;