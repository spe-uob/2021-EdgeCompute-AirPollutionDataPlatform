if (window.location.href.indexOf("api") > -1){
    var fields;
}

var substringMatcher = function (strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;
        matches = [];

        substrRegex = new RegExp(q, 'i');

        $.each(strs, function (i, str) {
            if (substrRegex.test(str.id))
                matches.push(str.id);
        })
        cb(matches);
    }
}

function sendFeedback(emailAddress, messageFeedback) {
    feedbackToSend = { email: emailAddress, message: messageFeedback }
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(feedbackToSend),
        dataType: 'json',
        success: function (data) {
            $("#modalFeedback").modal('hide');
            $("#toastTitle").html("Information");
            $("#toastBody").html("The feedback was successfuly sent.");
            $('#toastInfo').toast("show");
        },
        error: function (err) {
            console.log("failed to quit the project", err);
            $("#toastTitle").html("Error");
            $("#toastBody").html("There was an error when sending the feedback.");
            $('#toastInfo').toast("show");
        },
        processData: false,
        type: 'POST',
        url: '/mail/feedback'
    });
}

function submitCoordinates(longitude, latitude) {
    var coordToSend = { longitude: longitude, latitude: latitude };
    $.ajax({
        type: 'get',
        url: '/airdata/checkcoordinates',
        data: coordToSend,
        dataType: 'json',
        success: function (res) {
            if (res.data.inzone) {
                window.location.href = "/airdata/datalocation?longitude=" + longitude + "&latitude=" + latitude;
            } else {
                $("#toastTitle").html("Sorry");
                $("#toastBody").html("The chosen location is not in any area covered by our data. Here are the area(s) covered: " + res.data.listcover.join(", ") + ".");
                $('#toastInfo').toast("show");
            }
        },
        error: function (err) {
            console.log("check if coordinates are good failed with error: ", err);
            $("#toastTitle").html("Error");
            $("#toastBody").html("There was an error when checking the inputs.");
            $('#toastInfo').toast("show");
        }
    });
}

function getFields(dataset_id){
    var dataToSend = { dataset_id: dataset_id };
    $("#copyAndCode").hide();
    $("#spinnyBoi").attr('style','display:block !important');
    $.ajax({
        type: 'get',
        url: '/api/dataset_info',
        data: dataToSend,
        dataType: 'json',
        complete : function(){
            $("#spinnyBoi").attr('style','display:none !important');
            $("#copyAndCode").show();
            $("#btnCopy").show();
            $("#url-div").show();
            $("#url-div-url").text(this.url);
            $("#url-div-url").attr("href", this.url);
            $("#nav-download-tab").show();
            setTimeout(function () {
                $("pre").css('height', $(".card").css('height'));
            }, 200);
        },
        success: function (res) {
            $('#api_output').html(library.json.prettyPrint(res));
            fields = res.fields;
            for (var k = 0; k<fields.length; k++){
                if (fields[k].id === "_id"){
                    fields.splice(k, 1);
                }
            }
            var checkboxesElem = "";
            var sortSelectionElem = '<option value="not-set" selected>Not set</option>';
            for (var k = 0; k<fields.length; k++){
                checkboxesElem += '<div class="form-check"><input class="form-check-input" type="checkbox" value="'+fields[k].id+'" id="checkbox'+k+'">\
                                   <label class="form-check-label" for="checkbox'+k+'">'+fields[k].id+'</label></div>';
                sortSelectionElem += '<option value="'+fields[k].id+'">'+fields[k].id+'</option>'
                
            }
            $("#fieldsCheckboxes").html(checkboxesElem);
            $("#sortSelection").html(sortSelectionElem);
            fields.push({
                id: "all",
                type: "text"
            })
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
            $("#toastTitle").html("Success");
            $("#toastBody").html("The fields of the dataset were imported.");
            $('#toastInfo').toast("show");
        },
        error: function (err) {
            $('#api_output').html(library.json.prettyPrint(err));
            console.log("Request failed ", err);
            $("#toastTitle").html("Error");
            $("#toastBody").html("There was an error when requesting the fields of the selected dataset.");
            $('#toastInfo').toast("show");
        }
    });
}

