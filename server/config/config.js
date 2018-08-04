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
    url = 'mongodb://cafe-user:a123456@ds211592.mlab.com:11592/cafe-node-mikerg3'
}

process.env.URLDB = url;