function jumpTo(id) {
    $('body, html').animate({
        scrollTop: $("#" + id).offset().top
    }, 600);
}

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
            enableAddMarkerByClick = false;
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

        // $("#location-subdiv").css('min-height', "calc(100vh - 160px - "+$("#site-navbar").outerHeight()+"px - "+$(".footer").height()+"px");
        $(window).on('resize', function () {
            if ($(window).width() > 576) {
                $("#location-subdiv").css('min-height', "calc(100vh - " + $("#site-navbar").outerHeight() + "px - " + $(".footer").outerHeight() + "px");
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

        $("#map").css('min-height', "calc(100vh - " + $("#site-navbar").outerHeight() + "px - " + $(".footer").outerHeight() + "px");
        if (parseInt($("#map").css('min-height')) <= 450) {
            $("#map").css('min-height', "450px");
        } else {
            setTimeout(function () {
                map.resize();
            }, 400);
        }

        $(window).on('resize', function () {
            $("#map").css('min-height', "calc(100vh - " + $("#site-navbar").outerHeight() + "px - " + $(".footer").outerHeight() + "px");
            if (parseInt($("#map").css('min-height')) <= 450) {
                $("#map").css('min-height', "450px");
            } else {
                setTimeout(function () {
                    map.resize();
                }, 400);
            }
        }).trigger('resize');

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

        $("#map-legend").click("#map-legend-close", function (e) {
            e.preventDefault();
            mapLegendHidden = true;
            $('#map-legend').hide();
            $("#map-legend-reduced").show();
        });

        $("#map-legend-open").click(function (e) {
            e.preventDefault();
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

        $("#choice-legend-close").click(function (e) {
            e.preventDefault();
            choiceLegendHidden = true;
            $('#choice-legend').hide();
            $("#choice-legend-reduced").show();
        });

        $("#choice-legend-open").click(function (e) {
            e.preventDefault();
            choiceLegendHidden = false;
            $("#choice-legend-reduced").hide();
            $('#choice-legend').show();
        });

        $('#choiceInterval').on('change', function () {
            $(".mapboxgl-marker").remove();
            choiceProcess(this.value, false);
        });

        $('.mapboxgl-marker').click(function () {
            var delayInMilliseconds = 400;
            setTimeout(function () {
                $('[data-toggle="tooltip"]').tooltip();
            }, delayInMilliseconds);
        });
    } else if (window.location.href.indexOf("dataovertime") > -1) {
        $('#select-parameters').on('change', function (e) {
            var theDiv = document.getElementById('heatmap');
            theDiv.style.background = 'white';
            recreateGraph($(this).val());
        });
    } else if (window.location.href.indexOf("api") > -1) {
        $("pre").css('height', $(".card").css('height'));
        var delayInMilliseconds = 200;

        $(window).on('resize', function () {
            $("pre").css('height', $(".card").css('height'));
        }).trigger('resize');

        $(".nav-link-card").click(function () {
            setTimeout(function () {
                $("pre").css('height', $(".card").css('height'));
            }, delayInMilliseconds);
        });

        $('#base-request-choice').on('change', function () {
            var optSelected = $(this).children("option:selected").val();
            if (optSelected != null) {
                $(".base-choice-div").hide();
                $("#" + optSelected).show();
            } else {
                $(".base-choice-div").hide();
            }
            setTimeout(function () {
                $("pre").css('height', $(".card").css('height'));
            }, delayInMilliseconds);
        });

        $('#select-anydevice').on('change', function () {
            var interval = $("#select-anydevice option:selected").val();
            var area = $("#select-anydevice option:selected").parent().attr('label');
            if (interval != null) {
                if (area != null) {
                    getDataAnyDeviceAPI(area, interval)
                }
            }
        });

        $('#dataset-choice').on('change', function () {
            var optSelected = $("#dataset-choice option:selected").val();
            if (optSelected != null) {
                getFields(optSelected);
                $("#group-fields-inputs").show();
            } else {
                $("#group-fields-inputs").hide();
            }
            setTimeout(function () {
                $("pre").css('height', $(".card").css('height'));
            }, delayInMilliseconds);
        });

        $('#downloadBtn').click(function () {
            $("#downloadBtn").hide();
            $("#downloadLoadingBtn").show();
            $.getJSON($("#url-div-url").attr('href'), function (data) {
                var text = JSON.stringify(data, null, 4);
                var filename = "aqp_data.json";
                downloadFileFromURL(filename, text);
                $("#downloadLoadingBtn").hide();
                $("#downloadBtn").show();
                $("#toastTitle").html("Success");
                $("#toastBody").html("The download started.");
                $('#toastInfo').toast("show");
            });
        });

        $("#list-inputs").on("change", ".field-input.tt-input", function () {
            var crtValue = $(this).val();
            var found = false;
            if (crtValue !== "") {
                for (var k = 0; k < fields.length; k++) {
                    if (fields[k].id === crtValue) {
                        $(this).closest(".row-inputs").find(".value-input").attr("placeholder", fields[k].type);
                        found = true;
                    }
                }
            }
            if (!found) {
                $(this).closest(".row-inputs").find(".value-input").attr("placeholder", "Value");
            }

            var allFilled = true;
            var lastInputField = 0;
            var twoEmptyFields = 0;
            $("input.field-input.tt-input").each(function () {
                if ($(this).val() == "") {
                    allFilled = false;
                    twoEmptyFields++;
                    if (twoEmptyFields === 2) {
                        $(this).closest(".input-group").remove();
                        setTimeout(function () {
                            $("pre").css('height', $(".card").css('height'));
                        }, delayInMilliseconds);
                    }
                }
                lastInputField++;
            });

            if (allFilled) {
                $('<div class="input-group input-group-next">\
                   <div class="row row-inputs">\
                   <div class="col-auto input-group-prepend padding-col">\
                   <span class="input-group-text input-group-text-special"><i class="material-icons">add</i></span>\
                   </div>\
                   <div class="col padding-col">\
                   <input id="field'+ lastInputField + '" type="text" aria-label="Field" class="form-control field-input" placeholder="Field">\
                   </div>\
                   <div class="col padding-col">\
                   <input id="value'+ lastInputField + '" type="text" aria-label="Value" class="form-control value-input" placeholder="Value">\
                   </div></div></div>').appendTo("#list-inputs");

                setTimeout(function () {
                    $('.field-input').typeahead('destroy');
                    $('.field-input').typeahead(
                        {
                            hint: true,
                            highlight: true,
                            minLength: 1,
                            items: 'all'
                        }, {
                            name: 'state',
                            source: substringMatcher(fields)
                        });
                    $("pre").css('height', $(".card").css('height'));
                }, delayInMilliseconds);
            }
        });

        $('#btnCopy').click(function () {
            $("#copyAndCode").hide();
            $("#spinnyBoi").attr('style', 'display:block !important');
            $.getJSON($("#url-div-url").attr('href'), function (data) {
                var $temp = $("<input>");
                $("body").append($temp);
                $temp.val(JSON.stringify(data)).select();
                document.execCommand("copy");
                $temp.remove();
                $("#spinnyBoi").attr('style', 'display:none !important');
                $("#copyAndCode").show();
                $("#toastTitle").html("Success");
                $("#toastBody").html("The JSON was copied to the clipboard.");
                $('#toastInfo').toast("show");
            });
        });

        $("#submitFiltersInputs").click(function () {
            var dataset_id = $("#dataset-choice option:selected").val();
            if (dataset_id != null) {
                var filters = [];
                var filter = "";
                var valueFilter = "";
                var options = {};
                $("input.field-input.tt-input").each(function () {
                    filter = $(this).val();
                    if (filter !== "") {
                        valueFilter = $(this).closest(".row-inputs").find(".value-input").val();
                        if (valueFilter !== "") {
                            for (var k = 0; k < fields.length; k++) {
                                if (fields[k].id === filter) {
                                    filters.push({
                                        id: filter,
                                        type: fields[k].type,
                                        value: valueFilter
                                    });
                                }
                            }
                        }
                    }
                });

                var fieldsToReturn = [];
                $("#fieldsCheckboxes input").each(function () {
                    if ($(this).prop("checked")) {
                        fieldsToReturn.push($(this).val());
                    }
                });
                if (fieldsToReturn.length != 0) {
                    options["fields"] = fieldsToReturn.join();
                }

                var selectedSort = $("#sortSelection option:selected").val();
                if ((selectedSort !== "not-set") && (selectedSort != null)) {
                    if ($("#orderSelection option:selected").val() != null) {
                        options["sort"] = selectedSort + " " + $("#orderSelection option:selected").val();
                    }
                }

                var limitChoice = parseInt($("#limitInput").val());
                if (!isNaN(limitChoice)) {
                    options["limit"] = limitChoice;
                }

                getDatasearch(dataset_id, filters, options)
            } else {
                $("#toastTitle").html("Warning");
                $("#toastBody").html("Choose a dataset.");
                $('#toastInfo').toast("show");
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
                    submitCoordinatesAPI(longitude, latitude);
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

        $("#submitAQIinputs").click(function () {
            var aqi_area = $("#select-aqi option:selected").val();
            var diameter = $("#choiceDiameter").val();
            if (diameter != null) {
                if (/^[+]?([0-9]*[.])?[0-9]{0,2}$/.test(diameter)) {
                    if (parseFloat(diameter) <= parseFloat($("#choiceDiameter").attr("max")) && parseFloat(diameter) >= parseFloat($("#choiceDiameter").attr("min"))) {
                        if (aqi_area != null) {
                            if (/^[a-zA-Z]+$/.test(aqi_area) && aqi_area !== "") {
                                getAQILevels(aqi_area, diameter);
                            } else {
                                $("#toastTitle").html("Warning");
                                $("#toastBody").html("Choose an area.");
                                $('#toastInfo').toast("show");
                            }
                        } else {
                            $("#toastTitle").html("Warning");
                            $("#toastBody").html("Choose an area.");
                            $('#toastInfo').toast("show");
                        }
                    } else {
                        $("#toastTitle").html("Error");
                        $("#toastBody").html("The diameter value is higher or lower than accepted values.");
                        $('#toastInfo').toast("show");
                    }
                } else {
                    $("#toastTitle").html("Error");
                    $("#toastBody").html("The diameter value is not acceptable.");
                    $('#toastInfo').toast("show");
                }
            } else {
                $("#toastTitle").html("Warning");
                $("#toastBody").html("Choose a diameter.");
                $('#toastInfo').toast("show");
            }
        });

        $("#diameter_value").val($("#choiceDiameter").val());
        $('#choiceDiameter').on('change', function () {
            $("#diameter_value").val($("#choiceDiameter").val());
        });
    } else if (window.location.href.indexOf("datalocation") > -1) {
        $("#map-legend-close").click(function (e) {
            e.preventDefault();
            $('#map-legend').hide();
            $("#map-legend-reduced").show();
        });

        $("#map-legend-open").click(function (e) {
            e.preventDefault();
            $("#map-legend-reduced").hide();
            $('#map-legend').show();
        });

        $("#map-legend-close-2").click(function (e) {
            e.preventDefault();
            $('#map-legend-2').hide();
            $("#map-legend-reduced-2").show();
        });

        $("#map-legend-open-2").click(function (e) {
            e.preventDefault();
            $("#map-legend-reduced-2").hide();
            $('#map-legend-2').show();
        });
    } else if (window.location.href.indexOf("aqi") > -1) {
        $("#map").css('min-height', "calc(100vh - " + $("#site-navbar").outerHeight() + "px - " + $(".footer").outerHeight() + "px");
        if (parseInt($("#map").css('min-height')) <= 450) {
            $("#map").css('min-height', "450px");
        } else {
            setTimeout(function () {
                map.resize();
            }, 400);
        }

        $(window).on('resize', function () {
            $("#map").css('min-height', "calc(100vh - " + $("#site-navbar").outerHeight() + "px - " + $(".footer").outerHeight() + "px");
            if (parseInt($("#map").css('min-height')) <= 450) {
                $("#map").css('min-height', "450px");
            } else {
                setTimeout(function () {
                    map.resize();
                }, 400);
            }
        }).trigger('resize');

        $("#choice-legend-close").click(function (e) {
            e.preventDefault();
            $('#choice-legend').hide();
            $("#choice-legend-reduced").show();
        });

        $("#choice-legend-open").click(function (e) {
            e.preventDefault();
            $("#choice-legend-reduced").hide();
            $('#choice-legend').show();
        });

        $(".choiceArea").click(function (e) {
            e.preventDefault();
            var addressValue = $(this).attr("href");
            var diameter = $('#choiceDiameter').val();
            window.location.href = addressValue + "&diameter=" + diameter;
        });

        $("#diameter_value").val($("#choiceDiameter").val());
        $('#choiceDiameter').on('change', function () {
            $("#diameter_value").val($("#choiceDiameter").val());
        });

        $("#map-legend-close").click(function (e) {
            e.preventDefault();
            $('#map-legend').hide();
            $("#map-legend-reduced").show();
        });

        $("#map-legend-open").click(function (e) {
            e.preventDefault();
            $("#map-legend-reduced").hide();
            $('#map-legend').show();
        });
    } else if (window.location.href.indexOf("about") > -1) {
        $(window).on('resize', function () {
            if ($(window).width() > 576 && $(window).height() > 576) {
                $(".scroll-about").css('height', "calc(100vh - " + $("#site-navbar").outerHeight() + "px - 72px");
            } else {
                $(".scroll-about").css('height', "");
            }
        }).trigger('resize');
    } else {
        /* Size content */
        $("#jumbotron-container").css('min-height', "calc(100vh - 160px - " + $("#site-navbar").outerHeight() + "px - " + $(".footer").height() + "px");
        $(window).on('resize', function () {
            $("#jumbotron-container").css('min-height', "calc(100vh - 160px - " + $("#site-navbar").outerHeight() + "px - " + $(".footer").height() + "px");
        }).trigger('resize');
    }
});
