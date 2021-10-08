var cboard_var;
var currentsim = 1;

$(document).ready(function () {
    
    cboard_var = Chessboard(document.getElementById('cboard'), 'start');

    $.ajax({
        data: JSON.stringify({
            dummy: true
        }),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: '/getmatchidforsim'
    }).done(function (data) {
        document.getElementById("matchid_sim").textContent = "Match id "+data.matchid;
    });

    $('#moveForward').on('click', function () {
        $.ajax({
            data: JSON.stringify({
                moveid: currentsim
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/simulateboard'
        }).done(function (data) {
            cboard_var.position(data.boardstate)
            document.getElementById("movenumber_sim").textContent = "Move number  "+currentsim;

            if(currentsim>data.retmoves) currentsim = data.retmoves;
            else currentsim++;
        });
    })

    $('#moveBackward').on('click', function () {
        $.ajax({
            data: JSON.stringify({
                moveid: currentsim
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/simulateboard'
        }).done(function (data) {
            cboard_var.position(data.boardstate)
            document.getElementById("movenumber_sim").textContent = "Move number  "+currentsim;

            if(currentsim==0) currentsim = 0;
            else currentsim--;
        });
    })
});
