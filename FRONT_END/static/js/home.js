$(document).ready(function () {
  $.ajax({
    data: JSON.stringify({
      getuser: 0
    }),
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    url: '/getuserinfo'
  })
    .done(function (data) {
      if (data.guest) {
        $('#hideifguest').hide();
        $('#greeting').text('Welcome guest user, please login to access the full functionality of this website!');
      } else {
        $('#hideifguest').show();
        $('#gotologin').hide();
        $('#greeting').text('Welcome ' + data.user_name + '!');
        document.getElementById("registerfirstname").value = data.user_first_name;
        document.getElementById("registerlastname").value = data.user_last_name;
        document.getElementById("registerdob").value = data.user_dob;
        document.getElementById("registeremail").value = data.user_email;
        document.getElementById("registerphone").value = data.user_phone;
        document.getElementById("registerskill").value = data.user_skill;
        document.getElementById("registerpassword").value = data.user_password;
      }
    });
  $('#updateuserform').on('submit', function (event) {
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
      url: '/updateuserinfo'
    })
      .done(function (data) {
        
      });
    alert('User info updated!');
  });
  $('#delaccount').on('click', function (event) {
    $.ajax({
      data: JSON.stringify({
        dummy: true
      }),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      url: '/deluser'
    })
      .done(function (data) {
        $('#hideifguest').hide();
        $('#greeting').text('Welcome guest user, please login to access the full functionality of this website!');
      });
    alert('User deleted.');
  });


});