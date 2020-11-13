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
var connections = [];
// Функция, которая сработает при подключении к странице
// Считается как новый пользователь
io.sockets.on('connection', async (socket) =>{
	console.log("Успешное соединение");
	// Добавление нового соединения в массив
	connections.push(socket.id);
	// Функция, которая срабатывает при отключении от сервера
	socket.on('disconnect', function (data) {
		// Удаления пользователя из массива
		connections.splice(connections.indexOf(socket), 1);
		console.log("Отключились");
	});
	//Создание комнаты
	socket.on("joinRoom", function (data) {
		socket.join(data.room);
		console.log("you in room N:"+data.room+"yr name: "+data.name);
		io.sockets.emit('add state',{name:data.name,room:data.room});
	});
	socket.on('send message', (data) => {
		console.log(data)
		// socket.to(data.room).emit('add mess', {mess:data.mess,
		// 							name:data.name,});
		io.to(data.room).emit('add mess', {mess:data.mess,
			name:data.name,})
	});
	// Функция получающая сообщение от какого-либо пользователя
	socket.on('send mess', function (data) {
		// Внутри функции мы передаем событие 'add mess',
		// которое будет вызвано у всех пользователей и у них добавиться новое сообщение 
		io.sockets.emit('add mess', {
			mess: data.mess,
			name: data.name,
		});
	});
	// console.log(connections);
});