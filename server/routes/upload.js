const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/productos');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No files were uploaded.'

        });

    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    //Tipos permitidos

    let tipoPermitidos = ['usuarios', 'productos'];
    if (!tipoPermitidos.find(t => t == tipo)) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo no permitido',
            tipoPermitidos
        })
    }


    //Extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let extension = archivo.mimetype.split('/')[1];

    if (!extensionesValidas.find(ext => ext == extension)) {
        return res.status(400).json({
            ok: false,
            message: 'Extension no permitida',
            extensionesValidas
        })
    }

    //Cambiar nombre de archivo para hacerlo único

    let nombreArchivo = id + "-" + new Date().getMilliseconds() + "-" + archivo.name;

    // Almacenar la imagen en el servidor
    archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        //Asociamos la imagen con el usuario o producto en BBDD
        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo)
        } else {
            imagenProducto(id, res, nombreArchivo);

        }

    });
});



function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                message: "EL usuario no existe"
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                message: ' Archivo subido correctamente',
                usuarioGuardado,
                img: nombreArchivo
            });

        })
    })
}

function borraArchivo(nombreArchivo, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreArchivo}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }

}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                message: "EL producto no existe"
            });
        }

        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                message: ' Archivo subido correctamente',
                productoGuardado,
                img: nombreArchivo
            });
        })
    })
}
module.exports = app;