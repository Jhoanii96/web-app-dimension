// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
// Write your JavaScript code.

$("input[id^='module_checkbox_']").on('change', function () {
    var id_check_module = $(this).attr('id');

    if (id_check_module == "module_checkbox_all") {
        var checked = this.checked
        $("input[id^='module_checkbox_']").attr("checked", checked);
        return;
    }

    if (this.checked == false) {
        $("#module_checkbox_all").attr("checked", this.checked);
    }

});




$('#btn_add_new_user').click(function () {

    var checkbox_module_count = $("input[id^='module_checkbox_']");
    var data_user = [];
    var data_module_permission = [];
    var obj = {};

    for (var i = 1; i <= checkbox_module_count.length; i++) {

        if ($("#module_checkbox_" +  i).attr("checked")) {
            data_module_permission.push(encodeURIComponent($("#module_checkbox_" +  i).data("idval")));
        }
    }

    if (data_module_permission.length == 0) {
        return;
    }
    if ($("#inputUserFisrtName").val() == "") {
        return;
    }
    if ($("#inputUserLastName").val() == "") {
        return;
    }
    if ($("#inputUserEmail").val() == "") {
        return;
    }
    
    obj['user_firstname'] = $("#inputUserFisrtName").val();
    obj['user_lastname'] = $("#inputUserLastName").val();
    obj['user_email'] = $("#inputUserEmail").val();
    obj['user_showname'] = $("#inputUserShowName").attr("checked") ? 1 : 0;
    obj['user_module_permission'] = data_module_permission;

    data_user.push(obj);

    $.ajax({
        beforeSend: function () {

            $("#inputUserFisrtName").prop("disabled", true);
            $("#inputUserLastName").prop("disabled", true);
            $("#inputUserEmail").prop("disabled", true);
            $("#inputUserShowName").prop("disabled", true);

            $("#btn_add_new_user").prop("disabled", true);
            $("#btn_add_new_user").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

            //$("#area-data-table-" + id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'DataUser': data_user },
        url: "/User/SaveUser",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#inputUserFisrtName").prop("disabled", false);
            $("#inputUserLastName").prop("disabled", false);
            $("#inputUserEmail").prop("disabled", false);
            $("#inputUserShowName").prop("disabled", false);

            $("#btn_add_new_user").prop("disabled", false);
            $("#btn_add_new_user").html('Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            window.location.replace(location.protocol + '//' + location.host + '/User/UserList');

        }
    });

});


