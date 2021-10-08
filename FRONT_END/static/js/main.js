$(document).ready(function () {
    $('#login').on('click', function (event) {
        $.ajax({
                data: JSON.stringify({
                    username: $('#loginusername').val(),
                    password: $('#loginpassword').val()
                }),
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: '/submitlogin'
            })
            .done(function (data) {
                if(data.validuser) window.open("/home",'_top')
                else $("#unsuccessfulLogin").show();
            })
        event.preventDefault();
    });

    $('#register').on('click', function (event) {
        console.log('registration form was submitted');
        $.ajax({
                data: JSON.stringify({
                    username: $('#registerusername').val(),
                    firstname: $('#registerfirstname').val(),
                    lastname: $('#registerlastname').val(),
                    dob: $('#registerdob').val(),
                    email: $('#registeremail').val(),
                    phone: $('#registerphone').val(),
                    skill: $('#registerskill').val(),
                    password: $('#registerpassword').val(),
                }),
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: '/submitregistration'
            })
            .done(function (data) {   
                if(data.alreadyExists){
                    $("#successfulRegistration").hide();
                    $("#unsuccessfulRegistration").show();
                }else{
                    $("#successfulRegistration").show();
                    $("#unsuccessfulRegistration").hide();
                }

            })
        event.preventDefault();
    });

    $('#guest').on('click', function (event) {
        $.ajax({
                data: JSON.stringify({
                    guest: true
                }),
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: '/submitlogin'
            })
            .done(function (data) {
                console.log("Form submitted");
                if(data.validuser) console.log('Data received was true')
                else console.log('Data received was false')
            })
        event.preventDefault();
    });



});