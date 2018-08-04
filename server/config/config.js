// =====================
//Puerto
//=====================

process.env.PORT = process.env.PORT || 3000

// =====================
//Entorno
//=====================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


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