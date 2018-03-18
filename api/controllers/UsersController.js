/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /*Create user*/

    'create': function(req,res){
        let userObj = {
            name: req.param('name'),
            lastName: req.param('lastName'),
            email: req.param('email'),
            password: req.param('password'),
            confirmation: req.param('confirmation')
          }
        
        // Create a User with the params sent from 
        // the sign-up form --> register.ejs
        Users.create(userObj, function userCreated(err, user) {
            //if err
            if (err) {
                // flash.js 
                let paramError = [{
                    name: 'paramErr',
                    message: 'Verificate param'
                }]
                req.session.flash = {
                    err: paramError
                }
                return res.redirect("/register");
            }
            // Log user in
            req.session.authenticated = true;
    
            // control de cookie
            req.session.User = { 
                name: user.name,
                lastName: user.lastName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                id: user.id
            };
            let usertoSave = user;
            user.save(function(err, user) {
                if (err) return next(err);
                res.redirect('/users/' + usertoSave.id);
            });
        });
    },


    /*list users*/

    'index': function(req,res){
        console.log("desde el metodo index");
        Users.find().exec(function(err,element){

            if(err){
                return next(err);
            }
            return res.send(element);
        });
    },

    /*find users by id*/

    'findOne': function(req,res){
        console.log("desde el metodo findOne");
        let element = req.param('id');
        
        Users.findOne({id: element}).exec(function (err,user){
            if(err){
                return next(err);
            }
            return res.send(user);
        });
    },

    /*delete a user by id*/

    'destroy': function(req,res){
        console.log("desde el metodo destroy");
        let x = req.param('id');
        Users.destroy({id: x}).exec(function (err,user){
            if(err){
                return res.negotiate(err);
            }
            if(user.length == 0){
                return res.send("user not found");
            }
            console.log("user delete: ",user);
            return res.redirect("/users");
        });
    }
	
};

