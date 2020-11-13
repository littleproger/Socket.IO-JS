// window.onload = function(){
//     window.dispatchEvent(new Event("scroll"));
// }
// Функция для работы с данными на сайте
$(function() {
    // Включаем socket.io и отслеживаем все подключения
    var socket = io.connect();
    // Делаем переменные на:
    var formMsg = $("#messForm"); // Форму сообщений
    var formRoom = $("#roomForm");//Форму комнаты
    var name = $("#name"); // Поле с именем
    var textarea = $("#message"); // Текстовое поле
    var room = $("#room");
    var all_messages = $("#all_mess"); // Блок с сообщениями
    var count=0;
    var alertClass;
    formRoom.submit(function(event) {
        console.log(room.val()+":"+name.val());
        // Предотвращаем классическое поведение формы
        event.preventDefault();
        socket.emit('joinRoom', {room:room.val(),name:name.val()});
    });
    // Отслеживаем нажатие на кнопку в форме сообщений
    formMsg.submit(function(event) {
        // Предотвращаем классическое поведение формы
        event.preventDefault();
        // В сокет отсылаем новое событие 'send mess',
        // в событие передаем различные параметры и данные
        socket.emit('send message', {mess: textarea.val(), name: name.val(), room:room.val()});
        // Очищаем поле с сообщением
        textarea.val('');
    });
    socket.on('add state',function(data){
        nickname=data.name;
        roomName=data.room;
    })
    // Здесь отслеживаем событие 'add mess', 
    // которое должно приходить из сокета в случае добавления нового сообщения
    socket.on('add mess', function(data) {
        if (count == 0) {
            count += 1;
            alertClass = 'msgClass1';
        } else if (count == 1) {
            count -= 1;
            alertClass = 'msgClass2';
        }
        // Встраиваем полученное сообщение в блок с сообщениями
        // У блока с сообщением будет тот класс, который соответвует пользователю что его отправил
        all_messages.append("<div class='" + alertClass + "'><b>" + data.name + "</b>: " + data.mess + "</div>");
    });

});
$(document).ready(function($) {
    // Клик по ссылке "Закрыть".
    $('.popup-close').click(function() {
        $(this).parents('.popup-fade').fadeOut();
        return false;
    }); 
    // $('.btn-submit-room').click(function() {
    //     $(this).parents('.popup-fade').fadeOut();
    //     return false;
    // });    


    // Закрытие по клавише Esc.
    $(document).keydown(function(e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            $('.popup-fade').fadeOut();
        }
    });

    // Клик по фону, но не по окну.
    $('.popup-fade').click(function(e) {
        if ($(e.target).closest('.popup').length == 0) {
            $(this).fadeOut();					
        }
    });	
    $(window).scroll(function() { 
        if ($(document).scrollTop()) {
            $(".main-navigation").css("background-color", "rgba(255, 255, 255, 0.7)");
            $(".main-navigation").css("box-shadow", "0px 0px 10px 20px rgba(255, 255, 255, 0.7)");
            $(".text-nav").css('color','black');
        } else {
            $(".main-navigation").css("background-color", "rgba(255, 255, 255, 0.5)");
            $(".main-navigation").css("box-shadow", "0px 0px 10px 20px rgba(255, 255, 255, 0.5)");
        }
    });
});