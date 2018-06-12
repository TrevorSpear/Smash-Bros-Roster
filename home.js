module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var mysql = req.app.get('mysql');
        var context = {};

        mysql.pool.query('SELECT * FROM sbr_users', function(err, rows, fields){

            if(err){
                res.render('500');

            }else {

                context.sbr_users = rows;

                mysql.pool.query('SELECT * FROM sbr_roster', function(err, rows, fields){

                    if(err){
                        res.render('500');

                    }else {

                        context.sbr_roster = rows;

                        mysql.pool.query('SELECT * FROM sbr_roster_comment', function(err, rows, fields){

                            if(err){
                                res.render('500');

                            }else {
                                context.sbr_roster_comment = rows;


                                mysql.pool.query('SELECT * FROM sbr_roster_character', function(err, rows, fields){

                                    if(err){
                                        res.render('500');

                                    }else {

                                        context.sbr_roster_character = rows;

                                        mysql.pool.query('SELECT * FROM sbr_character', function(err, rows, fields){

                                            if(err){
                                                res.render('500');

                                            }else {

                                                context.sbr_character = rows;

                                                mysql.pool.query('SELECT * FROM sbr_character_comment', function(err, rows, fields){

                                                    if(err){
                                                        res.render('500');
                                                    }else {

                                                        context.sbr_character_comment = rows;
                                                        res.render('home', context);

                                                    }
                                                });

                                            }
                                        });

                                    }
                                });


                            }
                        });

                    }
                });

            }
        });
    });

    return router;
}();
