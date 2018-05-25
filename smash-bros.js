var express = require('express');
var mysql = require('./dbcon.js.template');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);



//Grab all the info from all the tables and display them.

//sbr_users
//sbr_roster
//sbr_roster_comment
//sbr_roster_character
//sbr_character
//sbr_character_comment


//Get all here
//Done - Page Done (Bad CSS)
app.get('/',function(req,res,next){
    var context = {};

    mysql.pool.query('SELECT * FROM sbr_users', function(err, rows, fields){
        
        if(err){
            next()

        }else {

            context.sbr_users = rows;

            mysql.pool.query('SELECT * FROM sbr_roster', function(err, rows, fields){

                if(err){
                    next()

                }else {

                    context.sbr_roster = rows;

                    mysql.pool.query('SELECT * FROM sbr_roster_comment', function(err, rows, fields){

                        if(err){
                            next()

                        }else {
                            context.sbr_roster_comment = rows;


                            mysql.pool.query('SELECT * FROM sbr_roster_character', function(err, rows, fields){

                                if(err){
                                    next()

                                }else {

                                    context.sbr_roster_character = rows;

                                    mysql.pool.query('SELECT * FROM sbr_character', function(err, rows, fields){

                                        if(err){
                                            next()

                                        }else {

                                            context.sbr_character = rows;

                                            mysql.pool.query('SELECT * FROM sbr_character_comment', function(err, rows, fields){

                                                if(err){
                                                    next()
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



//Get roster
//Need to grab all the rosters and anything that contains roster information here
//Done - Page Not Done
app.get('/roster',function(req,res,next){
    var context = {};

    mysql.pool.query('SELECT * FROM sbr_roster', function(err, rows, fields){
        if(err){
            next()
        }else {
            context.sbr_roster = rows;
        }
    });

    mysql.pool.query('SELECT * FROM sbr_roster_comment', function(err, rows, fields){
        if(err){
            next()
        }else {
            context.sbr_roster_comment = rows;
        }
    });

    mysql.pool.query('SELECT * FROM sbr_roster_character', function(err, rows, fields){
        if(err){
            next()
        }else {
            context.sbr_roster_character = rows;
        }
    });

    res.render('roster', context);

});


//Create a roster
//Need to validate that user exist.... BUT THE FORM SHOULD JUST HAVE VALID USERS IN IT SO IDK
//Not Done - Page Not Done
app.post('/roster',function(req,res,next){
    if(req.body && req.body.user){

        //id (auto_increment)
        //user (userID) (check if this user exist)
        //rating (default this to 0)
        //number_of_ratings (default this to 0)

        //Check if user exist!
        mysql.pool.query('SELECT * FROM sbr_users WHERE id=' + req.body.user + "", function(err, rows, fields){
            if(!err) {

                //Create roster here
                mysql.pool.query('INSERT INTO sbr_roster (user, rating, number_of_rating) VALUES (' + req.body.user + ', 0, 0)', function (err, rows, fields) {
                   //redirect here
                });

            }
        });
    }
});


//Edit a roster
//CHECK THAT THE PERSON DOING THE EDIT IS THE SAME AS THE ONE THAT CREATED IT
//Not Done - Page Not Done
app.put('/roster',function(req,res,next){
    if(req.body && req.body.user && req.body.id){

        //id (auto_increment)
        //user (userID) (check if this user exist)
        //rating (default this to 0)
        //number_of_ratings (default this to 0)

        //Check if user exist
        mysql.pool.query('SELECT * FROM sbr_users WHERE id=' + req.body.user + "", function(err, rows, fields){
            if(!err) {

                //Check if user is same as the one that is editing it.



                mysql.pool.query('UPDATE sbr_roster (user) SET user = ' + req.body.user + ') WHERE id=' + req.body.id + '', function (err, rows, fields) {
                    //redirect here
                });
            }
        });
    }
});


















//Get characters
//Need to grab all the rosters and anything that contains roster information here
//Done - Page Not Done
app.get('/character',function(req,res,next){
    var context = {};

    mysql.pool.query('SELECT * FROM sbr_character', function(err, rows, fields){
        if(err){
            next()
        }else {
            context.sbr_roster = rows;
        }
    });

    mysql.pool.query('SELECT * FROM sbr_character_comment', function(err, rows, fields){
        if(err){
            next()
        }else {
            context.sbr_roster_comment = rows;
        }
    });

    res.render('roster', context);

});


//Create a character
//Need to validate that user exist.... BUT THE FORM SHOULD JUST HAVE VALID USERS IN IT SO IDK
//Not Done - Page Not Done
app.post('/character',function(req,res,next){
    if(req.body && req.body.user && req.body.name && req.body.picture && req.body.description && req.body.moves){

        //id (auto_increment)
        //user (userID) (check if this user exist)
        //name string
        //picture (unknown) -------------------------------------------------
        //description (text)
        //moves (text)
        //rating (default this to 0)
        //number_of_rating (default this to 0)

        //Check if user exist! ----------------------------------------------------
        mysql.pool.query('SELECT * FROM users WHERE id=' + req.body.user + '', function(err, rows, fields){
            if(!err) {

                //Insert Data
                mysql.pool.query('INSERT INTO sbr_character (user, name, picture, description, moves, rating, number_of_rating) VALUES (' + req.body.user + "," + req.body.name + "," + req.body.picture + "," + req.body.description + "," + req.body.moves + ', 0, 0)', function (err, rows, fields) {
                    //redirect here --------------------
                });


            }
        });
    }
});


//Edit a roster
//CHECK THAT THE PERSON DOING THE EDIT IS THE SAME AS THE ONE THAT CREATED IT
//Not Done - Page Not Done
app.put('/character',function(req,res,next){
    if(req.body && req.body.user && req.body.name && req.body.picture && req.body.description && req.body.moves){

        //id (auto_increment)                                                   -- Don't change
        //user (userID) (check if this user exist)                              -- Don't change
        //name string                                                           -- Can Change
        //picture (unknown) -------------------------------------------------   -- Can Change
        //description (text)                                                    -- Can Change
        //moves (text)                                                          -- Can Change
        //rating                                                                -- Don't change
        //number_of_rating                                                      -- Don't change

        //Check if user editing it is same as the creator of the comment. ---------------------
        mysql.pool.query('SELECT * FROM users WHERE id=' + req.body.user + '', function(err, rows, fields){
            if(!err) {
                mysql.pool.query('UPDATE sbr_character (name, picture, description, moves) SET name = ' + req.body.name + ') WHERE id=' + req.body.id + '', function (err, rows, fields) {
                    //redirect here
                });
            }
        });
    }
});


























app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
