/**
 * SessionsController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

    'create': function(req, res){
		let userLog;
		if(req.session.authenticated)
	    {
	      return res.redirect("/");
	    }
		// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		if (!req.param('email') || !req.param('password')) {
			// return next({err: ["Password doesn't match password confirmation."]});

			let usernamePasswordRequiredError = [{
				name: 'usernamePasswordRequired',
				message: 'You must enter both a username and password.'
			}]

			// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
			// the key of usernamePasswordRequiredError
			req.session.flash = {
				err: usernamePasswordRequiredError
			}
			
			//Return with flash error
			
			return res.redirect('/login');
        }
        
		// Try to find the user by there email address. 
		// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
		// User.findOneByEmail(req.param('email')).done(function(err, user) {

		Users.findOne({email: req.param('email')}).exec(function(err, user) {
			if (err) return next(err);

			// If no user is found...
			if (!user) {
				let noAccountError = [{
					name: 'noAccount',
					message: 'The email address ' + req.param('email') + ' not found.'
				}]

				//Flash Error
				req.session.flash = {
					err: noAccountError
				}
				//Return whith flash messege
				return res.redirect('/login');
			}

			// Compare password from the form params to the encrypted password of the user found.
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
                if (err) {

                    // flash.js 
                    req.addFlash('err', err);
                    return res.redirect('/register');
                  }

				// Log user in

				req.session.authenticated = true;
				// param

				// control de cookie
				req.session.user = 
				{ 
					 name: user.name,
				     lastName: user.lastName,
				     admin: user.admin,
				     createdAt: user.createdAt,
				     updatedAt: user.updatedAt,
				     id: user.id
				}

				res.redirect('/');

			});
		});
    },
    
    'destroy': function(req,res){
        if(!req.session.authenticated){
            return res.redirect('/');
        }
        // Wipe out the session (log out)
        let del = req.session
        req.session.destroy();
        console.log("Session user delete; id: ",del.user.id);
        return res.redirect("/");
    },
};

