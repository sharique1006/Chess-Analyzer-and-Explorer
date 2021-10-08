var dataplot = [];

function make_white_table(x, order) {
    $.ajax({
        data: JSON.stringify({
            size: x,
            order: order
        }),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: '/query2form_white'
    })
        .done(function (data) {
            console.log("received back white table making request");
            var white_player_table = document.getElementById("white_player_table");
            if (white_player_table != null) $("#white_player_table").empty();
            for (var i = 0; i < data.players.length; i++) {
                var row = document.createElement("tr");
                for (var j = 0; j < 3; j++) {
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(data.players[i][j]);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                }
                white_player_table.appendChild(row);
            }
        });
}

function make_black_table(x, order) {
    $.ajax({
        data: JSON.stringify({
            size: x,
            order: order
        }),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: '/query2form_black'
    })
        .done(function (data) {
            var black_player_table = document.getElementById("black_player_table");
            if (black_player_table != null) $("#black_player_table").empty();
            for (var i = 0; i < data.players.length; i++) {
                var row = document.createElement("tr");
                for (var j = 0; j < 3; j++) {
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(data.players[i][j]);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                }
                black_player_table.appendChild(row);
            }
        });
}

function colorformsubmit(){
    $.ajax({
        data: JSON.stringify({
            sort1: $('#sort1').val(),
            sort2: $('#sort2').val(),
            num_p1: $('#num_p1').val(),
            num_p2: $('#num_p2').val()
        }),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: '/query2form'
    })
        .done(function (data) {
            dataplot = [];
            var colourwise_win_table = document.getElementById("colourwise_win_table");
            if (colourwise_win_table != null) $("#colourwise_win_table").empty();
            for (var i = 0; i < data.wins.length; i++) {
                var row = document.createElement("tr");
                for (var j = 0; j < 3; j++) {
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(data.wins[i][j]);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                }
                dataplot.push({ y: data.wins[i][1], indexLabels: data.wins[i][0] });
                colourwise_win_table.appendChild(row);
            }
            make_white_table($('#num_p1').val(), $('#sort1').val());
            make_black_table($('#num_p2').val(), $('#sort2').val());



            var chart = new CanvasJS.Chart("chartContainer",
                {
                    title: {
                        text: "Share of wins by white and black"
                    },
                    legend: {
                        maxWidth: 350,
                        itemWidth: 120
                    },
                    data: [
                        {
                            type: "pie",
                            showInLegend: true,
                            legendText: "{indexLabel}",
                            dataPoints: dataplot
                        }
                    ]
                });
            chart.render();
        });
}

$(document).ready(function () {
    colorformsubmit();
    $('#color_form_submit').on('click', function (event) {
        colorformsubmit();
        event.preventDefault();
    });

});