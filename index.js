// Подключение всех модулей к программе
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
const MongoClient = require("mongodb").MongoClient;

// Отслеживание порта
server.listen(3001);
console.log("Server started on port 3001")

app.use(express.static(__dirname + '/public'));
// Отслеживание url адреса и отображение нужной HTML страницы
app.get('/', function(request, respons) {
	respons.sendFile(__dirname + '/index.html');
});
// создаем объект MongoClient и передаем ему строку подключения   
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });


let users = [{name: "Bob", age: 34} , {name: "Alice", age: 21}, {name: "Tom", age: 45}];
 
mongoClient.connect(function(err, client){
      
    const db = client.db("usersdb");
    const collection = db.collection("users");
    let user = {name: "Tom", age: 23};
    collection.insertMany(users, function(err, result){
          
        if(err){ 
            return console.log(err);
        }
        console.log(result.ops);
        client.close();
    });
});

// Массив со всеми подключениями
connections = [];

// Функция, которая сработает при подключении к странице
// Считается как новый пользователь
io.sockets.on('connection', function(socket) {
	console.log("Успешное соединение");
	// Добавление нового соединения в массив
	connections.push(socket);

	// Функция, которая срабатывает при отключении от сервера
	socket.on('disconnect', function(data) {
		// Удаления пользователя из массива
		connections.splice(connections.indexOf(socket), 1);
		console.log("Отключились");
	});

	// Функция получающая сообщение от какого-либо пользователя
	socket.on('send mess', function(data) {
		// Внутри функции мы передаем событие 'add mess',
		// которое будет вызвано у всех пользователей и у них добавиться новое сообщение 
		io.sockets.emit('add mess', {mess: data.mess, name: data.name, className: data.className});
	});

});