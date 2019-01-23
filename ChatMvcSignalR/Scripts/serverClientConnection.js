$truePass = "";

function setUsernameAndPass() {

    $userName = $("#userName").val();
    $passwrd = $("#Password").val();

    $.connection.hub.start().done(function () {
        if ($passwrd === $truePass) {

            $.connection.chatHub.server.login($userName);
            $(".chat").css("display", "block");
            $(".users").css("display", "block");
            $(".login").css("display", "none");
            $(".textbox").css("display", "block");

        } else {

            $("#error").text("Felaktikt lösenord eller inloggningsnamn");
        }
    });
}




$.connection.chatHub.client.msgReciever = function (message, user, date) {
    $("#msgs").append("<li><p>" + date + " " + user + ":  " + message + "</p></li>");
};

$.connection.chatHub.client.msgCaller = function (message, user, date) {
    $("#msgs").append("<li id='Caller'><p>" + date + " You" + ":  " + message + "</p></li>");
};

$.connection.chatHub.client.msgPriv = function (message, user, date) {
    $("#msgs").append("<li id='priv'><p>" + date + " " + user + " Whispers:  " + message + "</p></li>");
};


$.connection.chatHub.client.userList = function (userList) {
    $("#userlist").text(" ");

    userList.forEach(function (user) {
        $("#userlist").append("<li><p id='displayname'>" + user.Name + "</p></li>");
    });

    $("#sendTo").text("");
    userList.forEach(function (user) {
        $("#sendTo").append("<option value=" + user.SetId + ">" + user.Name + "</option>");
    });
    $("#sendTo").append("<option value='all' selected='selected' >All</option>");

};

$.connection.chatHub.client.getId = function (id) {
    $("#msgs").append("<li>" + id + "</li>");
};


function ButtonClick() {
    var sendTo = document.getElementById("sendTo").value;
    console.log(sendTo);
    var msg = $("#textu").val();
    if (msg.includes("<script>")) {
        alert("inte injicera!");
    }

    if (sendTo === "all") {
        $.connection.chatHub.server.pushMessageReciever($("#textu").val(), $userName);
        $.connection.chatHub.server.pushMessageCaller($("#textu").val(), $userName);
        $("#textu").val("");
    } else {
        $.connection.chatHub.server.pushMessagePrivate($("#textu").val(), $userName, sendTo);
        $.connection.chatHub.server.pushMessageCaller($("#textu").val(), $userName);

        $("#textu").val("");
    }
}

