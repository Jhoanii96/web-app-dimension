// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
// Write your JavaScript code.
$('#userlist_add_new_row').click(function () {

    // redireccionar a formulario de nuevo usuario
    window.location.replace(location.protocol + '//' + location.host + '/User/AddUser');

});

function edit_userlist_row(id_row) {

    // redireccionar a formulario editar usuario
    var id_user = encodeURIComponent($("#row_userlist_" + id_row + "_id").data("value"));
    window.location.replace(location.protocol + '//' + location.host + '/User/Edit?id=' + id_user);
}

function delete_userlist_row(email_user, id_row) {

    let userlist_id = encodeURIComponent($("#row_userlist_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + email_user + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');
    
        $.ajax({
            beforeSend: function () {
                // deshabilitar botones
                $("#userlist_add_new_row").prop("disabled", true);
                $("#row_userlist_btn_" + id_row + "_edr").prop("disabled", true);
                $("#row_userlist_btn_" + id_row + "_der").prop("disabled", true);

                $("#row_userlist_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/User/DeleteUser?user_id=" + userlist_id + "&user_email=" + email_user, 
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#userlist_add_new_row").prop("disabled", false);
                $("#row_userlist_btn_" + id_row + "_edr").prop("disabled", false);
                $("#row_userlist_btn_" + id_row + "_der").prop("disabled", false);

                $("#row_userlist_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                window.location.replace(location.protocol + '//' + location.host + '/User/UserList');

            }
        });

    };

    btnNames[window.no_btn] = function () { $(this).dialog('close'); };

    // Define the Dialog and its procategoryties.
    $("#dialog-delete-confirm").dialog({
        resizable: false,
        modal: true,
        title: window.delete_header_message,
        height: 250,
        width: 400,
        buttons: btnNames
    });

}