function submitCoordinatesAPI(longitude, latitude){
    var position = { longitude: longitude, latitude: latitude };
    $("#copyAndCode").hide();
    $("#spinnyBoi").attr('style','display:block !important');
    $.ajax({
        type: 'get',
        url: '/api/fromlocation',
        data: position,
        dataType: 'json',
        complete : function(){
            $("#spinnyBoi").attr('style','display:none !important');
            $("#copyAndCode").show();
            $("#btnCopy").show();
            $("#url-div").show();
            $("#url-div-url").text(this.url);
            $("#url-div-url").attr("href", this.url);
            $("#nav-download-tab").show();
            setTimeout(function () {
                $("pre").css('height', $(".card").css('height'));
            }, 200);
        },
        success: function (res) {
            $('#api_output').html(library.json.prettyPrint(res));
            $("#toastTitle").html("Success");
            $("#toastBody").html("The data was imported.");
            $('#toastInfo').toast("show");
        },
        error: function (err) {
            $('#api_output').html(library.json.prettyPrint(err));
            console.log("Request failed ", err);
            $("#toastTitle").html("Error");
            $("#toastBody").html("There was an error when requesting the data.");
            $('#toastInfo').toast("show");
        }
    });  
}

function getDataAnyDeviceAPI(area, interval){
    var options = { area: area, interval: interval };
    $("#copyAndCode").hide();
    $("#spinnyBoi").attr('style','display:block !important');
    $.ajax({
        type: 'get',
        url: '/api/anydevice',
        data: options,
        dataType: 'json',
        complete : function(){
            $("#spinnyBoi").attr('style','display:none !important');
            $("#copyAndCode").show();
            $("#btnCopy").show();
            $("#url-div").show();
            $("#url-div-url").text(this.url);
            $("#url-div-url").attr("href", this.url);
            $("#nav-download-tab").show();
            setTimeout(function () {
                $("pre").css('height', $(".card").css('height'));
            }, 200);
        },
        success: function (res) {
            $('#api_output').html(library.json.prettyPrint(res));
            $("#toastTitle").html("Success");
            $("#toastBody").html("The data was imported.");
            $('#toastInfo').toast("show");
        },
        error: function (err) {
            $('#api_output').html(library.json.prettyPrint(err));
            console.log("Request failed ", err);
            $("#toastTitle").html("Error");
            $("#toastBody").html("There was an error when requesting the data.");
            $('#toastInfo').toast("show");
        }
    });
}

function getDatasearch(dataset_id, filters, options){
    var dataToSend = { dataset_id: dataset_id, filters: filters, options: options };
    $("#copyAndCode").hide();
    $("#spinnyBoi").attr('style','display:block !important');
    $.ajax({
        type: 'get',
        url: '/api/dataset_search',
        data: dataToSend,
        dataType: 'json',
        complete : function(){
            $("#spinnyBoi").attr('style','display:none !important');
            $("#copyAndCode").show();
            $("#btnCopy").show();
            $("#url-div").show();
            $("#url-div-url").text(this.url);
            $("#url-div-url").attr("href", this.url);
            $("#nav-download-tab").show();
            setTimeout(function () {
                $("pre").css('height', $(".card").css('height'));
            }, 200);
        },
        success: function (res) {
            $('#api_output').html(library.json.prettyPrint(res));
            $("#toastTitle").html("Success");
            $("#toastBody").html("The data was succcesfully retrieved.");
            $('#toastInfo').toast("show");
        },
        error: function (err) {
            $('#api_output').html(library.json.prettyPrint(err));
            console.log("Request failed ", err);
            $("#toastTitle").html("Error");
            $("#toastBody").html("There was an error when requesting the data.");
            $('#toastInfo').toast("show");
        }
    });  
}

function getAQILevels(aqi_area, diameter){
    var options = { area: aqi_area, diameter: diameter };
    $("#copyAndCode").hide();
    $("#spinnyBoi").attr('style','display:block !important');
    $.ajax({
        type: 'get',
        url: '/api/aqi',
        data: options,
        dataType: 'json',
        complete : function(){
            $("#spinnyBoi").attr('style','display:none !important');
            $("#copyAndCode").show();
            $("#btnCopy").show();
            $("#url-div").show();
            $("#url-div-url").text(this.url);
            $("#url-div-url").attr("href", this.url);
            $("#nav-download-tab").show();
            setTimeout(function () {
                $("pre").css('height', $(".card").css('height'));
            }, 200);
        },
        success: function (res) {
            $('#api_output').html(library.json.prettyPrint(res));
            $("#toastTitle").html("Success");
            $("#toastBody").html("The data was imported.");
            $('#toastInfo').toast("show");
        },
        error: function (err) {
            $('#api_output').html(library.json.prettyPrint(err));
            console.log("Request failed ", err);
            $("#toastTitle").html("Error");
            $("#toastBody").html("There was an error when requesting the data.");
            $('#toastInfo').toast("show");
        }
    });    
}

function downloadFileFromURL(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}