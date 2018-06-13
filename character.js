module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT planet_id as id, name FROM bsg_planets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            complete();
        });
    }

    function getUser(res, mysql, context, complete){
        mysql.pool.query("SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT character_id as id, fname, lname, homeworld, age FROM bsg_people WHERE character_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }

    function getFilteredCharacters(res, mysql, context, userId, complete){
        
        var sql = "SELECT sbr_character.name, sbr_character.id, sbr_character.description, sbr_character.moves, sbr_character.picture, sbr_character.rating, sbr_character.number_of_ratings, sbr_users.username AS username ";
        sql += "FROM sbr_character ";
        sql += "INNER JOIN sbr_users ON sbr_users.id = sbr_character.user ";
        sql += "WHERE sbr_character.user = ?";
        var inserts = [userId];
        mysql.pool.query(sql, inserts, function(error, rows, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            context.filteredCharacters = rows;
            complete();
        });
    }

    function populateCharacterPage(req, res, userId){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js", "update.js", "filterCharacters.js"];
        var mysql = req.app.get('mysql');
        var sql;
        mysql.pool.query('SELECT * FROM sbr_users', function(err, rows, fields) {
            if (err) {
                res.render('500');

            } else {
                context.sbr_users = rows;

                //var sql = "SELECT sbr_character_comment.id AS comment_id, comment, description, moves, rating, number_of_ratings, sbr_character.name, sbr_users.username, sbr_users.id FROM sbr_character_comment INNER JOIN sbr_character ON sbr_character.id=sbr_character_comment.character INNER JOIN sbr_users ON sbr_users.id = sbr_character_comment.user";
                sql = "SELECT sbr_character.name, sbr_character.id, sbr_character.description, sbr_character.moves, sbr_character.picture, sbr_character.rating, sbr_character.number_of_ratings, sbr_users.username AS username FROM sbr_character ";
                sql += "INNER JOIN sbr_users ON sbr_users.id = sbr_character.user";

                //
                mysql.pool.query(sql, function (err, rows, fields) {

                    if (err) {
                        res.render('500');

                    } else {
                        context.sbr_character = rows;
                        sql = "SELECT sbr_character_comment.id AS comment_id, comment, sbr_character.name, sbr_users.username AS username, sbr_users.id FROM sbr_character_comment ";
                        sql += "LEFT JOIN sbr_character ON sbr_character.id=sbr_character_comment.character ";
                        sql += "INNER JOIN sbr_users ON sbr_users.id = sbr_character_comment.user";


                        //mysql.pool.query('SELECT sbr_user.username, sbr_character_comment.comment, sbr_character.name FROM sbr_character_comment INNER JOIN sbr_character ON sbr_character.id=sbr_character_comment.character INNER JOIN sbr_users ON sbr_users.id=sbr_character_comment.user', function(err, rows, fields) {
                        mysql.pool.query(sql, function(err, rows, fields) {

                            if (err) {
                                res.render('500');

                            } else {
                                context.sbr_character_comment = rows;

                                if (userId === null){
                                    context.filteredCharacters = context.sbr_character;
                                    res.render('character', context);
                                }else{
                                    getFilteredCharacters(res, mysql, context, userId, function(){
                                        res.render('character', context);
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    /*All characters + users*/

    router.get('/', function(req, res){
        populateCharacterPage(req, res, null);
    });






    router.get('/comment/:charactercommentID', function(req, res){
        const charactercommentID = parseInt(req.params.charactercommentID);
        var context = {};
        var mysql = req.app.get('mysql');

        context.jsscripts = ["delete.js", "update.js"];

        var sql = "SELECT sbr_character_comment.comment, sbr_character_comment.id AS commentID, sbr_character.name AS name, sbr_character.id AS characterID, sbr_users.username AS username, sbr_users.id AS userID FROM sbr_character_comment ";
        sql += "LEFT JOIN sbr_character ON sbr_character.id = sbr_character_comment.character ";
        sql += "INNER JOIN sbr_users ON sbr_users.id = sbr_character_comment.user ";
        sql += "WHERE sbr_character_comment.id = " + charactercommentID;

        mysql.pool.query(sql, function(err, rows, fields) {

            if (err) {
                console.log(JSON.stringify(err));
                res.write(JSON.stringify(err));
                res.end();

            } else {
                context.sbr_character_comment = rows[0];

                mysql.pool.query("SELECT * FROM sbr_character", function (err, rows, fields) {

                    if (err) {
                        res.render('500');

                    } else {

                        context.sbr_character = rows;

                        res.render('update-character-comment', context);
                    }
                });
            }
        });
    });


    router.get('/comment', function(req, res){
        res.redirect('/character');
    });

    /* Adds a person, redirects to the people page after adding */
    router.put('/comment/:charactercommentID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE sbr_character_comment SET sbr_character_comment.comment=?, sbr_character_comment.character=? WHERE id=?";

        var character;

        if (req.body.character === "null"){
            character = null
        }else{
            character = req.body.character;
        }

        var inserts = [req.body.comment, character, req.params.charactercommentID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                // res.redirect('/character');
                res.status(200);
                res.end();
            }
        });
    });

    router.post('/', function(req, res){

        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sbr_character (user, name, picture, description, moves, rating, number_of_ratings) VALUES (?,?,?,?,?,?,?)";
        var inserts = [req.body.user, req.body.name, 10000, req.body.description, req.body.moves, 0, 0];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/character');
            }
        });

    });


    router.post('/comment', function(req, res){

        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `sbr_character_comment` (`comment`, `user`, `character`) VALUES (?,?,?)";

        var character;

        if (req.body.character === "null"){
            character = null
        }else{
            character = req.body.character;
        }


        // INSERT INTO `sbr_character_comment` (`id`, `comment`, `user`, `character`, `creation_date`) VALUES (NULL, 'something about them memes', '1', '7', CURRENT_TIMESTAMP);
        var inserts = [req.body.comment, req.body.user, character];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){

            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();

            }else{
                res.redirect('/character');

            }
        });

    });





    /* The URI that update data is sent to in order to update a person */



    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:characterID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sbr_character WHERE id = ?";
        var inserts = [req.params.characterID];
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

    router.delete('/comment/:charactercommentID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sbr_character_comment WHERE id = ?";
        var inserts = [req.params.charactercommentID];
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

    /* Filter used to obtain a list of characters created by a given user */
    router.get('/filter/:userId', function(req, res){
       populateCharacterPage(req, res, req.params.userId);
    });


    return router;
}();
