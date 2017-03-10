
var socket = io.connect("http://76.28.150.193:8888");

window.onload = function () {
    console.log("starting up da sheild");

    var data = {
        studentname: "Alex Terikov",
        statename: "gamestate-001",
        data: {x: 10, y: 20}
    };


    var messages = [];

    // trying to save data to db
    socket.emit('save', data);

    // another try
    socket.on('send', function (data) {
        socket.emit('save', data);
    });

    // ping returns undefined
    socket.on("ping", function (ping) {
        console.log(ping);
        socket.emit("pong");
    });

    socket.on("connect", function () {
        console.log("Socket connected.")
    });
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });

};
