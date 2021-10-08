var player_dict = {};
var datapoint = [];
var numfav=-1;
$(document).ready(function () {
    $('#players_form').on('submit', function (event) {
        $.ajax({
            data: JSON.stringify({
                num: $('#num_players').val(),
                sort1: $('#sort1').val()
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/query3form'
        })
            .done(function (data) {
                player_dict = {};
                datapoint = [];
                var body = document.getElementById("main");

                var tbl = document.createElement("table");
                tbl.id = "table_openings";

                var tblHead = document.createElement("thead");
                tblHead.className = "text-primary";
                var headRow = document.createElement("tr");

                var headCell0 = document.createElement("th");
                var headCell1 = document.createElement("th");
                var headCell2 = document.createElement("th");
                var headCell3 = document.createElement("th");
                var headCell4 = document.createElement("th");
                var headText0 = document.createTextNode("Name");
                var headText1 = document.createTextNode("Number of Wins");
                var headText2 = document.createTextNode("Number of Lost matches");
                var headText3 = document.createTextNode("Number of Matches");
                var headText4 = document.createTextNode("Details");

                headCell0.appendChild(headText0);
                headCell1.appendChild(headText1);
                headCell2.appendChild(headText2);
                headCell3.appendChild(headText3);
                headCell4.appendChild(headText4);
                headRow.appendChild(headCell0);
                headRow.appendChild(headCell1);
                headRow.appendChild(headCell2);
                headRow.appendChild(headCell3);
                headRow.appendChild(headCell4);

                tblHead.appendChild(headRow);

                var tblBody = document.createElement("tbody");
                for (var i = 0; i < data.moves.length; i++) {
                    player_dict[data.moves[i][4]] = data.moves[i];

                    var row = document.createElement("tr");
                    for (var j = 0; j < 4; j++) {
                        var cell = document.createElement("td");
                        var cellText = document.createTextNode(data.moves[i][j]);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    datapoint.push({ y: data.moves[i][1] / data.moves[i][3], label: data.moves[i][0] })
                    var cell = document.createElement("td");
                    var cellButton = document.createElement("button");
                    cellButton.textContent = "Details";
                    cellButton.type = "button";
                    cellButton.className = "btn btn-primary togglePlayerModalClass";
                    cellButton.setAttribute("onclick", "callModal(\"" + data.moves[i][4] + "\")");
                    cell.appendChild(cellButton);
                    row.appendChild(cell);
                    tblBody.appendChild(row);
                }


                tbl.appendChild(tblHead);
                tbl.appendChild(tblBody);
                var oldtable = document.getElementById('table_openings')
                if (oldtable != null) oldtable.remove();
                tbl.className = "table tablesorter";
                body.append(tbl);
                // tbl.setAttribute("border", "2");


                var chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    theme: "light1", // "light1", "light2", "dark1", "dark2"
                    title: {
                        text: "Fraction Wins of Players"
                    },
                    axisY: {
                        title: "Win fraction"
                    },
                    data: [{
                        type: "column",
                        showInLegend: true,
                        legendMarkerColor: "grey",
                        legendText: "Players",
                        dataPoints: datapoint
                    }]
                });
                chart.render();


            })
        event.preventDefault();
    });

    function addFavourite(pid) {
        if(pid==-1){
            alert('Sorry, you must be logged in to use this functionality');
        }else{
            $.ajax({
                data: JSON.stringify({
                    playerid: pid
                }),
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: '/addFavourite'
            }).done(function (data) {
                $('#addFavButton').hide();
                $('#remFavButton').show();
                if(parseInt(document.getElementById('insert_v17').textContent)!=NaN) document.getElementById('insert_v17').textContent = parseInt(document.getElementById('insert_v17').textContent)+1;
            });
        }
    }

    function remFavourite(pid) {
        $.ajax({
            data: JSON.stringify({
                playerid: pid
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/remFavourite'
        }).done(function (data) {
            $('#addFavButton').show();
            $('#remFavButton').hide();
            if(parseInt(document.getElementById('insert_v17').textContent)!=NaN) document.getElementById('insert_v17').textContent = parseInt(document.getElementById('insert_v17').textContent)-1;
        });
    }

    function callModal(pid) {
        document.getElementById('addFavButton').setAttribute("onclick", "addFavourite(\"" + pid + "\")");
        document.getElementById('remFavButton').setAttribute("onclick", "remFavourite(\"" + pid + "\")");

        for (var x = 1; x <= 17; x++) {
            $("#insert_v" + x).empty();
        }
        document.getElementById('insert_v1').textContent = player_dict[pid][0];
        document.getElementById('insert_v2').textContent = player_dict[pid][1];
        document.getElementById('insert_v4').textContent = player_dict[pid][2];
        document.getElementById('insert_v6').textContent = player_dict[pid][3];
        for (var x = 1; x <= 17; x++) {
            if (x != 1 && x != 2 && x != 4 && x != 6) {
                var loading = document.createElement("i");
                loading.setAttribute("class", "fa fa-spinner fa-spin");
                loading.setAttribute("style", "font-size:16px");
                document.getElementById('insert_v' + x).appendChild(loading);
            }
        }

        $('#togglePlayerModal').click();
        $.ajax({
            data: JSON.stringify({
                playerid: pid
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/checkFavourite'
        }).done(function (data) {
            if(data.guest){
                $('#addFavButton').show();
                $('#remFavButton').hide();
                document.getElementById('addFavButton').setAttribute("onclick", "addFavourite(\"" + -1 + "\")");
            }else if (data.isFavourite) {
                $('#addFavButton').hide();
                $('#remFavButton').show();
            } else {
                $('#addFavButton').show();
                $('#remFavButton').hide();
            }
        });

        $.ajax({
            data: JSON.stringify({
                playerid: pid
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/getplayerinfo'
        }).done(function (data) {
            numfav = data.biodata[0][17];
            for (var x = 1; x <= 17; x++) {
                $("#insert_v" + x).empty();
            }

            for (var x = 1; x <= 17; x++) {
                document.getElementById('insert_v' + x).textContent = data.biodata[0][x];
            }

        });
    }

    window.addFavourite = addFavourite;
    window.remFavourite = remFavourite;
    window.callModal = callModal;


});
