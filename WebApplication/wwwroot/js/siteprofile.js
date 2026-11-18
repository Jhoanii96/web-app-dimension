// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
// Write your JavaScript code.
$('#btn_update_profile').click(function () {

    let nameProfileAcc = $("#inputNameProfile").data("am");
    let lastNameProfileAcc = $("#inputLastNameProfile").data("am");
    let ifisaccmicrosoft = 0;

    if (nameProfileAcc == "True" || lastNameProfileAcc == "True") {
        ifisaccmicrosoft = 1;
    }

    let nameProfileValue = $("#inputNameProfile").val();
    let lastNameProfileValue = $("#inputLastNameProfile").val();

    let inputShowNameProfile = $("#inputShowNameProfile").attr("checked") ? 1 : 0;

    let imgpath = document.getElementById('photoInputFile'); /* foto */
    if (!imgpath.value == "") {
        var img = imgpath.files[0].size;
        var imgsize = img / 1024;
        if (imgsize > 1024) {
            toastr.error("Debe seleccionar una imagen menor de 1MB", "Atención!", { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            return;
        }
    }

    let inputPicProfile = $('#photoInputFile')[0].files[0];

    var formData = new FormData();
    formData.append("is_microsoft", ifisaccmicrosoft);
    formData.append("profile_name", nameProfileValue);
    formData.append("profile_lastname", lastNameProfileValue);
    formData.append("profile_pic", inputPicProfile);
    formData.append("profile_showname", inputShowNameProfile);

    $.ajax({
        beforeSend: function () {
            
            // deshabilitar botones
            $("#btn_update_profile").prop("disabled", true);
            // deshabilitar entradas
            if (ifisaccmicrosoft == 0) {
                $("#inputNameProfile").prop("disabled", true);
                $("#inputLastNameProfile").prop("disabled", true);
            }
            $("#inputShowNameProfile").prop("disabled", true);
            $("#photoInputFile").prop("disabled", true);

            $("#btn_update_profile").html('&emsp;&emsp;<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>&emsp;&emsp;');
        },
        data: formData,
        url: "/Profile/SaveChanges",
        type: "Post",
        contentType: false,
        processData: false,
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            // habilitar botones
            $("#btn_update_profile").prop("disabled", false);
            // habilitar entradas
            if (ifisaccmicrosoft == 0) {
                $("#inputNameProfile").prop("disabled", false);
                $("#inputLastNameProfile").prop("disabled", false);
            }
            $("#inputShowNameProfile").prop("disabled", false);
            $("#photoInputFile").prop("disabled", false);

            $("#btn_update_profile").html('Actualizar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                window.location.reload(true);
            }

            

        }
    });


});


