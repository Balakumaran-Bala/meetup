function DisplayModal(name, address) {
    $("#mode-prompt").show();
}
$("#mod-next").on('click', function() {
    $("#mode-prompt").hide();
    socket2.emit('setDisplayMarker');
    socket2.emit('getUsers');
});

$("#mod-back").on('click', function() {
    $("#mode-prompt").hide();

});