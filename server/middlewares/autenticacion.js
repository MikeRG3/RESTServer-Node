const jwt = require('jsonwebtoken')

// =====================
//Verificacion del token
//=====================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario
        next();
    })

};


let verificaAdmin = (req, res, next) => {
    let usuario = req.usuario;
    console.log(usuario);
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Se requiere ser ADMINISTRADOR'
            }
        })
    }
}

module.exports = { verificaToken, verificaAdmin };