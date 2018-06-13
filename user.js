module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*Display all people. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        mysql.pool.query('SELECT * FROM sbr_users', function(err, rows, fields) {

            if (err) {
                res.render('500');

            } else {
                context.sbr_users = rows;
                res.render('user', context);
            }
        });
    });

    /* Display one person for the specific purpose of updating people */
    router.get('/:userID', function(req, res){
        const userID = parseInt(req.params.userID);
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["update.js"];
        mysql.pool.query('SELECT * FROM sbr_users WHERE id="' + userID + '"', function(err, rows, fields) {
            if (err) {
                res.render('500');

            } else {
                context.sbr_users = rows[0];
                res.render('update-user', context);
            }

        });
    });

    function hashFunction(input) {
        var hash = 0,
            i, chr;
        if (input.length === 0) return hash;
        for (i = 0; i < input.length; i++) {
            chr = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };


    /* Adds a person, redirects to the people page after adding */
    router.post('/', function(req, res){
        var password_hash = hashFunction(req.body.password);
        var context = {};


        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sbr_users (username, email, first_name, last_name, password_hash) VALUES (?,?,?,?,?)";
        var inserts = [req.body.username, req.body.email, req.body.first_name, req.body.last_name, password_hash];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/user');
            }
        });

    });


    /* The URI that update data is sent to in order to update a person */
    router.put('/:userID', function(req, res){
        var mysql = req.app.get('mysql');
        var password_hash = hashFunction(req.body.password);

        var sql = "UPDATE sbr_users SET username=?, email=?, first_name=?, last_name=?, password_hash=? WHERE id=?";
        var inserts = [req.body.username, req.body.email, req.body.first_name, req.body.last_name, password_hash, req.params.userID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });


    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:userID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sbr_users WHERE id = ?";
        var inserts = [req.params.userID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    });


    return router;
}();
