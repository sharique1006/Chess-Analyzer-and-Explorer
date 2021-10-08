var match_dict = {}
var univpid = -1;
var numfav=-1;

$(document).ready(function () {
    $('#startsim').on('click', function (event) {
        $.ajax({
            data: JSON.stringify({
                pid: univpid
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/setsim'
        })

            .done(function (data) {
                document.getElementById("startsimclickhere").click();
            });
    });

    $('#matches_form').on('submit', function (event) {
        $.ajax({
            data: JSON.stringify({
                num: $('#num_matches').val(),
                sort1: $('#sort1').val(),
                date_from: $('#from').val(),
                date_to: $('#to').val()
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/query4form'
        })

            .done(function (data) {
                match_dict = {};

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
                var headCell5 = document.createElement("th");
                var headCell6 = document.createElement("th");
                var headText0 = document.createTextNode("Match");
                var headText1 = document.createTextNode("Player Black");
                var headText2 = document.createTextNode("Player White");
                var headText3 = document.createTextNode("Winner");
                var headText4 = document.createTextNode("Duration");
                var headText5 = document.createTextNode("Number of Moves");
                var headText6 = document.createTextNode("Details");

                headCell0.appendChild(headText0);
                headCell1.appendChild(headText1);
                headCell2.appendChild(headText2);
                headCell3.appendChild(headText3);
                headCell4.appendChild(headText4);
                headCell5.appendChild(headText5);
                headCell6.appendChild(headText6);
                headRow.appendChild(headCell0);
                headRow.appendChild(headCell1);
                headRow.appendChild(headCell2);
                headRow.appendChild(headCell3);
                headRow.appendChild(headCell4);
                headRow.appendChild(headCell5);
                headRow.appendChild(headCell6);

                tblHead.appendChild(headRow);

                var tblBody = document.createElement("tbody");
                for (var i = 0; i < data.moves.length; i++) {
                    match_dict[data.moves[i][0]] = data.moves[i];
                    var row = document.createElement("tr");
                    for (var j = 0; j < 6; j++) {
                        var cell = document.createElement("td");
                        var cellText = document.createTextNode(data.moves[i][j]);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    var cell = document.createElement("td");
                    var cellButton = document.createElement("button");
                    cellButton.textContent = "Details";
                    cellButton.type = "button";
                    cellButton.className = "btn btn-primary toggleMatchModalClass";
                    cellButton.setAttribute("onclick", "callModal(\"" + data.moves[i][0] + "\")");
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
            })
        event.preventDefault();
    });

    function addFavourite(pid) {
        if (pid == -1) {
            alert('Sorry, you must be logged in to use this functionality');
        } else {
            $.ajax({
                data: JSON.stringify({
                    matchid: pid
                }),
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: '/addFavouriteMatch'
            }).done(function (data) {
                $('#addFavButton').hide();
                $('#remFavButton').show();
                if(parseInt(document.getElementById('insert_v14').textContent)!=NaN) document.getElementById('insert_v14').textContent = parseInt(document.getElementById('insert_v14').textContent)+1;
            });
        }
    }

    function remFavourite(pid) {
        $.ajax({
            data: JSON.stringify({
                matchid: pid
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/remFavouriteMatch'
        }).done(function (data) {
            $('#addFavButton').show();
            $('#remFavButton').hide();
            if(parseInt(document.getElementById('insert_v14').textContent)!=NaN) document.getElementById('insert_v14').textContent = parseInt(document.getElementById('insert_v14').textContent)-1;
        });
    }

    function callModal(pid) {
        document.getElementById('addFavButton').setAttribute("onclick", "addFavourite(\"" + pid + "\")");
        document.getElementById('remFavButton').setAttribute("onclick", "remFavourite(\"" + pid + "\")");
        univpid = pid;

        for (var x = 1; x <= 14; x++) {
            $("#insert_v" + x).empty();
        }
        document.getElementById('insert_v1').textContent = match_dict[pid][0];
        document.getElementById('insert_v4').textContent = match_dict[pid][1];
        document.getElementById('insert_v7').textContent = match_dict[pid][2];
        document.getElementById('insert_v10').textContent = match_dict[pid][3];
        document.getElementById('insert_v11').textContent = match_dict[pid][4];
        document.getElementById('insert_v12').textContent = match_dict[pid][5];

        for (var x = 1; x <= 14; x++) {
            if (x != 1 && x != 4 && x != 7 && x != 10 && x != 11 && x != 12) {
                var loading = document.createElement("i");
                loading.setAttribute("class", "fa fa-spinner fa-spin");
                loading.setAttribute("style", "font-size:16px");
                document.getElementById('insert_v' + x).appendChild(loading);
            }
        }

        $('#toggleMatchModal').click();
        $.ajax({
            data: JSON.stringify({
                matchid: pid
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/checkFavouriteMatch'
        }).done(function (data) {
            if (data.guest) {
                $('#addFavButton').show();
                $('#remFavButton').hide();
                document.getElementById('addFavButton').setAttribute("onclick", "addFavourite(\"" + -1 + "\")");
            } else if (data.isFavourite) {
                $('#addFavButton').hide();
                $('#remFavButton').show();
            } else {
                $('#addFavButton').show();
                $('#remFavButton').hide();
            }
        });

        $.ajax({
            data: JSON.stringify({
                matchid: pid
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/getmatchinfo'
        }).done(function (data) {
            numfav = data.biodata[0][13];
            for (var x = 1; x <= 14; x++) {
                $("#insert_v" + x).empty();
            }

            for (var x = 1; x <= 14; x++) {
                document.getElementById('insert_v' + x).textContent = data.biodata[0][x - 1];
            }

        });
    }

    window.addFavourite = addFavourite;
    window.remFavourite = remFavourite;
    window.callModal = callModal;


});
