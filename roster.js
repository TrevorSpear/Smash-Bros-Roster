module.exports = function(){
    var express = require('express');
    var router = express.Router();


    /* List people with certificates along with
     * displaying a form to associate a person with multiple certificates
     */
    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        var sql;
        context.jsscripts = ["delete.js", "update.js"];

        mysql.pool.query('SELECT * FROM sbr_users', function(err, rows, fields) {

            if (err) {
                console.log(JSON.stringify(err));
                res.write(JSON.stringify(err));
                res.end();

            } else {
                context.sbr_users = rows;

                sql = "SELECT sbr_roster.name, sbr_roster.id, sbr_roster.user, sbr_roster.rating, sbr_roster.number_of_ratings, sbr_users.username FROM sbr_roster INNER JOIN sbr_users ON sbr_users.id = sbr_roster.user";
                // 'SELECT * FROM sbr_roster'

                // SELECT roster, character, sbr_roster.name, sbr_character.name, sbr_users.username, sbr_users.id
                // FROM sbr_roster
                // INNER JOIN sbr_roster_character ON sbr_roster.id = sbr_roster_character.roster
                // INNER JOIN sbr_character ON sbr_character.id = sbr_roster_character.character
                // INNER JOIN sbr_users ON sbr_users.id = sbr_roster.user
                // ORDER BY sbr_character_comment.ord_num;

                mysql.pool.query(sql, function (err, rows, fields) {

                    if (err) {

                        console.log(JSON.stringify(err));
                        res.write(JSON.stringify(err));
                        res.end();

                    } else {
                        context.sbr_roster = rows;
                        sql = "SELECT sbr_roster_comment.id AS comment_id, comment, sbr_roster.name, sbr_users.username, sbr_users.id FROM sbr_roster_comment LEFT JOIN sbr_roster ON sbr_roster.id=sbr_roster_comment.roster INNER JOIN sbr_users ON sbr_users.id = sbr_roster_comment.user";

                        // SELECT sbr_roster_comment.id, comment, sbr_roster.name, sbr_users.username, sbr_users.id
                        // FROM sbr_roster_comment
                        // INNER JOIN sbr_roster ON sbr_roster.id = sbr_roster_comment.roster
                        // INNER JOIN sbr_users ON sbr_users.id = sbr_roster_comment.user;
                        // 'SELECT * FROM sbr_roster_comment'
                        mysql.pool.query(sql, function(error, rows, fields) {

                            if (error) {
                                console.log(JSON.stringify(error));
                                res.write(JSON.stringify(error));
                                res.end();

                            } else {
                                context.sbr_roster_comment = rows;
                                res.render('roster', context);
                            }
                        });
                    }
                });
            }
        });
    });

    router.get('/character/:rosterID/:characterID', function(req, res){
        const rosterID = parseInt(req.params.rosterID);
        const characterID = parseInt(req.params.characterID);

        var context = {};
        var mysql = req.app.get('mysql');
        var sql = "";
        context.jsscripts = ["delete.js", "update.js"];

        sql += "SELECT sbr_roster_character.roster, sbr_roster_character.character, sbr_roster.name AS rosterName, sbr_character.name AS characterName, sbr_users.username, sbr_users.id ";
        sql += "FROM sbr_roster_character ";
        sql += "INNER JOIN sbr_roster ON sbr_roster.id = sbr_roster_character.roster ";
        sql += "INNER JOIN sbr_character ON sbr_character.id = sbr_roster_character.character ";
        sql += "INNER JOIN sbr_users ON sbr_users.id = sbr_roster.user ";
        sql += "WHERE sbr_roster_character.roster = ? AND sbr_roster_character.character = ? ";

        mysql.pool.query(sql, [rosterID, characterID], function(err, rows, fields) {

            if (err) {
                console.log(JSON.stringify(err));
                res.write(JSON.stringify(err));
                res.end();

            } else {
                context.sbr_roster_character = rows[0];

                mysql.pool.query('SELECT * FROM sbr_character', function (err, rows, fields) {

                    if (err) {
                        console.log(JSON.stringify(err));
                        res.write(JSON.stringify(err));
                        res.end();

                    } else {
                        context.sbr_character = rows;

                        res.render('update-roster-character', context);
                    }
                });
            }
        });
    });


    router.get('/comment/:rostercommentID', function(req, res){
        const rostercommentID = parseInt(req.params.rostercommentID);
        var context = {};
        var mysql = req.app.get('mysql');
        var sql;
        context.jsscripts = ["delete.js", "update.js"];

        mysql.pool.query('SELECT sbr_roster_comment.id AS commentID, sbr_users.username AS username, sbr_roster.name AS name, sbr_roster_comment.comment AS comment, sbr_users.id AS userID FROM sbr_roster_comment INNER JOIN sbr_users ON sbr_users.id = sbr_roster_comment.user LEFT JOIN sbr_roster ON sbr_roster.id = sbr_roster_comment.roster WHERE sbr_roster_comment.id = ?', [rostercommentID], function(err, rows, fields) {

            if (err) {
                console.log(JSON.stringify(err));
                res.write(JSON.stringify(err));
                res.end();

            } else {
                context.sbr_roster_comment = rows[0];

                mysql.pool.query('SELECT * FROM sbr_roster', function (err, rows, fields) {

                    if (err) {
                        console.log(JSON.stringify(err));
                        res.write(JSON.stringify(err));
                        res.end();

                    } else {
                        context.sbr_roster = rows;

                        res.render('update-roster-comment', context);
                    }
                });
            }
        });
    });

    router.get('/comment', function(req, res){
        res.redirect('/roster');
    });



    router.get('/character', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["delete.js", "update.js"];

        mysql.pool.query('SELECT * FROM sbr_character', function(err, rows, fields) {

            if (err) {
                res.render('500');

            } else {
                context.sbr_character = rows;

                mysql.pool.query('SELECT * FROM sbr_roster', function (err, rows, fields) {

                    if (err) {
                        res.render('500');

                    } else {
                        context.sbr_roster = rows;
                        var sql = "SELECT sbr_roster_character.ord_num AS ord_num, sbr_roster_character.character AS characterID, sbr_roster_character.roster AS rosterID, sbr_character.name AS character_name, sbr_roster.name AS roster_name FROM sbr_roster_character ";
                        sql += "INNER JOIN sbr_roster ON sbr_roster_character.roster = sbr_roster.id ";
                        sql += "INNER JOIN sbr_character ON sbr_roster_character.character = sbr_character.id ";
                        sql += "ORDER BY sbr_roster_character.roster, sbr_roster_character.ord_num ASC ";

                        mysql.pool.query(sql, function(err, rows, fields) {

                            if (err) {
                                res.render('500');

                            } else {
                                context.sbr_roster_character = rows;
                                res.render('roster-character', context);
                            }
                        });
                    }
                });
            }
        });
    });

    router.put('/comment/:rostercommentID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE sbr_roster_comment SET sbr_roster_comment.comment=?, sbr_roster_comment.roster=? WHERE sbr_roster_comment.id=?";

        var roster;

        if (req.body.roster === "null"){
            roster = null
        }else{
            roster = req.body.roster;
        }

        var inserts = [req.body.comment, roster, req.params.rostercommentID];

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                // res.redirect('/roster');
                res.status(200);
                res.end();
            }
        });
    });

    router.put('/character/:rosterID/:characterID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE sbr_roster_character SET sbr_roster_character.character = ? WHERE sbr_roster_character.roster = ? AND sbr_roster_character.character = ?";
        var inserts = [req.body.character, req.params.rosterID, req.params.characterID];

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                // res.redirect('/roster');
                res.status(200);
                res.end();
            }
        });
    });


    /* Associate certificate or certificates with a person and
     * then redirect to the people_with_certs page after adding
     */
    router.post('/', function(req, res){

        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sbr_roster (user, name, rating, number_of_ratings) VALUES (?,?,?,?)";
        var inserts = [req.body.user, req.body.name, 0, 0];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/roster');
            }
        });

    });


    router.post('/comment', function(req, res){

        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sbr_roster_comment (comment, user, roster) VALUES (?,?,?)";
        var roster;

        if (req.body.roster === "null"){
            roster = null
        }else{
            roster = req.body.roster;
        }

        var inserts = [req.body.comment, req.body.user, roster];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/roster');
            }
        });

    });

    router.post('/character', function(req, res){

        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `sbr_roster_character` ( `roster`, `character`, `ord_num`) VALUES (?,?,?)";
        var inserts = [req.body.roster, req.body.character, req.body.ord_num];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/roster/character');
            }
        });

    });


    /* Delete a person's certification record */
    /* This route will accept a HTTP DELETE request in the form
     * /pid/{{pid}}/cert/{{cid}} -- which is sent by the AJAX form
     */
    router.delete('/:rosterID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sbr_roster WHERE id = ?";
        var inserts = [req.params.rosterID];
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

    router.delete('/character/:rosterID/:characterID', function(req, res){

        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sbr_roster_character WHERE sbr_roster_character.roster = ? AND sbr_roster_character.character = ?";
        var inserts = [req.params.rosterID, req.params.characterID];

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

    router.delete('/comment/:rostercommentID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sbr_roster_comment WHERE id = ?";
        var inserts = [req.params.rostercommentID];
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
