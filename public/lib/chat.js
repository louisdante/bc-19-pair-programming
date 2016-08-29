$(document).ready(function($) {
    username = $("body").attr("username")

    function chatInit(session) {
        url = "sessions/" + session + "messages/"
            //console.log(sess_id)
            // var fire = new Firebase('https://pair-pro.firebaseio.com/sessions/' + sess_id);


        fire.child("/messages").on('child_added', function(child, prev) {
            console.log(child.val())
            d = child.val()
            $("#messagesContainer").append('<p class="animated bounceIn"><b>' + d.username + '</b>: ' + d.text + '' +
                '<i class="">done_all</i></p>')
        });

        $("#sendChatBtn").click(function() {
            sendToFirebase();
        });

        $('#messageInput').keypress(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                sendToFirebase()
            }
        });


        function sendToFirebase() {
            text = $("#messageInput").val();
            if (text.trim()) {
                var fire = new Firebase('https://pair-pro.firebaseio.com/sessions/' + session + '/messages');
                fire.push({ username: username, text: text })
                $("#messageInput").val("")
            } else {
                alert("Please type something!!")
            }
        }
    }


    session = $("#chatDiv").attr("session-id");
    if (session) {
        chatInit(session - id);
    }

});