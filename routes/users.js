const pool = require("../core/pool")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

function User() {};

User.prototype = {
    // Find user data by username
    find : function(user = null, callback) {
        // if user = number return field = id, if user = String return field = username
        if(user) {
            var field = Number.isInteger(user) ? 'id' : 'email'
        }
        
        let sql = `SELECT * FROM users WHERE ${field} = ?`;
        
        pool.query(sql, user, function(err, result) {
            if(result.length)
                callback(result[0])
        })
    },
    
    create : function(body, callback) {
        const {name, email} = body
        let pwd = body.password;
        body.password = bcrypt.hashSync(pwd, 10);
        
        var bind = [name, email, body.password];
        
        //for (prop in body) {
          //  bind.push(prop)
            //console.log(prop)
        //}
        
        
        let sql = `INSERT INTO users(name, email, password) VALUES (?, ?, ?)`;
        
        pool.query(sql, bind, function(err, lastId) {
            if(err) throw err;
            callback(lastId)
        })
    },
    
    login : function(email, password, callback) {
        this.find(email, function(user){
            if (user) {
                if (bcrypt.compare(password, user.password)) {
                    callback(user)
                    return
                }
            }
            callback(null)
        })
    },
    
    generateAuthToken: function() {
        return jwt.sign({_id: this._id}, process.env.JWT_SECRET)
    },

    //updatePassword : function()
}

module.exports = User;
