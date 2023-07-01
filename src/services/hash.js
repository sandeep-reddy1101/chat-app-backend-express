const bcryptjs = require('bcryptjs');

let hash = {};

hash.hashPassword = (password)=>{
    return new Promise((resolve, reject)=>{
        bcryptjs.genSalt(10, (err, salt)=>{
            if (err) {
                reject(err)
            } else {
                bcryptjs.hash(password, salt, (err, encryptedPassword)=>{
                    if (err) {
                        reject(err)
                    } else {
                        resolve(encryptedPassword)
                    }
                })
            }
        })
    })
}

hash.comparePassword = (password, encryptedPassword)=>{
    return new Promise((resolve, reject)=>{
        bcryptjs.compare(password, encryptedPassword, (err, res)=>{
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

module.exports = hash