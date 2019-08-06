
function sendFeedback(emailAddress, messageFeedback){
    feedbackToSend = {email: emailAddress, message: messageFeedback}
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

function submitCoordinates(longitude, latitude){
    var coordToSend = {longitude: longitude, latitude: latitude};
    $.ajax({
        type: 'get',
        url: '/airdata/checkcoordinates',
        data: coordToSend,
        dataType: 'json',
        success: function (res) {
            if (res.data.inzone){
                window.location.href = "/airdata/fromlocation?longitude="+longitude+"&latitude="+latitude;
            } else {
                $("#toastTitle").html("Sorry");
                $("#toastBody").html("The chosen location is not in any area covered by our data. Here are the area(s) covered: "+res.data.listcover.join(", ")+".");
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

function getDataOverTime(recordid, datasetid){
    console.log(typeof(recordid));
    console.log(typeof(datasetid));
}