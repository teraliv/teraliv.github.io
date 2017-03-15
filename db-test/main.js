
var socket = io.connect("http://76.28.150.193:8888");

socket.on("load", function (data) {
    console.log(data);
    var loadedData = data;
});

var data = {
    studentname: "Alex Terikov",
    statename: "gamestate-001",
    data: {x: 10, y: 20}
};

socket.emit("save", data);
socket.emit("load", { studentname: "Alex Terikov", statename: "gamestate-001" });

window.onload = function () {
    

};
