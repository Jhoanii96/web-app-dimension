// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
// Write your JavaScript code.

$("input[id^='module_edituser_checkbox_']").on('change', function () {
    var id_check_module = $(this).attr('id');

    if (id_check_module == "module_edituser_checkbox_all") {
        var checked = this.checked
        $("input[id^='module_edituser_checkbox_']").attr("checked", checked);
        return;
    }

    if (this.checked == false) {
        $("#module_edituser_checkbox_all").attr("checked", this.checked);
    }

});

$('#btn_edit_user').click(function () {

    var checkbox_module_count = $("input[id^='module_edituser_checkbox_']");
    var data_user = [];
    var data_module_permission = [];
    var data_num_module_permission = [];
    var obj = {};

    for (var i = 1; i <= checkbox_module_count.length; i++) {

        if ($("#module_edituser_checkbox_" +  i).attr("checked")) {
            data_module_permission.push(encodeURIComponent($("#module_edituser_checkbox_" +  i).data("idval")));
        }
        if ($("#module_edituser_checkbox_" + i).attr("checked")) {
            data_num_module_permission.push(encodeURIComponent($("#module_edituser_checkbox_" + i).data("idnumval")));
        }
    }

    if (data_module_permission.length == 0) {
        return;
    }
    if (window.b != "True") {
        if ($("#inputEditUserFirstName").val() == "") {
            return;
        }
        if ($("#inputEditUserLastName").val() == "") {
            return;
        }
        if ($("#inputEditUserEmail").val() == "") {
            return;
        }
    }

    obj['user_a'] = encodeURIComponent(window.a); 
    obj['user_b'] = window.b;
    obj['user_firstname'] = $("#inputEditUserFirstName").val();
    obj['user_lastname'] = $("#inputEditUserLastName").val();
    obj['user_email'] = $("#inputEditUserEmail").val();
    obj['user_showname'] = $("#inputEditUserShowName").attr("checked") ? 1 : 0;
    obj['user_userenabled'] = $("#inputEditUserEnabled").attr("checked") ? 1 : 0;
    obj['user_module_permission'] = data_module_permission;
    obj['user_num_module_permission'] = data_num_module_permission;

    data_user.push(obj);

    $.ajax({
        beforeSend: function () {

            $("#inputUserShowName").prop("disabled", true);
            if (window.b == "False") {
                $("#inputEditUserFirstName").prop("disabled", true);
                $("#inputEditUserLastName").prop("disabled", true);
                $("#inputEditUserEnabled").prop("disabled", true);
            }
            $("#inputEditUserReset").prop("disabled", true);
            $("#btn_edit_user").prop("disabled", true);
            $("#btn_edit_user").html('<i class="nav-link-icon pe-7s-diskette"> </i> Actualizando...');

            //$("#area-data-table-" + id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'DataUser': data_user },
        url: "/User/EditUser",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#inputUserShowName").prop("disabled", false);
            if (window.b == "False") {
                $("#inputEditUserFirstName").prop("disabled", false);
                $("#inputEditUserLastName").prop("disabled", false);
                $("#inputEditUserEnabled").prop("disabled", false);
            }
            $("#inputEditUserReset").prop("disabled", false);
            $("#btn_edit_user").prop("disabled", false);
            $("#btn_edit_user").html('Actualizar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            window.location.replace(location.protocol + '//' + location.host + '/User/UserList');

        }
    });

});




$('#inputEditUserReset').click(function () {

    var data_user = [];
    var obj = {};

    obj['user_a'] = window.a;
    obj['user_b'] = window.b;
    obj['user_email'] = $("#inputEditUserEmail").val();

    data_user.push(obj);

    $.ajax({
        beforeSend: function () {

            $("#inputEditUserReset").prop("disabled", true);
            $("#inputEditUserReset").html('<i class="nav-link-icon pe-7s-diskette"> </i> Reseteando...');

        },
        data: { 'DataUser': data_user },
        url: "/User/ResetUser",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#inputEditUserReset").prop("disabled", false);
            $("#inputEditUserReset").html('Resetear');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

        }
    });

});

