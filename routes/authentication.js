
var router = require('express').Router();

var RegistrationModel = require('../models/registration_model');

var SessionModel = require('../models/session_model');

router.post('/signup', function(req, res) {
    (new RegistrationModel(req.body)).save(function (err, result) {
        if (err) res.status(500).json({code: 0});
        else {
            console.log(result);
            res.status(200).json({code: 1});
        }
    });
});

/*
router.post('/login', verify, function(req, res) {

});

function verify(req, res, next) {
    RegistrationModel.find(req.body, function(err, result) {

    });
}
*/
/*
 function validate(req, res, next) {
 console.log(req.cookies.sessionid);
 if (valid(req.cookies.sessionid))
 next();
 else res.redirect('/login');
 }
 */
//router.get('/', validate, function(req, res) {

// Authenticate log in
router.post('/login', function(req, res) {
    RegistrationModel.find(req.body, function(err, result) {
        if (err) res.status(500).json(err);

        else {
            if ( result.length != 0 ) {
                result = result.pop();
                SessionModel.find({userId: result._id}, function(err, doc) {
                    //if (err) res.status(500).json(err);
                    if ( doc.length != 0 ) {
                        var session = doc.pop();
                        session.expires = Date.now() + 900000;

                        SessionModel.update( { userId: result._id }, {expires: Date.now() + 900000}, function(err, result) {
                            res.cookie('sessionId', session._id, {
                                expires: Date.now() + 9000000,
                                maxAge: 900000,
                                httpOnly: false
                            });
                            res.status(200).json({name: session.name});
                        });
                    }
                    else {
                        var sess = {userId: result._id, name: result.name, email: result.email, expires: Date.now() + 900000};
                        (new SessionModel(sess)).save( function(err, result) {
                            if (err) res.status(500).json(err);

                            else {
                                console.log('No cookie found...');
                                res.cookie('sessionId', result._id, {expires: Date.now() + 9000000, maxAge: 900000, httpOnly: false});
                                res.status(200).json({name: result.name});
                            }
                        });
                    }
                });
            }

            else {
                res.status(200).json({ message: 'Invalid username or password' });
            }
        }
    });
});

router.get('/validate', function(req, res) {
    var obj = { name: "" };

    if ( req.cookies.sessionId === undefined ) {
        res.status(200).json(obj);
    }

    else {
        SessionModel.find( {_id: req.cookies.sessionId}, function(err, result) {
            if ( err ) res.status(500).json(err);

            else {
                if ( result.length != 0 ) {
                    result = result.pop();

                    obj.name = result.name;
                    res.cookie('sessionId', result._id, {expires: Date.now() + 9000000, maxAge: 900000, httpOnly: false});
                    SessionModel.update({_id: result._id}, {expires: Date.now() + 900000}, function (err){
                        if (err) res.status(500).json(err);
                    });
                }
                res.status(200).json(obj);
            }
        });
        //obj.name = "Raymond Huynh";

    }
});

router.post('/logout', function(req, res) {
    if ( req.cookies.sessionId != undefined ) {
        var id = req.cookies.sessionId;
        var past = Date.now() - (24 * 60 * 60 * 1000);
        res.cookie('sessionId', id, {expires: past, maxAge:0, httpOnly: false});
        SessionModel.update({_id: id}, {expires: past}, function(err, result) {
            if (err) res.status(500).json(err);
            //else res.status(200).json(result);
        });
        res.status(200).json({cookie: 'success clear'});
    }

    else res.status(200).json({cookie: 'clear'});
});

module.exports = router;

/*
router.get('/validate', function (req, res) {

    var obj = { name: "" };
    if ( req.cookies.sessionId === undefined ) { res.status(200).json(obj); }

    else {
        var expires = { expires: Date.now() + 900000 };
        SessionModel.findOneAndUpdate({ _id: req.cookies.sessionId }, { $set: expires }, true, function(err, result) {
            if (err) res.status(500).json(obj);
            else {
                if ( result.length != 0 ) {
                    res.cookie('sessionId', result._id, {expires: Date.now() + 9000000, maxAge: 900000, httpOnly: false});
                    obj.name = result.name;

                    res.status(200).json(obj);
                }
            }
        });
    }
});

function validation(req, res) {
    if ( req.cookies.sessionId === undefined ) {
        console.log('Testing Invalid...');
    }
}
*/

/*
 var session = {};
 session.userId = result._id;
 session.name = result.name;
 session.email = result.email;
 session.expires = Date.now() + 900000;

 SessionModel.update( { userId: result._id }, session, { upsert : true }, function(err, result) {
 if ( err ) res.status(500).json(err);
 else {
 res.cookie('sessionId', result._id, {expires: Date.now() + 9000000, maxAge: 900000, httpOnly: false});
 console.log(result);
 res.status(200).json({name: session.name});
 }
 });
 */
