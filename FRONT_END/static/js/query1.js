var dataplot = [];

$(document).ready(function () {
    $('#openings_form').on('submit', function (event) {
        $.ajax({
            data: JSON.stringify({
                num: $('#num_openings').val(),
                black: $('#black:checked').val(),
                white: $('#white:checked').val(),
                both: $('#both:checked').val(),
                sort1: $('#sort1').val(),
                sort2: $('#sort2').val()
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/query1form'
        })

            .done(function (data) {
                console.log("Got back data for query 1");
                dataplot = [];
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
                var headText0 = document.createTextNode("Rank");
                var headText1 = document.createTextNode("Move");
                var headText2 = document.createTextNode("Freq.");
                var headText3 = document.createTextNode("Win %");

                headCell0.appendChild(headText0);
                headCell1.appendChild(headText1);
                headCell2.appendChild(headText2);
                headCell3.appendChild(headText3);
                headRow.appendChild(headCell0);
                headRow.appendChild(headCell1);
                headRow.appendChild(headCell2);
                headRow.appendChild(headCell3);

                tblHead.appendChild(headRow);

                var tblBody = document.createElement("tbody");
                for (var i = 0; i < data.moves.length; i++) {
                    var row = document.createElement("tr");
                    for (var j = 0; j < 4; j++) {
                        var cell = document.createElement("td");
                        var cellText = j == 0 ? document.createTextNode(i) : document.createTextNode(data.moves[i][j - 1]);

                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    dataplot.push({ y: data.moves[i][1], indexLabel: data.moves[i][0] })
                    tblBody.appendChild(row);
                }


                tbl.appendChild(tblHead);
                tbl.appendChild(tblBody);
                var oldtable = document.getElementById('table_openings')
                if (oldtable != null) oldtable.remove();
                tbl.className = "table tablesorter";
                body.append(tbl);
                // tbl.setAttribute("border", "2");


                var chart = new CanvasJS.Chart("chartContainer",
                    {
                        title: {
                            text: "Most common Openings"
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


            })
        event.preventDefault();
    });
});

