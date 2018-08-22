const express = require('express');
const app = express();

const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion')

const Producto = require('../models/productos')
const Categoria = require('../models/categoria');

const _ = require('underscore');

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    // var categoriaId;
    // Categoria.find({ descripcion: body.categoria }, (err, categoriaDB) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         })
    //     }
    //     if (!categoriaDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             message: 'Categoria no encontrada'
    //         })
    //     }

    //     categoriaId = categoriaDB[0]._id;
    //     console.log(categoriaId);
    // })

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario
    })


    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

app.get('/producto', (req, res) => {
    let disponibleDB = req.query.disponible || true;
    let limit = Number(req.query.limite) || 1000;
    let desde = Number(req.query.desde) || 0;

    Producto.find({ disponible: disponibleDB })
        .sort('nombre')
        .skip(desde)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productos) {
                return res.status(404).json({
                    ok: false,
                    message: 'No hay productos registrados'
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
})
app.get('/producto/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    message: 'No hay productos registrado con ese ID'
                })
            }

            res.json({
                ok: true,
                producto
            })
        })
})
app.get('/producto/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario')
        .populate('categoria')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    message: 'No hay productos registrado con ese ID'
                })
            }

            res.json({
                ok: true,
                producto,
                resultados: producto.length
            })
        })
})

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let update = _.pick(req.body, [
        'nombre',
        'precioUni',
        'descripcion',
        'disponible',
        'categoria',
        'usuario'
    ]);
    Producto.findByIdAndUpdate(id, update, { new: true, runValidators: true }, (err, producto) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: 'No hay productos registrado con ese ID'
            })
        }

        res.json({
            ok: true,
            producto
        })
    })
})
app.delete('/producto/:id', [verificaToken, verificaAdmin], (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: 'No hay productos registrado con ese ID'
            })
        }

        res.json({
            ok: true,
            producto,
            message: ' Producto borrado'
        })
    })
})




module.exports = app;