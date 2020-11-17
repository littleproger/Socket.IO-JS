// Подключение всех модулей к программе
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var count = 0;

// Отслеживание порта
server.listen(3001);
console.log("Server started on port 3001");

app.use(express.static(__dirname + '/public'));
// Отслеживание url адреса и отображение нужной HTML страницы
app.get('/', function (request, respons) {
	respons.sendFile(__dirname + '/index.html');
});

// Массив со всеми подключениями
var users=[];
var usersIds={};
// Функция, которая сработает при подключении к странице
// Считается как новый пользователь
io.sockets.on('connection', async (socket) =>{
	console.log("Успешное соединение");
	users.push(socket.id);
	// Функция, которая срабатывает при отключении от сервера
	socket.on('disconnect', function (data) {
		// Удаления пользователя из массива
		users.splice(users.indexOf(socket), 1);
		console.log("Отключились");

	});
	//Создание комнаты
	socket.on("start", function (data) {
		socket.join(socket.id);
		io.to(socket.id).emit('add state id',{id:socket.id});
		io.sockets.emit('add new user',{name:data.name, id:socket.id});
	});
	socket.on('join to room',function(data){
		socket.join(data.id);
	});
	socket.on('send message', (data) => {
		console.log(data.room);
		io.to(data.room).emit('add mess', {mess:data.mess,
			name:data.name, id:socket.id});
	});
	// console.log(connections);
});