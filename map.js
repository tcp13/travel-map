google.charts.load('current', {
    packages:['geochart'],
    callback: displayContent
});
    
    
function displayContent() {

    // hide timeline view by default
    setViewMap();

    // data init
    var data = new google.visualization.DataTable();
    // data.addColumn('string', 'Location');
    data.addColumn('number', 'Lat');
    data.addColumn('number', 'Long');
    data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
    for(i=0; i<markers.length; i++){
        data.addRow([markers[i].lat, markers[i].long, "<span class='map-tooltip'>" + markers[i].tooltip + "</span>"]);
    }

    // draw map
    var chart = new google.visualization.GeoChart(document.getElementById('map'));
    var options = {
        region: 'US',
        displayMode: 'markers',
        resolution: 'provinces',
        keepAspectRatio: true,
        backgroundColor: '#343235',
        datalessRegionColor: '#F0EBE7',
        defaultColor: '#5F90B0',
        // tooltip: {textStyle: {color: '#343235', fontName: 'inherit'}},
        // tooltip: { trigger: 'none'}
        tooltip: {isHtml: true}
    };
    chart.draw(data, options);

    // map click event handler
    google.visualization.events.addListener(chart, 'select', function () {
        var selection = chart.getSelection();
        if (selection.length > 0) {
            // iterate over markers to find modal content
            for(i=0; i<markers.length; i++){
                if(markers[i].lat == data.getValue(selection[0].row, 0) && markers[i].long == data.getValue(selection[0].row, 1)){
                    $("#modal #story-content").empty();

                    // featured image layout
                    if(markers[i].img){
                        $("#modal #story-content").append("<div class='col-2-skewed'><div class='col'><a class='img-link' href='/images/" + markers[i].img + "' target='_blank' aria-label='View Full Image'><img class='modal-img' src='/images/" + markers[i].img + "' alt=''></a></div><div class='col'><button aria-label='close modal' type='button' class='close-modal' onclick='toggleModal();'>&times;</button><p class='modal-date'>" + markers[i].date + "</p><h1>" + markers[i].title + "</h1><p>" + markers[i].content + "</p></div></div>");
                    }

                    // gallery image layout
                    else if(markers[i].gallery){
                        $("#modal #story-content").append("<button aria-label='close modal' type='button' class='close-modal' onclick='toggleModal();'>&times;</button>");
                        $("#modal #story-content").append("<p class='modal-date'>" + markers[i].date + "</p>");
                        $("#modal #story-content").append("<h1>" + markers[i].title + "</h1>");
                        for(j=0; j<markers[i].gallery.length; j++){
                            $("#modal #story-content").append("<a class='img-link' href='/images/" + markers[i].gallery[j] + "' target='_blank' aria-label='View Full Image'><img class='modal-gallery-img' src='/images/" + markers[i].gallery[j] + "' alt=''></a>");
                        }
                        if(markers[i].content){
                            $("#modal #story-content").append("<hr><p>" + markers[i].content + "</p>");
                        }
                    }

                    // text layout
                    else{
                        $("#modal #story-content").append("<button aria-label='close modal' type='button' class='close-modal' onclick='toggleModal();'>&times;</button>");
                        $("#modal #story-content").append("<p class='modal-date'>" + markers[i].date + "</p>");
                        $("#modal #story-content").append("<h1>" + markers[i].title + "</h1>");
                        $("#modal #story-content").append("<p>" + markers[i].content + "</p>");
                    }

                    toggleModal();
                }
            }
        }
    });

    // draw timeline
    for(i=0; i<markers.length; i++){
        $("#timeline").append("<div class='card' data-cat='" + markers[i].cat + "' data-lat='" + markers[i].lat + "' data-long='" + markers[i].long + "' role='button'><p class='timeline-date'>" + markers[i].date + "</p><h2>" + markers[i].title + "</h2></div>");
    }

    // timeline click event handler
    $("#timeline .card").click(function(){
        // iterate over markers to find modal content
        for(i=0; i<markers.length; i++){
            if(markers[i].lat == $(this).attr("data-lat") && markers[i].long == $(this).attr("data-long")){
                $("#modal #story-content").empty();

                // featured image layout
                if(markers[i].img){
                    $("#modal #story-content").append("<div class='col-2-skewed'><div class='col'><a class='img-link' href='/images/" + markers[i].img + "' target='_blank' aria-label='View Full Image'><img class='modal-img' src='/images/" + markers[i].img + "' alt=''></a></div><div class='col'><button aria-label='close modal' type='button' class='close-modal' onclick='toggleModal();'>&times;</button><p class='modal-date'>" + markers[i].date + "</p><h1>" + markers[i].title + "</h1><p>" + markers[i].content + "</p></div></div>");
                }

                // gallery image layout
                else if(markers[i].gallery){
                    $("#modal #story-content").append("<button aria-label='close modal' type='button' class='close-modal' onclick='toggleModal();'>&times;</button>");
                    $("#modal #story-content").append("<p class='modal-date'>" + markers[i].date + "</p>");
                    $("#modal #story-content").append("<h1>" + markers[i].title + "</h1>");
                    for(j=0; j<markers[i].gallery.length; j++){
                        $("#modal #story-content").append("<a class='img-link' href='/images/" + markers[i].gallery[j] + "' target='_blank' aria-label='View Full Image'><img class='modal-gallery-img' src='/images/" + markers[i].gallery[j] + "' alt=''></a>");
                    }
                    if(markers[i].content){
                        $("#modal #story-content").append("<hr><p>" + markers[i].content + "</p>");
                    }
                }

                // text layout
                else{
                    $("#modal #story-content").append("<button aria-label='close modal' type='button' class='close-modal' onclick='toggleModal();'>&times;</button>");
                    $("#modal #story-content").append("<p class='modal-date'>" + markers[i].date + "</p>");
                    $("#modal #story-content").append("<h1>" + markers[i].title + "</h1>");
                    $("#modal #story-content").append("<p>" + markers[i].content + "</p>");
                }

                toggleModal();
            }
        }
    });

    // filter when any checkbox is clicked
    $(".map-page input[type='checkbox']").click(function(){

        // define updated data
        let updatedData = new google.visualization.DataTable();
        // updatedData.addColumn('string', 'Location');
        updatedData.addColumn('number', 'Lat');
        updatedData.addColumn('number', 'Long');
        updatedData.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});

        // iterate through all filter categories
        $(".map-page input[type='checkbox']").each(function(){
            if($(this).is(':checked')){
                // iterate through all markers to update map data
                for(i=0; i<markers.length; i++){
                    if(markers[i].cat == $(this).attr("data-filter")){
                        updatedData.addRow([markers[i].lat, markers[i].long, "<span class='map-tooltip'>" + markers[i].tooltip + "</span>"]);
                    }
                }
                // show on timeline
                $("#timeline .card[data-cat='" + $(this).attr("data-filter") + "']").show();
            }
            else{
                // hide on timeline
                $("#timeline .card[data-cat='" + $(this).attr("data-filter") + "']").hide();
            }
        });

        // draw updated map
        data = updatedData;
        chart.draw(updatedData, options);
    });
    
};


// view toggles

function setViewMap(){
    $("#timeline").hide();
    $("#map").css("translate", "0px");
    $("#map-view").addClass("active-view");
    $("#timeline-view").removeClass("active-view");
}

function setViewTimeline(){
    $("#map").css("translate", "-1rem");
    $("#timeline").show();
    $("#timeline-view").addClass("active-view");
    $("#map-view").removeClass("active-view");
}