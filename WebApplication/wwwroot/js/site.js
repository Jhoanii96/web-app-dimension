$(function (ready) {

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#mypic')
                    .attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#photoInputFile").change(function () {
        readURL(this);
    });

    $('#photoInputFile').on("change", function () {
        document.getElementById("uploadFile").value = this.files[0].name;
    });

});

