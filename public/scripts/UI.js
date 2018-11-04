function displayModal(name, address) {
    console.log('a');
    $("#mode-prompt").show();
    $("#address-line").text(address);
}


$("#mod-next").on('click', function() {

})
$("#mod-back").on('click', function() {
        $("#mode-prompt").hide();

})