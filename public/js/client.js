// }
// Функция для работы с данными на сайте
$(function () {
    // Включаем socket.io и отслеживаем все подключения
    var socket = io.connect();
    // Делаем переменные на:
    var $formMsg = $("#messForm"); // Форму сообщений
    var $formRoom = $("#roomForm"); //Форму комнаты
    var $name = $("#name"); // Поле с именем
    var $textarea = $("#message"); // Текстовое поле
    var $all_messages = $("#all_mess"); // Блок с сообщениями
    var $users = $("#users");
    var $clkUser = $(".clkUser");
    var alertClass;
    var id, room;
    var usersId=[];
    $formRoom.submit(function (event) {
        // Предотвращаем классическое поведение формы
        event.preventDefault();
        socket.emit('start', {
            name: $name.val()
        });
        $(this).parents('.popup-fade').fadeOut();
    });
    socket.on('add state id', function (data) {
        id = data.id;
    });
    socket.on('add new user', function (data) {
        usersId.push(data.id);
        $users.append("<li class='clkUser' id='(\"" + data.id + "\")' ><h2>" + data.name + "</h2></li>");
    });
    $(document).on('click', '.clkUser', function () {
        room = $(this).attr("id");
        room = room.substring(2, room.length - 2);
        socket.emit('join to room', {
            id: room
        });
    });

    // Отслеживаем нажатие на кнопку в форме сообщений
    $formMsg.submit(function (event) {
        // Предотвращаем классическое поведение формы
        event.preventDefault();
        // В сокет отсылаем новое событие 'send mess',
        // в событие передаем различные параметры и данные
        socket.emit('send message', {
            mess: $textarea.val(),
            name: $name.val(),
            room: room
        });
        // Очищаем поле с сообщением
        $textarea.val('');
    });
    // Здесь отслеживаем событие 'add mess', 
    // которое должно приходить из сокета в случае добавления нового сообщения
    socket.on('add mess', function (data) {
        if (id == data.id) {
            alertClass = 'msgClass2';
            // Встраиваем полученное сообщение в блок с сообщениями
            $all_messages.append("<div class='" + alertClass + "'><div><b>" + data.name + "</b><p>" + data.mess + "</p></div></div>");
        } else {
            if(usersId.includes(data.id)){
                null;
            }else{
                usersId.push(data.id);
                $users.append("<li class='clkUser' id='(\"" + data.id + "\")' ><h2>" + data.name + "</h2></li>"); 
            }
            alertClass = 'msgClass1';
            // Встраиваем полученное сообщение в блок с сообщениями
            $all_messages.append("<div class='" + alertClass + "'><div><b>" + data.name + "</b><p>" + data.mess + "</p></div></div>");
        }
    });
});
$(document).ready(function ($) {
    // Клик по ссылке "Закрыть".
    $('.popup-close').click(function () {
        $(this).parents('.popup-fade').fadeOut();
        return false;
    });
    // Закрытие по клавише Esc.
    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            $('.popup-fade').fadeOut();
        }
    });

    // Клик по фону, но не по окну.
    $('.popup-fade').click(function (e) {
        if ($(e.target).closest('.popup').length == 0) {
            $(this).fadeOut();
        }
    });
    $(window).scroll(function () {
        if ($(document).scrollTop()) {
            $(".main-navigation").css("background-color", "rgba(255, 255, 255, 0.7)");
            $(".main-navigation").css("box-shadow", "0px 0px 10px 20px rgba(255, 255, 255, 0.7)");
            $(".text-nav").css('color', 'black');
        } else {
            $(".main-navigation").css("background-color", "rgba(255, 255, 255, 0.5)");
            $(".main-navigation").css("box-shadow", "0px 0px 10px 20px rgba(255, 255, 255, 0.5)");
        }
    });
});