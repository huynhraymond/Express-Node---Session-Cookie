

document.addEventListener('DOMContentLoaded', function() {

    var authentication = new Authentication();

    document.querySelector('div.top-nav-signup').addEventListener('click', function() {
        authentication.cancel();
        authentication.signUp();
    });

    document.querySelector('div.top-nav-logout').addEventListener('click', function() {
        authentication.logOut();
    });

    document.querySelector('div.top-nav-login').addEventListener('click', function() {
        authentication.cancel();
        authentication.logIn();
    });

    document.querySelector('div.authenticate-verify').addEventListener('click', function(e) {
        authentication.verify(e);
    });

    document.querySelector('div.registration-create').addEventListener('click', function(e) {
        authentication.createAccount(e);
    });

    document.querySelector('div.authenticate-cancel').addEventListener('click', function() {
        authentication.cancel();
    });

    document.querySelector('div.registration-cancel').addEventListener('click', function() {
        authentication.cancel();
    });
});

function Authentication() {};

Authentication.prototype.cancel = function() {
    document.querySelector('div.top-nav-info').textContent = "Welcome Guest";
    var parent = document.querySelector('section.authenticate');
    parent.querySelector('div.authenticate-info').textContent = "Member log in, if NOT please sign up";
    var divs = parent.querySelectorAll('input');

    for ( var i = 0, len = divs.length; i < len; i++ ) {
        divs[i].value = "";
    }

    parent.style.display = 'none';

    parent = document.querySelector('section.registration');
    parent.querySelector('div.registration-info').textContent = "Please provide the following information";
    divs = parent.querySelectorAll('input');

    for ( var i = 0, len = divs.length; i < len; i++ ) {
        divs[i].value = '';
    }

    parent.style.display = 'none';
};

Authentication.prototype.logIn = function() {
    var section = document.querySelector('section.authenticate');
    section.style.display = 'block';
};

Authentication.prototype.logOut = function() {
    this.cancel();

    AjaxServices.logout();
};

Authentication.prototype.verify = function(e) {
    var section = e.target.parentNode;

    var email = section.querySelector('input.authenticate-email').value;
    var pw = section.querySelector('input.authenticate-password').value;

    var obj = { email: email, password: pw };
    AjaxServices.query(obj);
};

Authentication.prototype.signUp = function() {
    var parent = document.querySelector('section.registration');
    parent.style.display = 'block';

};

Authentication.prototype.loginError = function() {
    var section = document.querySelector('section.authenticate');

    section.querySelector('div.authenticate-info').textContent = "Invalid - No Access to system!";
    section.querySelector('input.authenticate-email').value = "";
    section.querySelector('input.authenticate-password').value = "";
};

Authentication.prototype.createAccount = function(e) {
    var parent = e.target.parentNode;
    var name = parent.querySelector('input.registration-name');
    var email = parent.querySelector('input.registration-email');
    var pw1 = parent.querySelector('input.registration-pw');
    var pw2 = parent.querySelector('input.registration-confirm-pw');
    var info = parent.querySelector('div.registration-info');

    var inputs = parent.querySelectorAll('input');
    for ( var i = 0, len = inputs.length; i < len; i++ ) {
        if ( inputs[i].value.length === 0 ) {
            info.textContent = 'All fields are required to register';
            inputs[i].focus();
            return;
        }
    }

    if ( pw1.value !== pw2.value ) {
        info.textContent = "Passwords are NOT matching";
        pw1.value = '';
        pw2.value = '';
        pw1.focus();
        return;
    }

    var obj = { name: name.value, email: email.value, password: pw1.value };
    AjaxServices.create(obj);
};

Authentication.prototype.createElement = function(elementType, parent, innerHtml, custom) {
    var element = document.createElement(elementType);

    if ( parent ) { parent.appendChild(element); }

    if ( innerHtml ) { element.innerHTML = innerHtml; }

    if ( typeof custom !== 'undefined' ) {
        for ( var prop in custom ) {
            element.setAttribute( prop, custom[prop] );
        }
    }

    return element;
};

Authentication.prototype.displayStatus = function(status) {
    var div = document.querySelector('div.top-nav-info');
    div.textContent = status;
};

function makeAjaxCall(url, httpVerb, obj, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open(httpVerb, url);

    // set content-type for post and put
    if ( httpVerb === 'post' || httpVerb === 'put') {
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === 4 ) {
                callback(xhr, httpVerb);
            }
        });

        xhr.send(JSON.stringify(obj));
    }

    if ( httpVerb === 'get' || httpVerb === 'delete') {

        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === 4 ) {
                callback(xhr, httpVerb);
            }
        });

        xhr.send();
    }
};

var AjaxServices = {

    create: function(obj) {
        callback = function(xhr) {
            if ( xhr.status === 200 ) {
                Authentication.prototype.cancel.call(this);
                Authentication.prototype.logIn.call(this);
            }
        };

        makeAjaxCall('/authentication/signup', 'post', obj, callback);
    },

    query: function(obj) {
        callback = function(xhr) {
            if ( xhr.status === 200 ) {
                var response = JSON.parse(xhr.responseText);
                if ( response !== null ) {
                    console.log(response);
                    var status = 'Welcome ' + response.name;
                    Authentication.prototype.displayStatus.call(this, status);
                    Authentication.prototype.cancel();
                }

                else {
                    Authentication.prototype.loginError.call(this);
                }
            }
        };

        makeAjaxCall('/authentication/login', 'post', obj, callback);
    },

    logout: function() {
        callback = function(xhr) {
            if (xhr.status === 200 ) {
               console.log('success clear cookie...');
            }
        };

        makeAjaxCall('/authentication/logout', 'post', {}, callback);
    }
};
