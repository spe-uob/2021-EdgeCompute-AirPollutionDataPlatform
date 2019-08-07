
$(document).ready(function () {
    $("#sendFeedback").click(function () {
        var emailAddress = $("#senderEmail").val();
        var messageFeedback = $("#feedbackText").val();
        if (messageFeedback !== "") {
            $("#invalidFeedbackText").hide();
            $("#feedbackText").removeClass("invalid");
            $("#feedbackText").addClass("valid");
            if (emailAddress !== "") {
                if (/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(emailAddress)) {
                    $("#invalidSenderEmail").hide();
                    $("#senderEmail").removeClass("invalid");
                    $("#senderEmail").addClass("valid");
                    sendFeedback(emailAddress, messageFeedback);
                } else {
                    $("#invalidSenderEmail").show();
                    $("#senderEmail").removeClass("valid");
                    $("#senderEmail").addClass("invalid");
                }
            } else {
                sendFeedback(emailAddress, messageFeedback);
            }
        } else {
            $("#invalidFeedbackText").show();
            $("#feedbackText").removeClass("valid");
            $("#feedbackText").addClass("invalid");
        }
    });

    $('#senderEmail').on('input', function () {
        var emailAddress = $("#senderEmail").val();
        if (emailAddress !== "") {
            if (/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(emailAddress)) {
                $("#invalidSenderEmail").hide();
                $("#senderEmail").removeClass("invalid");
                $("#senderEmail").addClass("valid");
            } else {
                $("#invalidSenderEmail").show();
                $("#senderEmail").removeClass("valid");
                $("#senderEmail").addClass("invalid");
            }
        } else {
            $("#invalidSenderEmail").hide();
            $("#senderEmail").removeClass("valid");
            $("#senderEmail").removeClass("invalid");
        }
    });

    $('#feedbackText').on('input', function () {
        var messageFeedback = $("#feedbackText").val();
        if (messageFeedback !== "") {
            $("#invalidFeedbackText").hide();
            $("#feedbackText").removeClass("invalid");
            $("#feedbackText").addClass("valid");
        } else {
            $("#invalidFeedbackText").show();
            $("#feedbackText").removeClass("valid");
            $("#feedbackText").addClass("invalid");
        }
    });


    $('.toast').on('show.bs.toast', function () {
        $(".toast-show").css("z-index", 999);
    });

    $('.toast').on('hidden.bs.toast', function () {
        $(".toast-show").css("z-index", -999);
    });

    if (window.location.href.indexOf("fromlocation") > -1) {

        $("#getLocationBtn").click(function () {
            geolocate.trigger();
        });

        $("#submitCoordinates").click(function () {
            var longitude = $("#longitudeInput").val();
            var latitude = $("#latitudeInput").val();
            if ((longitude !== "") && (latitude !== "")) {
                if ((/^[-+]?[0-9]*\.?[0-9]+$/.test(latitude)) && (/^[-+]?[0-9]*\.?[0-9]+$/.test(longitude))) {
                    $("#invalidCoordinatesInputs").hide();
                    $("#longitudeInput").removeClass("invalid");
                    $("#longitudeInput").addClass("valid");
                    $("#latitudeInput").removeClass("invalid");
                    $("#latitudeInput").addClass("valid");
                    submitCoordinates(longitude, latitude);
                } else {
                    $("#invalidCoordinatesInputs").show();
                    $("#longitudeInput").removeClass("valid");
                    $("#longitudeInput").addClass("invalid");
                    $("#latitudeInput").removeClass("valid");
                    $("#latitudeInput").addClass("invalid");
                }
            } else {
                $("#invalidCoordinatesInputs").show();
                $("#longitudeInput").removeClass("valid");
                $("#longitudeInput").addClass("invalid");
                $("#latitudeInput").removeClass("valid");
                $("#latitudeInput").addClass("invalid");
            }
        });

        $('#longitudeInput').on('input', function () {
            var longitude = $("#longitudeInput").val();
            if (longitude !== "") {
                if (/^[-+]?[0-9]*\.?[0-9]+$/.test(longitude)) {
                    $("#invalidCoordinatesInputs").hide();
                    $("#longitudeInput").removeClass("invalid");
                    $("#longitudeInput").addClass("valid");
                } else {
                    $("#invalidCoordinatesInputs").show();
                    $("#longitudeInput").removeClass("valid");
                    $("#longitudeInput").addClass("invalid");
                }
            } else {
                $("#invalidCoordinatesInputs").hide();
                $("#longitudeInput").removeClass("valid");
                $("#longitudeInput").removeClass("invalid");
            }
        });

        $('#latitudeInput').on('input', function () {
            var latitude = $("#latitudeInput").val();
            if (latitude !== "") {
                if (/^[-+]?[0-9]*\.?[0-9]+$/.test(latitude)) {
                    $("#invalidCoordinatesInputs").hide();
                    $("#latitudeInput").removeClass("invalid");
                    $("#latitudeInput").addClass("valid");
                } else {
                    $("#invalidCoordinatesInputs").show();
                    $("#latitudeInput").removeClass("valid");
                    $("#latitudeInput").addClass("invalid");
                }
            } else {
                $("#invalidCoordinatesInputs").hide();
                $("#latitudeInput").removeClass("valid");
                $("#latitudeInput").removeClass("invalid");
            }
        });

        $("#addMarkerBtn").click(function () {
            enableAddMarkerByClick = true;
        });


        $(window).on('resize', function () {
            if ($(window).width() > 576) {
                var height = $("#location-subdiv").height();
                $("#map").height(height);
                map.resize();
            } else {
                $("#map").height("450px");
            }
        }).trigger('resize');

        $(".btn-collapse").click(function () {
            var el = $(this).closest('.card').find(".collapse-cards");
            $(".location-icons").html("keyboard_arrow_down");
            if ($(el).hasClass("collapse-chosen")) {
                $(".collapse-chosen").removeClass("collapse-chosen");
                $(this).find(".location-icons").html("keyboard_arrow_down");
            } else {
                $(".collapse-chosen").removeClass("collapse-chosen");
                $(el).addClass("collapse-chosen");
                $(this).find(".location-icons").html("keyboard_arrow_up");
            }
            if ($(window).width() > 576) {
                var delayInMilliseconds = 400;
                setTimeout(function () {
                    var height = $("#location-subdiv").height();
                    $("#map").height(height);
                    map.resize();
                }, delayInMilliseconds);
            }
        });
    } else if (window.location.href.indexOf("anydevice") > -1) {
        var mapLegendHidden = false;
        $(window).bind('scroll', function () {
            if ($(window).scrollTop() > 150) {
                if (mapLegendHidden) {
                    $('#map-legend-reduced').hide();
                } else {
                    $('#map-legend').hide();
                }
            }
            else {
                if (mapLegendHidden) {
                    $('#map-legend-reduced').show();
                } else {
                    $('#map-legend').show();
                }
            }
        });

        $("#map-legend-close").click(function () {
            mapLegendHidden = true;
            $('#map-legend').hide();
            $("#map-legend-reduced").show();
        });

        $("#map-legend-open").click(function () {
            mapLegendHidden = false;
            $("#map-legend-reduced").hide();
            $('#map-legend').show();
        });

        var choiceLegendHidden = false;
        $(window).bind('scroll', function () {
            if ($(window).scrollTop() > 150) {
                if (choiceLegendHidden) {
                    $('#choice-legend-reduced').hide();
                } else {
                    $('#choice-legend').hide();
                }
            }
            else {
                if (choiceLegendHidden) {
                    $('#choice-legend-reduced').show();
                } else {
                    $('#choice-legend').show();
                }
            }
        });

        $("#choice-legend-close").click(function () {
            choiceLegendHidden = true;
            $('#choice-legend').hide();
            $("#choice-legend-reduced").show();
        });

        $("#choice-legend-open").click(function () {
            choiceLegendHidden = false;
            $("#choice-legend-reduced").hide();
            $('#choice-legend').show();
        });

        $('#choiceInterval').on('change', function () {
            $(".mapboxgl-marker").remove();
            choiceProcess(this.value, false);
        });

        $('.mapboxgl-marker').click(function() { 
            var delayInMilliseconds = 400;
            setTimeout(function () {
                $('[data-toggle="tooltip"]').tooltip();
            }, delayInMilliseconds);
        });
    } else if (window.location.href.indexOf("dataovertime") > -1){
        $('#select-parameters').on('change',  function (e) {
            recreateGraph($(this).val());
        });
    }
});
