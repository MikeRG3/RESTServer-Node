const express = require("express");

const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion')
const Categoria = require("../models/categoria");
const Usuario = require("../models/usuario");
const app = express();


app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})
app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!categorias) {
                return res.status(404).json({
                    ok: false,
                    message: "No hay categorias registradas"
                })
            }


            res.json({
                ok: true,
                categorias
            })

        })
})

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoria) {
            return res.status(404).json({
                ok: false,
                message: "No hay categoria con ese ID"
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })

})
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoria) {
            return res.status(404).json({
                ok: false,
                message: "No hay categoria con ese ID"
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })

})
app.delete('/categoria/:id', [verificaToken, verificaAdmin], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoria) {
            return res.status(404).json({
                ok: false,
                message: "No hay categoria con ese ID"
            })
        }
        res.json({
            ok: true,
            categoria,
            message: 'Categoria eliminada'
        })
    })

})


module.exports = app;