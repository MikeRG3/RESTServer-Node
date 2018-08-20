// =====================
//Puerto
//=====================

process.env.PORT = process.env.PORT || 3000

// =====================
//Entorno
//=====================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// =====================
//Vencimiento del token
//=====================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
// =====================
//Seed
//=====================

process.env.SEED = process.env.SEED || 'seed-desarrollo'

// =====================
//DB
//=====================
let url;

if (process.env.NODE_ENV === 'dev') {
    url = 'mongodb://localhost:27017/Cafe'
} else {
    url = process.env.MONGO_URL
}

process.env.URLDB = url;