var view_toggle = true;

function DisplayHostModal(name, address) {
    $("#name-prompt").show();
}

$("#name-next").on('click', function() {
    $("#name-prompt").hide();
    $("#mode-prompt").show();
})

$("#mod-next").on('click', function() {
    $("#mode-prompt").hide();
    socket2.emit('setDisplayMarker');
    socket2.emit('getUsers');
});

$("#mod-back").on('click', function() {
    $("#mode-prompt").hide();

});

let dist = null;

$("#details-view").on('click', function() {
    if (view_toggle) {
        if (!dist) {
            dist = $("#details-view").height() - $(window).height() + document.getElementById("details-view").getBoundingClientRect().top;
        }
        $(this).animate({
            top: '-=' + dist + 'px',
        }), 500;
        // change text.
        $("#details-title").text("Time to leave: ");
        //change arrow.
        $(".fas").removeClass("fa-angle-up");
        $(".fas").addClass("fa-angle-down");

        view_toggle = !view_toggle;
    } else {
        $(this).animate({
            top: '+=' + dist + 'px',
        }), 500;
        $("#details-title").text("More Info ");
        $(".fas").removeClass("fa-angle-down");
        $(".fas").addClass("fa-angle-up");

        view_toggle = !view_toggle;
    }
});