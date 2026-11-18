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



// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_category_new = 0;
// Write your JavaScript code.
$('#category_add_new_row').click(function () {

    let element = document.getElementById("category_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_category_new += 1;

    var row = '<tr id="new_row_' + count_category_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_category_new_id", "row_category_new_id_" + count_category_new);
    row = row.replace("row_category_new_name", "row_category_new_name_" + count_category_new);
    row = row.replace("row_category_new_funcarea", "row_category_new_funcarea_" + count_category_new);
    row = row.replace("row_category_new_process", "row_category_new_process_" + count_category_new);
    row = row.replace("row_category_new_subprocess", "row_category_new_subprocess_" + count_category_new);
    $("#category_rows_list tr:first").before(row);

});

$('#category_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_category_new = 0;
    return false;
});

$('#category_save_new_rows').click(function () {

    if (count_category_new == 0) {
        return;
    }

    $("#category_add_new_row").prop("disabled", true);
    $("#category_save_new_rows").prop("disabled", true);
    $("#category_cancel_new_rows").prop("disabled", true);
    $("#category_refresh_rows").prop("disabled", true);
    $("#category_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var category_new_count = $("th[id^='row_category_new_id_']");
    var datas_category = [];

    for (var i = 1; i <= category_new_count.length; i++) {

        var obj = {};

        obj['category_name'] = $("#row_category_new_name_" + i).val();
        obj['category_funcarea'] = $("#row_category_new_funcarea_" + i).val();
        obj['category_process'] = $("#row_category_new_process_" + i).val();
        obj['category_subprocess'] = $("#row_category_new_subprocess_" + i).val();

        datas_category.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factcategory_compatibility").attr('disabled', 'disabled');
            $('#category_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewCategory': datas_category },
        url: "/Category/SetNewCategorys",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#category_add_new_row").prop("disabled", false);
            $("#category_save_new_rows").prop("disabled", false);
            $("#category_cancel_new_rows").prop("disabled", false);
            $("#category_refresh_rows").prop("disabled", false);
            $("#category_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_category_new = 0;
            refresh_category_table();

        }
    });

});


function edit_category_row(id_row) {
    $("#row_category_" + id_row + "_name").prop("disabled", false);
    $("#row_category_" + id_row + "_funcarea").prop("disabled", false);
    $("#row_category_" + id_row + "_process").prop("disabled", false);
    $("#row_category_" + id_row + "_subprocess").prop("disabled", false);

    $("#row_category_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_category_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_category_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_category_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_category_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_category_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_category_row(id_row) {

    $("#row_category_" + id_row + "_name").prop("disabled", true);
    $("#row_category_" + id_row + "_funcarea").prop("disabled", true);
    $("#row_category_" + id_row + "_process").prop("disabled", true);
    $("#row_category_" + id_row + "_subprocess").prop("disabled", true);

    $("#row_category_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_category_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_category_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_category_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_category_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_category_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_category_row(id_row) {

    let rcr_actived = $("#row_category_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_category = [];
    var obj = {};

    obj['category_id'] = encodeURIComponent($("#row_category_" + id_row + "_id").data("value"));
    obj['category_name'] = $("#row_category_" + id_row + "_name").val();
    obj['category_funcarea'] = $("#row_category_" + id_row + "_funcarea").val();
    obj['category_process'] = $("#row_category_" + id_row + "_process").val();
    obj['category_subprocess'] = $("#row_category_" + id_row + "_subprocess").val();

    data_edit_category.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factcategory_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#category_add_new_row").prop("disabled", true);
            $("#category_save_new_rows").prop("disabled", true);
            $("#category_cancel_new_rows").prop("disabled", true);
            $("#category_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_category_" + id_row + "_name").prop("disabled", true);
            $("#row_category_" + id_row + "_funcarea").prop("disabled", true);
            $("#row_category_" + id_row + "_process").prop("disabled", true);
            $("#row_category_" + id_row + "_subprocess").prop("disabled", true);

            $("#row_category_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeCategory': data_edit_category },
        url: "/Category/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#category_add_new_row").prop("disabled", false);
            $("#category_save_new_rows").prop("disabled", false);
            $("#category_cancel_new_rows").prop("disabled", false);
            $("#category_refresh_rows").prop("disabled", false);

            $("#row_category_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_category_row(id_row);
            //refresh_category_table();

        }
    });

}

function delete_category_row(delete_body_message_var, id_row) {

    let category_id = encodeURIComponent($("#row_category_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factcategory_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#category_add_new_row").prop("disabled", true);
                $("#category_save_new_rows").prop("disabled", true);
                $("#category_cancel_new_rows").prop("disabled", true);
                $("#category_refresh_rows").prop("disabled", true);

                $("#row_category_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/Category/DeleteCategory?category_id=" + category_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#category_add_new_row").prop("disabled", false);
                $("#category_save_new_rows").prop("disabled", false);
                $("#category_cancel_new_rows").prop("disabled", false);
                $("#category_refresh_rows").prop("disabled", false);

                $("#row_category_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_category_row(id_row);
                refresh_category_table();

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

function refresh_category_table() {

    $.ajax({
        beforeSend: function () {
            //$("#factcategory_compatibility").attr('disabled', 'disabled');

            $("#category_add_new_row").prop("disabled", true);
            $("#category_save_new_rows").prop("disabled", true);
            $("#category_cancel_new_rows").prop("disabled", true);
            $("#category_refresh_rows").prop("disabled", true);
            $("#category_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#category_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/Category/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#category_add_new_row").prop("disabled", false);
            $("#category_save_new_rows").prop("disabled", false);
            $("#category_cancel_new_rows").prop("disabled", false);
            $("#category_refresh_rows").prop("disabled", false);
            $("#category_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#category_rows_list').html("");
            $('#category_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_category_' + (indexi + 1) + '_id" data-value="' + valueA["IdCategory"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;"><input id="row_category_' + (indexi + 1) + '_name" type="text" class="form-control" value="' + valueA["CategoryName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_category_' + (indexi + 1) + '_funcarea" type="text" class="form-control" value="' + valueA["FunctionalArea"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_category_' + (indexi + 1) + '_process" type="text" class="form-control" value="' + valueA["Process"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_category_' + (indexi + 1) + '_subprocess" type="text" class="form-control" value="' + valueA["SubProcess"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_category_btn_' + (indexi + 1) + '_edr" onClick="edit_category_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_category_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_category_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_category_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_category_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_category_btn_' + (indexi + 1) + '_der" onClick="delete_category_row(\'' + valueA["CategoryName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 

            });

            // Row hidden

            columns += '<tr id="category_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_category_new_id">-</th>';
            columns += '<td style="padding: 2px;"><input id="row_category_new_name" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_category_new_funcarea" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_category_new_process" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_category_new_subprocess" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#category_rows_list").append(columns);
            count_category_new = 0;

            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}







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


// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_eq_new = 0;
// Write your JavaScript code.
$('#eq_add_new_row').click(function () {

    let element = document.getElementById("eq_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_eq_new += 1;

    var row = '<tr id="new_row_' + count_eq_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_eq_new_id", "row_eq_new_id_" +  count_eq_new);
    row = row.replace("row_eq_new_model", "row_eq_new_model_" +  count_eq_new);
    row = row.replace("row_eq_new_name", "row_eq_new_name_" +  count_eq_new);
    row = row.replace("row_eq_new_fleet", "row_eq_new_fleet_" +  count_eq_new);
    row = row.replace("row_eq_new_fleettype", "row_eq_new_fleettype_" +  count_eq_new);
    $("#eq_rows_list tr:first").before(row);

});

$('#eq_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_eq_new = 0;
    return false;
});

$('#eq_save_new_rows').click(function () {

    if (count_eq_new == 0) {
        return;
    }

    $("#eq_filter_model").prop("disabled", true);

    $("#eq_add_new_row").prop("disabled", true);
    $("#eq_save_new_rows").prop("disabled", true);
    $("#eq_cancel_new_rows").prop("disabled", true);
    $("#eq_refresh_rows").prop("disabled", true);
    $("#eq_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var eq_new_count = $("th[id^='row_eq_new_id_']");
    var datas_eq = [];

    for (var i = 1; i <= eq_new_count.length; i++) {

        var obj = {};

        obj['eq_model'] = encodeURIComponent($("#row_eq_new_model_" +  i).val());
        obj['eq_name'] = $("#row_eq_new_name_" +  i).val();
        obj['eq_fleet'] = $("#row_eq_new_fleet_" +  i).val();
        obj['eq_fleettype'] = $("#row_eq_new_fleettype_" +  i).val();

        datas_eq.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#facteq_compatibility").attr('disabled', 'disabled');
            $('#eq_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-" + id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewEquipment': datas_eq },
        url: "/Equipment/SetNewEquipments",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#eq_filter_model").prop("disabled", false);

            $("#eq_add_new_row").prop("disabled", false);
            $("#eq_save_new_rows").prop("disabled", false);
            $("#eq_cancel_new_rows").prop("disabled", false);
            $("#eq_refresh_rows").prop("disabled", false);
            $("#eq_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_eq_new = 0;
            refresh_eq_table();

        }
    });

});


function edit_eq_row(id_row) {
    $("#row_eq_" +  id_row + "_model").prop("disabled", false);
    $("#row_eq_" +  id_row + "_model").css({ "background-color": "#fff" });
    $("#row_eq_" +  id_row + "_name").prop("disabled", false);
    $("#row_eq_" +  id_row + "_fleet").prop("disabled", false);
    $("#row_eq_" +  id_row + "_fleettype").prop("disabled", false);

    $("#row_eq_btn_" +  id_row + "_edr").css({ "display": "none" });
    $("#row_eq_btn_" +  id_row + "_der").css({ "display": "none" });
    $("#row_eq_btn_" +  id_row + "_rcr").css({ "display": "block" });
    $("#row_eq_btn_" +  id_row + "_ccr").css({ "display": "block" });

    $("#row_eq_btn_" +  id_row + "_rcr").data("actived", 1);
    $("#row_eq_btn_" +  id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_eq_row(id_row) {

    $("#row_eq_" +  id_row + "_model").prop("disabled", true);
    $("#row_eq_" +  id_row + "_model").css({ "background-color": "#e9ecef" });
    $("#row_eq_" +  id_row + "_name").prop("disabled", true);
    $("#row_eq_" +  id_row + "_fleet").prop("disabled", true);
    $("#row_eq_" +  id_row + "_fleettype").prop("disabled", true);

    $("#row_eq_btn_" +  id_row + "_rcr").css({ "display": "none" });
    $("#row_eq_btn_" +  id_row + "_ccr").css({ "display": "none" });
    $("#row_eq_btn_" +  id_row + "_edr").css({ "display": "block" });
    $("#row_eq_btn_" +  id_row + "_der").css({ "display": "block" });

    $("#row_eq_btn_" +  id_row + "_rcr").data("actived", 0);
    $("#row_eq_btn_" +  id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_eq_row(id_row) {

    let rcr_actived = $("#row_eq_btn_" +  id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_eq = [];
    var obj = {};

    obj['eq_id'] = encodeURIComponent($("#row_eq_" +  id_row + "_id").data("value"));
    obj['eq_model'] = encodeURIComponent($("#row_eq_" +  id_row + "_model").val());
    obj['eq_name'] = $("#row_eq_" +  id_row + "_name").val();
    obj['eq_fleet'] = $("#row_eq_" +  id_row + "_fleet").val();
    obj['eq_fleettype'] = $("#row_eq_" +  id_row + "_fleettype").val();

    data_edit_eq.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#facteq_compatibility").attr('disabled', 'disabled');

            // deshabilitar controles
            $("#eq_filter_model").prop("disabled", true);
            // deshabilitar botones
            $("#eq_add_new_row").prop("disabled", true);
            $("#eq_save_new_rows").prop("disabled", true);
            $("#eq_cancel_new_rows").prop("disabled", true);
            $("#eq_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_eq_" +  id_row + "_model").prop("disabled", true);
            $("#row_eq_" +  id_row + "_model").css({ "background-color": "#e9ecef" });
            $("#row_eq_" +  id_row + "_name").prop("disabled", true);
            $("#row_eq_" +  id_row + "_fleet").prop("disabled", true);
            $("#row_eq_" +  id_row + "_fleettype").prop("disabled", true);

            $("#row_eq_btn_" +  id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeEquipment': data_edit_eq },
        url: "/Equipment/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#eq_filter_model").prop("disabled", false);

            $("#eq_add_new_row").prop("disabled", false);
            $("#eq_save_new_rows").prop("disabled", false);
            $("#eq_cancel_new_rows").prop("disabled", false);
            $("#eq_refresh_rows").prop("disabled", false);

            $("#row_eq_btn_" +  id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_eq_row(id_row);
            //refresh_eq_table();

        }
    });

}

function delete_eq_row(delete_body_message_var, id_row) {

    let eq_id = encodeURIComponent($("#row_eq_" +  id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#facteq_compatibility").attr('disabled', 'disabled');

                // deshabilitar controles
                $("#eq_filter_model").prop("disabled", true);
                // deshabilitar botones
                $("#eq_add_new_row").prop("disabled", true);
                $("#eq_save_new_rows").prop("disabled", true);
                $("#eq_cancel_new_rows").prop("disabled", true);
                $("#eq_refresh_rows").prop("disabled", true);

                $("#row_eq_btn_" +  id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/Equipment/DeleteEquipment?eq_id=" + eq_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#eq_filter_model").prop("disabled", false);

                $("#eq_add_new_row").prop("disabled", false);
                $("#eq_save_new_rows").prop("disabled", false);
                $("#eq_cancel_new_rows").prop("disabled", false);
                $("#eq_refresh_rows").prop("disabled", false);

                $("#row_eq_btn_" +  id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_eq_row(id_row);
                refresh_eq_table();

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

$('#eq_filter_model').on('change', function () {
    refresh_eq_table();
});
$('#eq_filter_cat').on('change', function () {
    refresh_eq_table();
});

function refresh_eq_table() {

    let filter_model = encodeURIComponent($("#eq_filter_model").val());
    //let filter_cat = $("#eq_filter_cat").val();

    $.ajax({
        beforeSend: function () {
            //$("#facteq_compatibility").attr('disabled', 'disabled');

            $("#eq_filter_model").prop("disabled", true);

            $("#eq_add_new_row").prop("disabled", true);
            $("#eq_save_new_rows").prop("disabled", true);
            $("#eq_cancel_new_rows").prop("disabled", true);
            $("#eq_refresh_rows").prop("disabled", true);
            $("#eq_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#eq_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/Equipment/RefreshTable?filter_model=" + filter_model,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#eq_filter_model").prop("disabled", false);

            $("#eq_add_new_row").prop("disabled", false);
            $("#eq_save_new_rows").prop("disabled", false);
            $("#eq_cancel_new_rows").prop("disabled", false);
            $("#eq_refresh_rows").prop("disabled", false);
            $("#eq_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#eq_rows_list').html("");
            $('#eq_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';

                
                columns += '<th scope="row" id="row_eq_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;">';
                columns += '<select type="select" id="row_eq_' + (indexi + 1) + '_model" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';

                $.each(myList.CollectionB, function (indexj, valueB) {

                    if (valueA["IdModel"] == valueB["Id"])
                    {
                        columns += '<option value="' + valueB["Id"] + '" selected="selected">' + valueB["ModelName"] + '</option>';
                    }
                    else
                    {
                        columns += '<option value="' + valueB["Id"] + '">' + valueB["ModelName"] + '</option>';
                    }

                });
                
                columns += '</select>';
                columns += '</td>';
                columns += '<td style="padding: 2px;"><input id="row_eq_' + (indexi + 1) + '_name" type="text" class="form-control" value="' + valueA["EquipmentName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_eq_' + (indexi + 1) + '_fleet" type="text" class="form-control" value="' + valueA["Fleet"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_eq_' + (indexi + 1) + '_fleettype" type="text" class="form-control" value="' + valueA["FleetType"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_eq_btn_' + (indexi + 1) + '_edr" onClick="edit_eq_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_eq_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_eq_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_eq_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_eq_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_eq_btn_' + (indexi + 1) + '_der" onClick="delete_eq_row(\'' + valueA["EquipmentName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 


            });

            // Row hidden

            columns += '<tr id="eq_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_eq_new_id">-</th>';
            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_eq_new_model" class="custom-select">';

            $.each(myList.CollectionB, function (indexj, valueB) {

                columns += '<option value="' + valueB["Id"] + '">' + valueB["ModelName"] + '</option>';
                
            });

            columns += '</select>';
            columns += '</td>';
            columns += '<td style="padding: 2px;"><input id="row_eq_new_name" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_eq_new_fleet" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_eq_new_fleettype" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#eq_rows_list").append(columns);
            count_eq_new = 0;
            
            /*
            $("#btn_general_table_data_" +  id).prop("disabled", false);
            $("#btn_general_table_data_" +  id).html("Press to test");
            */

        }
    });

}


$('#eq_list_add_edit_model').click(function () {

    refresh_model_list("model");

});

function refresh_model_list(tipo) {
    
    $.ajax({
        beforeSend: function () {
            //$("#facteq_compatibility").attr('disabled', 'disabled');
            if (tipo == "model") {
                $("#data_loading_model").css({ "display": "block", "margin": "auto" });
                $("#data_list_model").css({ "display": "none" });
            } else {
                $("#data_loading_model").css({ "display": "block", "margin": "auto" });
                $("#data_list_model").css({ "display": "none" });
            }
            

        },
        url: "/Equipment/RefreshList?type=" + tipo,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);
            let rowsA = '';
            let rowsB = '';

            if (tipo == "model") {
                $('#eq_list_add_model').html("");
                $('#eq_list_edit_model').html("");
                $("#eq_filter_model").find('option').remove();
                $('#eq_filter_model').append($('<option>', { value: 'All', text: 'Todos' }));
                
                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + (indexi + 1) + '. ' + valueA["ModelName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_model_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_model_' + (indexi + 1) + '_name" type="text" class="form-control custom-input" value="' + valueA["ModelName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_eq_btn_model_' + (indexi + 1) + '_edr" onClick="edit_model_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_eq_btn_model_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_model_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_eq_btn_model_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_model_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_eq_btn_model_' + (indexi + 1) + '_der" onClick="delete_model_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>'; 

                    $('#eq_filter_model').append($('<option>', { value: valueA["Id"], text: valueA["ModelName"] }));

                });

                $('#eq_list_add_model').append(rowsA);
                $('#eq_list_edit_model').append(rowsB);

                $("#data_loading_model").css({ "display": "none", "margin": "auto" });
                $("#data_list_model").css({ "display": "block" });

            } else {
                /*
                $('#eq_list_add_cat').html("");
                $('#eq_list_edit_cat').html("");
                $("#eq_filter_cat").find('option').remove();
                $('#eq_filter_cat').append($('<option>', { value: 'All', text: 'Todos' }));

                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + valueA["Id"] + '. ' + valueA["CategoryName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_cat_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + valueA["Id"] + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_cat_' + (indexi + 1) + '_name" type="text" class="form-control custom-input" value="' + valueA["CategoryName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_eq_btn_cat_' + (indexi + 1) + '_edr" onClick="editcatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_eq_btn_cat_' + (indexi + 1) + '_rcr" onClick="realizarcambioscatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_eq_btn_cat_' + (indexi + 1) + '_ccr" onClick="cancelarcambiocatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_eq_btn_cat_' + (indexi + 1) + '_der" onClick="deletecatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>';

                    $('#eq_filter_cat').append($('<option>', { value: valueA["Id"], text: valueA["CategoryName"] }));

                });

                $('#eq_list_add_cat').append(rowsA);
                $('#eq_list_edit_cat').append(rowsB);

                $("#data_loading_cat").css({ "display": "none", "margin": "auto" });
                $("#data_list_cat").css({ "display": "block" });
                
                */

            }

        }
    });
    

}


function btn_eq_model_add_new() {

    $("#btn_eq_model_add_new").prop("disabled", true);
    $("#eq_model_es_add_new").prop("readonly", true);
    //$("#eq_model_en_add_new").prop("readonly", true);

    let model_es_name = $("#eq_model_es_add_new").val();
    let model_en_name = "";
    
    $.ajax({
        beforeSend: function () {
            
            $("#btn_eq_model_add_new").html("Añadiendo...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        url: "/Equipment/SaveNewItem?name_es=" + model_es_name + "&name_en=" + model_en_name + "&type=model",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#btn_eq_model_add_new").html("Añadir");
            $("#btn_eq_model_add_new").prop("disabled", false);
            $("#eq_model_es_add_new").prop("readonly", false);
            //$("#eq_model_en_add_new").prop("readonly", false);

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            $("#eq_model_es_add_new").val("");
            //$("#eq_model_en_add_new").val("");
            refresh_model_list("model");

        }
    });

}

// modals edit and cancel

function edit_model_row(id_row) {
    $("#row_model_" +  id_row + "_name").prop("disabled", false);

    $("#row_eq_btn_model_" +  id_row + "_edr").css({ "display": "none" });
    $("#row_eq_btn_model_" +  id_row + "_der").css({ "display": "none" });
    $("#row_eq_btn_model_" +  id_row + "_rcr").css({ "display": "block" });
    $("#row_eq_btn_model_" +  id_row + "_ccr").css({ "display": "block" });

    $("#row_eq_btn_model_" +  id_row + "_rcr").data("actived", 1);
    $("#row_eq_btn_model_" +  id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_model_row(id_row) {
    $("#row_model_" +  id_row + "_name").prop("disabled", true);

    $("#row_eq_btn_model_" +  id_row + "_rcr").css({ "display": "none" });
    $("#row_eq_btn_model_" +  id_row + "_ccr").css({ "display": "none" });
    $("#row_eq_btn_model_" +  id_row + "_edr").css({ "display": "block" });
    $("#row_eq_btn_model_" +  id_row + "_der").css({ "display": "block" });

    $("#row_eq_btn_model_" +  id_row + "_rcr").data("actived", 0);
    $("#row_eq_btn_model_" +  id_row + "_ccr").data("actived", 0);

    
}

function realizar_cambios_model_row(id_row) {

    let rcr_actived = $("#row_eq_btn_model_" +  id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_model = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_model_" +  id_row + "_id").data("value"));
    obj['Name'] = $("#row_model_" +  id_row + "_name").val();
    obj['Type'] = "model";

    data_model.push(obj);

    $.ajax({
        beforeSend: function () {

            // deshabilitar entradas
            $("#row_model_" +  id_row + "_name").prop("disabled", true);

            $("#row_eq_btn_model_" +  id_row + "_edr").prop("disabled", false);
            $("#row_eq_btn_model_" +  id_row + "_rcr").prop("disabled", false);
            $("#row_eq_btn_model_" +  id_row + "_ccr").prop("disabled", false);
            $("#row_eq_btn_model_" +  id_row + "_der").prop("disabled", false);
            
            $("#row_eq_btn_model_" +  id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_model },
        url: "/Equipment/SaveChangesModel",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_eq_btn_model_" +  id_row + "_edr").prop("disabled", true);
            $("#row_eq_btn_model_" +  id_row + "_rcr").prop("disabled", true);
            $("#row_eq_btn_model_" +  id_row + "_ccr").prop("disabled", true);
            $("#row_eq_btn_model_" +  id_row + "_der").prop("disabled", true);
            $("#row_eq_btn_model_" +  id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_model_row(id_row);
            refresh_model_list("model");

        }
    });

}

function delete_model_row(id_row) {

    let rcr_actived = $("#row_eq_btn_model_" +  id_row + "_der").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    let id = encodeURIComponent($("#row_model_" +  id_row + "_id").data("value"));

    $.ajax({
        beforeSend: function () {
            //$("#facteq_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#row_eq_btn_model_" +  id_row + "_edr").prop("disabled", false);
            $("#row_eq_btn_model_" +  id_row + "_rcr").prop("disabled", false);
            $("#row_eq_btn_model_" +  id_row + "_ccr").prop("disabled", false);
            $("#row_eq_btn_model_" +  id_row + "_der").prop("disabled", false);
            $("#row_eq_btn_model_" +  id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
        },
        url: "/Equipment/DeleteModal?id=" + id + "&type=model",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_eq_btn_model_" +  id_row + "_edr").prop("disabled", true);
            $("#row_eq_btn_model_" +  id_row + "_rcr").prop("disabled", true);
            $("#row_eq_btn_model_" +  id_row + "_ccr").prop("disabled", true);
            $("#row_eq_btn_model_" +  id_row + "_der").prop("disabled", true);
            $("#row_eq_btn_model_" +  id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_model_row(id_row);
            refresh_model_list("model");

        }
    });

}







// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_kpi_new = 0;
var row_kpi_cat = [];
var row_kpi_agr = [];
var row_kpi_weig = [];
var row_kpi_msr = [];
var row_kpi_msr = [];
var row_kpi_dec = [];
// Write your JavaScript code.
$('#kpi_add_new_row').click(function () {

    let element = document.getElementById("kpi_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_kpi_new += 1;

    var row = '<tr id="new_row_' + count_kpi_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_kpi_new_id", "row_kpi_new_id_" + count_kpi_new);
    row = row.replace("row_kpi_new_msr", "row_kpi_new_msr_" + count_kpi_new);
    row = row.replace("row_kpi_new_cat", "row_kpi_new_cat_" + count_kpi_new);
    row = row.replace("row_kpi_new_agr", "row_kpi_new_agr_" + count_kpi_new);
    row = row.replace("row_kpi_new_weig", "row_kpi_new_weig_" + count_kpi_new);
    row = row.replace("row_kpi_new_dec", "row_kpi_new_dec_" + count_kpi_new);
    row = row.replace("row_kpi_btn_new_openselect", "row_kpi_btn_new_openselect_" + count_kpi_new);
    row = row.replace("open_select_kpi_new_row(num)", "open_select_kpi_new_row(" + count_kpi_new + ")");
    row = row.replace("kpi_new_select_section_print", "kpi_new_select_section_print_" + count_kpi_new);
    
    $("#kpi_rows_list tr:first").before(row);

});

$('#kpi_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_kpi_new = 0;
    return false;
});

$('#kpi_save_new_rows').click(function () {

    if (count_kpi_new == 0) {
        return;
    }

    $("#kpi_filter_msr").prop("disabled", true);
    $("#kpi_filter_cat").prop("disabled", true);

    $("#kpi_add_new_row").prop("disabled", true);
    $("#kpi_save_new_rows").prop("disabled", true);
    $("#kpi_cancel_new_rows").prop("disabled", true);
    $("#kpi_refresh_rows").prop("disabled", true);
    $("#kpi_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var kpi_new_count = $("th[id^='row_kpi_new_id_']");
    var datas_kpi = [];

    for (var i = 1; i <= kpi_new_count.length; i++) {

        var obj = {};

        let aggr = $("#row_kpi_new_weig_" + i).val() == "" ? 0 : parseInt($("#row_kpi_new_weig_" + i).val());
        if (aggr < 0) {
            return;
        }
        let dec = $("#row_kpi_new_dec_" + i).val() == "" ? 0 : parseInt($("#row_kpi_new_dec_" + i).val());
        if (dec < 0) {
            return;
        }

        obj['kpi_cat'] = encodeURIComponent($("#row_kpi_new_cat_" + i).val());
        obj['kpi_agr'] = $("#row_kpi_new_agr_" + i).val();
        obj['kpi_weig'] = $("#row_kpi_new_weig_" + i).val();
        obj['kpi_msr'] = encodeURIComponent($("#row_kpi_new_msr_" + i).val());
        obj['kpi_dec'] = $("#row_kpi_new_dec_" + i).val();

        datas_kpi.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factkpi_compatibility").attr('disabled', 'disabled');
            $('#kpi_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-" + id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewKPI': datas_kpi },
        url: "/KPI/SetNewKPIs",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#kpi_filter_msr").prop("disabled", false);
            $("#kpi_filter_cat").prop("disabled", false);

            $("#kpi_add_new_row").prop("disabled", false);
            $("#kpi_save_new_rows").prop("disabled", false);
            $("#kpi_cancel_new_rows").prop("disabled", false);
            $("#kpi_refresh_rows").prop("disabled", false);
            $("#kpi_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_kpi_new = 0;
            refresh_kpi_table();

        }
    });

});


function edit_kpi_row(id_row) {
    /*
    var rowCount = $('#kpi_rows_list tr:last').index() + 1;
    if (row_kpi_cat.length < 1) {
        // the array is defined and has at least one element
        row_kpi_cat[rowCount] = '';
    }
    */
    $("#row_kpi_" + id_row + "_cat").prop("disabled", false);
    $("#row_kpi_" + id_row + "_cat").css({ "background-color": "#fff" });
    $("#row_kpi_" + id_row + "_agr").prop("disabled", false);
    $("#row_kpi_" + id_row + "_agr").css({ "background-color": "#fff" });
    $("#row_kpi_" + id_row + "_weig").prop("disabled", false);
    $("#row_kpi_" + id_row + "_msr").prop("disabled", false);
    $("#row_kpi_" + id_row + "_msr").css({ "background-color": "#fff" });
    $("#row_kpi_" + id_row + "_dec").prop("disabled", false);
    $("#row_kpi_btn_" + id_row + "_openselect").prop("disabled", false);

    $("#row_kpi_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_kpi_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_kpi_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_kpi_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_kpi_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_kpi_btn_" + id_row + "_ccr").data("actived", 1);

    //row_kpi_cat.splice(id_row, 0, $("#row_kpi_" + id_row + "_cat").val());
    row_kpi_cat[id_row] = $("#row_kpi_" + id_row + "_cat option:selected").val();
    row_kpi_agr[id_row] = $("#row_kpi_" + id_row + "_agr option:selected").val();
    row_kpi_weig[id_row] = $("#row_kpi_" + id_row + "_weig").val();
    row_kpi_msr[id_row] = $("#row_kpi_" + id_row + "_msr option:selected").val();
    row_kpi_dec[id_row] = $("#row_kpi_" + id_row + "_dec").val();

}

function cancelar_cambios_kpi_row(id_row) {

    $("#row_kpi_" + id_row + "_cat").prop("disabled", true);
    $("#row_kpi_" + id_row + "_cat").css({ "background-color": "#e9ecef" });
    $("#row_kpi_" + id_row + "_agr").prop("disabled", true);
    $("#row_kpi_" + id_row + "_agr").css({ "background-color": "#e9ecef" });
    $("#row_kpi_" + id_row + "_weig").prop("disabled", true);
    $("#row_kpi_" + id_row + "_msr").prop("disabled", true);
    $("#row_kpi_" + id_row + "_msr").css({ "background-color": "#e9ecef" });
    $("#row_kpi_" + id_row + "_dec").prop("disabled", true);
    $("#row_kpi_btn_" + id_row + "_openselect").prop("disabled", true);

    $("#row_kpi_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_kpi_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_kpi_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_kpi_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_kpi_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_kpi_btn_" + id_row + "_ccr").data("actived", 0);

    if (typeof row_kpi_cat[id_row] !== 'undefined' || typeof row_kpi_agr[id_row] !== 'undefined' ||
        typeof row_kpi_weig[id_row] !== 'undefined' || typeof row_kpi_msr[id_row] !== 'undefined' || typeof row_kpi_dec[id_row] !== 'undefined') {
        $("#row_kpi_" + id_row + "_cat").val(row_kpi_cat[id_row]);
        $("#row_kpi_" + id_row + "_agr").val(row_kpi_agr[id_row]);
        $("#row_kpi_" + id_row + "_weig").val(row_kpi_weig[id_row]);
        $("#row_kpi_" + id_row + "_msr").val(row_kpi_msr[id_row]);
        $("#row_kpi_" + id_row + "_dec").val(row_kpi_dec[id_row]);
    }
    
}

function realizar_cambios_kpi_row(id_row) {

    let rcr_actived = $("#row_kpi_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_kpi = [];
    var obj = {};

    let aggr = $("#row_kpi_" + id_row + "_weig").val() == "" ? 0 : parseInt($("#row_kpi_" + id_row + "_weig").val());
    if (aggr < 0) {
        return;
    }
    let dec = $("#row_kpi_" + id_row + "_dec").val() == "" ? 0 : parseInt($("#row_kpi_" + id_row + "_dec").val());
    if (dec < 0) {
        return;
    }

    obj['kpi_id'] = encodeURIComponent($("#row_kpi_" + id_row + "_id").data("value"));
    obj['kpi_cat'] = encodeURIComponent($("#row_kpi_" + id_row + "_cat option:selected").val());
    obj['kpi_agr'] = $("#row_kpi_" + id_row + "_agr option:selected").val();
    obj['kpi_weig'] = $("#row_kpi_" + id_row + "_weig").val();
    obj['kpi_msr'] = encodeURIComponent($("#row_kpi_" + id_row + "_msr option:selected").val());
    obj['kpi_dec'] = $("#row_kpi_" + id_row + "_dec").val();

    data_edit_kpi.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factkpi_compatibility").attr('disabled', 'disabled');

            // deshabilitar controles
            $("#kpi_filter_msr").prop("disabled", true);
            $("#kpi_filter_cat").prop("disabled", true);
            // deshabilitar botones
            $("#kpi_add_new_row").prop("disabled", true);
            $("#kpi_save_new_rows").prop("disabled", true);
            $("#kpi_cancel_new_rows").prop("disabled", true);
            $("#kpi_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_kpi_" + id_row + "_msr").prop("disabled", true);
            $("#row_kpi_" + id_row + "_cat").prop("disabled", true);
            $("#row_kpi_" + id_row + "_msr").css({ "background-color": "#e9ecef" });
            $("#row_kpi_" + id_row + "_cat").css({ "background-color": "#e9ecef" });
            $("#row_kpi_" + id_row + "_agr").prop("disabled", true);
            $("#row_kpi_" + id_row + "_agr").css({ "background-color": "#e9ecef" });
            $("#row_kpi_" + id_row + "_weig").prop("disabled", true);
            $("#row_kpi_" + id_row + "_dec").prop("disabled", true);
            $("#row_kpi_btn_" + id_row + "_openselect").prop("disabled", true);

            $("#row_kpi_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeKPI': data_edit_kpi },
        url: "/KPI/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#kpi_filter_msr").prop("disabled", false);
            $("#kpi_filter_cat").prop("disabled", false);
            $("#kpi_add_new_row").prop("disabled", false);
            $("#kpi_save_new_rows").prop("disabled", false);
            $("#kpi_cancel_new_rows").prop("disabled", false);
            $("#kpi_refresh_rows").prop("disabled", false);

            $("#row_kpi_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            $("#row_kpi_" + id_row + "_cat").prop("disabled", true);
            $("#row_kpi_" + id_row + "_cat").css({ "background-color": "#e9ecef" });
            $("#row_kpi_" + id_row + "_agr").prop("disabled", true);
            $("#row_kpi_" + id_row + "_agr").css({ "background-color": "#e9ecef" });
            $("#row_kpi_" + id_row + "_weig").prop("disabled", true);
            $("#row_kpi_" + id_row + "_msr").prop("disabled", true);
            $("#row_kpi_" + id_row + "_msr").css({ "background-color": "#e9ecef" });
            $("#row_kpi_" + id_row + "_dec").prop("disabled", true);
            $("#row_kpi_btn_" + id_row + "_openselect").prop("disabled", true);

            $("#row_kpi_btn_" + id_row + "_rcr").css({ "display": "none" });
            $("#row_kpi_btn_" + id_row + "_ccr").css({ "display": "none" });
            $("#row_kpi_btn_" + id_row + "_edr").css({ "display": "block" });
            $("#row_kpi_btn_" + id_row + "_der").css({ "display": "block" });

            $("#row_kpi_btn_" + id_row + "_rcr").data("actived", 0);
            $("#row_kpi_btn_" + id_row + "_ccr").data("actived", 0);
            //refresh_kpi_table();

        }
    });

}

function delete_kpi_row(var1, var2, id_row) {

    let kpi_id = encodeURIComponent($("#row_kpi_" + id_row + "_id").data("value"));

    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + var1 + "<br />" + var2 + "<br /><br />" + window.delete_body_message2);

    var btnNames = {};
    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factkpi_compatibility").attr('disabled', 'disabled');

                // deshabilitar controles
                $("#kpi_filter_msr").prop("disabled", true);
                $("#kpi_filter_cat").prop("disabled", true);
                // deshabilitar botones
                $("#kpi_add_new_row").prop("disabled", true);
                $("#kpi_save_new_rows").prop("disabled", true);
                $("#kpi_cancel_new_rows").prop("disabled", true);
                $("#kpi_refresh_rows").prop("disabled", true);

                $("#row_kpi_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/KPI/DeleteKPI?kpi_id=" + kpi_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#kpi_filter_msr").prop("disabled", false);
                $("#kpi_filter_cat").prop("disabled", false);
                $("#kpi_add_new_row").prop("disabled", false);
                $("#kpi_save_new_rows").prop("disabled", false);
                $("#kpi_cancel_new_rows").prop("disabled", false);
                $("#kpi_refresh_rows").prop("disabled", false);

                $("#row_kpi_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_kpi_row(id_row);
                refresh_kpi_table();

            }
        });
    };
    btnNames[window.no_btn] = function () { $(this).dialog('close'); };

    // Define the Dialog and its properties.
    $("#dialog-delete-confirm").dialog({
        resizable: false,
        modal: true,
        title: window.delete_header_message,
        height: 250,
        width: 400,
        buttons: btnNames 
    });

}

$('#kpi_filter_msr').on('change', function () {
    refresh_kpi_table();
});
$('#kpi_filter_cat').on('change', function () {
    refresh_kpi_table();
});

function refresh_kpi_table() {

    let filter_msr = encodeURIComponent($("#kpi_filter_msr option:selected").val());
    let filter_cat = encodeURIComponent($("#kpi_filter_cat option:selected").val());

    $.ajax({
        beforeSend: function () {
            //$("#factkpi_compatibility").attr('disabled', 'disabled');

            $("#kpi_filter_msr").prop("disabled", true);
            $("#kpi_filter_cat").prop("disabled", true);

            $("#kpi_add_new_row").prop("disabled", true);
            $("#kpi_save_new_rows").prop("disabled", true);
            $("#kpi_cancel_new_rows").prop("disabled", true);
            $("#kpi_refresh_rows").prop("disabled", true);
            $("#kpi_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#kpi_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/KPI/RefreshTable?filter_msr=" + filter_msr + "&filter_cat=" + filter_cat,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);
            const aggregationList = ["SUM", "AVG", "MAX", "MIN", "WEIGHTED AVERAGE"];

            $("#kpi_filter_msr").prop("disabled", false);
            $("#kpi_filter_cat").prop("disabled", false);

            $("#kpi_add_new_row").prop("disabled", false);
            $("#kpi_save_new_rows").prop("disabled", false);
            $("#kpi_cancel_new_rows").prop("disabled", false);
            $("#kpi_refresh_rows").prop("disabled", false);
            $("#kpi_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#kpi_rows_list').html("");
            $('#kpi_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_kpi_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';

                columns += '<td style="padding: 2px;">';
                columns += '<select type="select" id="row_kpi_' + (indexi + 1) + '_msr" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';

                $.each(myList.CollectionB, function (indexj, valueB) {

                    if (valueA["IdMeasurementNum"] == valueB["IdNum"]) {
                        columns += '<option value="' + valueB["Id"] + '" selected="selected">' + (window.language_short == "es" ? valueB["DescriptionEs"] : valueB["DescriptionEn"]) + '</option>';
                    }
                    else {
                        columns += '<option value="' + valueB["Id"] + '">' + (window.language_short == "es" ? valueB["DescriptionEs"] : valueB["DescriptionEn"]) + '</option>';
                    }

                });

                columns += '</select>';
                columns += '</td>';

                columns += '<td style="padding: 2px;">';
                columns += '<select type="select" id="row_kpi_' + (indexi + 1) + '_cat" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';
                $.each(myList.CollectionC, function (indexk, valueC) {

                    if (valueA["IdCategoryNum"] == valueC["IdNum"]) {
                        columns += '<option value="' + valueC["Id"] + '" selected="selected">' + valueC["CategoryName"] + '</option>';
                    }
                    else {
                        columns += '<option value="' + valueC["Id"] + '">' + valueC["CategoryName"] + '</option>';
                    }

                });
                
                columns += '</select>';
                columns += '</td>';


                columns += '<td style="padding: 2px;">';
                columns += '<select type="select" id="row_kpi_' + (indexi + 1) + '_agr" class="custom-select" style="background: none; background-color: #e9ecef;" disabled="disabled">';
                columns += '<option value="-">Seleccione</option>';
                for (var a = 0; a < aggregationList.length; a++) {
                    if (valueA["AgregationType"] == aggregationList[a]) {
                        columns += '<option value="' + aggregationList[a] + '" selected="selected">' + aggregationList[a] + '</option>';
                    }
                    else {
                        columns += '<option value="' + aggregationList[a] + '">' + aggregationList[a] + '</option>';
                    }
                }
                columns += '</select>';
                columns += '</td>';

                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<input id="row_kpi_' + (indexi + 1) + '_weig" type="number" class="form-control" value="' + valueA["WeightedBy"] + '" onkeypress="return event.charCode >= 48" min="0" disabled="disabled">';
                columns += '<button type="button" id="row_kpi_btn_' + (indexi + 1) + '_openselect" onClick="open_select_kpi_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-primary btn-transparent" style="margin-right: 2px !important;" disabled="disabled"><i class="fa fa-angle-down fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '<div id="kpi_' + (indexi + 1) + '_select_section_print"></div>';
                columns += '</td>';

                columns += '<td style="padding: 2px;"><input id="row_kpi_' + (indexi + 1) + '_dec" type="number" class="form-control" value="' + valueA["DecimalPrecision"] + '" onkeypress="return event.charCode >= 48" min="0" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_kpi_btn_' + (indexi + 1) + '_edr" onClick="edit_kpi_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_kpi_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_kpi_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_kpi_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_kpi_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_kpi_btn_' + (indexi + 1) + '_der" onClick="delete_kpi_row(\'' + (window.language_short == "es" ? valueA["DescriptionEs"] : valueA["DescriptionEn"]) + '\', \'' + valueA["CategoryName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 


            });

            // Row hidden

            columns += '<tr id="kpi_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_kpi_new_id">-</th>';

            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_kpi_new_msr" class="custom-select">';
            $.each(myList.CollectionB, function (indexj, valueB) {

                columns += '<option value="' + valueB["Id"] + '">' + (window.language_short == "es" ? valueB["DescriptionEs"] : valueB["DescriptionEn"]) + '</option>';

            });
            columns += '</select>';
            columns += '</td>';

            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_kpi_new_cat" class="custom-select">';
            $.each(myList.CollectionC, function (indexk, valueC) {

                columns += '<option value="' + valueC["Id"] + '">' + valueC["CategoryName"] + '</option>';
                
            });

            columns += '</select>';
            columns += '</td>';

            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_kpi_new_agr" class="custom-select" style="background: none; background-color: #e9ecef;" disabled="disabled">';
            columns += '<option value="-">Seleccione</option>';
            for (var aa = 0; aa < aggregationList.length; aa++) {
                columns += '<option value="' + aggregationList[aa] + '">' + aggregationList[aa] + '</option>';
            }
            columns += '</select>';
            columns += '</td>';

            columns += '<td style="padding: 2px;">';
            columns += '<div class="input-group">';
            columns += '<input id="row_kpi_new_weig" type="number" class="form-control" onkeypress="return event.charCode >= 48" min="0">';
            columns += '<button type="button" id="row_kpi_btn_new_openselect" onClick="open_select_kpi_new_row(num)" data-actived="0" class="btn btn-primary btn-transparent" style="margin-right: 2px !important;"><i class="fa fa-angle-down fa-w-16 fa-1x"></i></button>';
            columns += '</div>';
            columns += '<div id="kpi_new_select_section_print"></div>';
            columns += '</td>';

            columns += '<td style="padding: 2px;"><input id="row_kpi_new_dec" type="number" class="form-control" onkeypress="return event.charCode >= 48" min="0"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#kpi_rows_list").append(columns);

            $("#js_select_num_kpi").find('option').remove();
            $('#js_select_num_kpi').append($('<option>', { value: '-', text: 'Seleccionar' }));
            let select_data = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                select_data += '<option value="' + valueA["IdNum"] + '">' + (valueA["CategoryName"]) + ': ' + (window.language_short == "es" ? valueA["DescriptionEs"] : valueA["DescriptionEn"]) + '</option>';

            });

            $('#js_select_num_kpi').append(select_data);

            count_kpi_new = 0;
            row_kpi_cat = [];
            row_kpi_agr = [];
            row_kpi_weig = [];
            row_kpi_msr = [];
            row_kpi_msr = [];
            row_kpi_dec = [];
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}


$('#kpi_list_add_edit_msr').click(function () {

    refresh_msr_cat_list("msr");

});

$('#kpi_list_add_edit_cat').click(function () {

    refresh_msr_cat_list("cat");

});

function refresh_msr_cat_list(tipo) {
    
    $.ajax({
        beforeSend: function () {
            //$("#factkpi_compatibility").attr('disabled', 'disabled');
            if (tipo == "msr") {
                $("#data_loading_msr").css({ "display": "block", "margin": "auto" });
                $("#data_list_msr").css({ "display": "none" });
            } else {
                $("#data_loading_cat").css({ "display": "block", "margin": "auto" });
                $("#data_list_cat").css({ "display": "none" });
            }
            
        },
        url: "/KPI/RefreshList?type=" + tipo,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);
            let rowsA = '';
            let rowsB = '';

            if (tipo == "msr") {
                $('#kpi_list_add_msr').html("");
                $('#kpi_list_edit_msr').html("");
                $("#kpi_msr_uom_add_new").find('option').remove();
                $("#kpi_filter_msr").find('option').remove();
                $('#kpi_filter_msr').append($('<option>', { value: 'All', text: 'Todos' }));
                
                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + (indexi + 1) + '. ' + (window.language_short == "es" ? valueA["DescriptionEs"] : valueA["DescriptionEn"]) + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_msr_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_msr_' + (indexi + 1) + '_desc_es" type="text" class="form-control custom-input" value="' + valueA["DescriptionEs"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;"><input id="row_msr_' + (indexi + 1) + '_desc_en" type="text" class="form-control custom-input" value="' + valueA["DescriptionEn"] + '" disabled="disabled"></td>';


                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<select type="select" id="row_msr_' + (indexi + 1) + '_uom" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';

                    $.each(myList.CollectionB, function (indexj, valueB) {

                        if (valueA["IdUOMNum"] == valueB["IdNum"]) {
                            rowsB += '<option value="' + valueB["Id"] + '" selected="selected">' + (window.language_short == "es" ? valueB["UOMNameSp"] : valueB["UOMNameEn"]) + '</option>';
                        }
                        else {
                            rowsB += '<option value="' + valueB["Id"] + '">' + (window.language_short == "es" ? valueB["UOMNameSp"] : valueB["UOMNameEn"]) + '</option>';
                        }

                    });

                    rowsB += '</select>';
                    rowsB += '</td>';


                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_kpi_btn_msr_' + (indexi + 1) + '_edr" onClick="edit_msr_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpi_btn_msr_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_msr_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpi_btn_msr_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_msr_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpi_btn_msr_' + (indexi + 1) + '_der" onClick="delete_msr_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>'; 

                    $('#kpi_filter_msr').append($('<option>', { value: valueA["Id"], text: (window.language_short == "es" ? valueA["DescriptionEs"] : valueA["DescriptionEn"]) }));

                });

                $.each(myList.CollectionB, function (indexj, valueB) {

                    $('#kpi_msr_uom_add_new').append($('<option>', { value: valueB["Id"], text: (window.language_short == "es" ? valueB["UOMNameSp"] : valueB["UOMNameEn"]) }));

                });

                $('#kpi_list_add_msr').append(rowsA);
                $('#kpi_list_edit_msr').append(rowsB);

                $("#data_loading_msr").css({ "display": "none", "margin": "auto" });
                $("#data_list_msr").css({ "display": "block" });

            } else {

                $('#kpi_list_add_cat').html("");
                $('#kpi_list_edit_cat').html("");
                $("#kpi_filter_cat").find('option').remove();
                $('#kpi_filter_cat').append($('<option>', { value: 'All', text: 'Todos' }));

                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + (indexi + 1) + '. ' + valueA["CategoryName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_cat_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_cat_' + (indexi + 1) + '_name" type="text" class="form-control custom-input" value="' + valueA["CategoryName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;"><input id="row_cat_' + (indexi + 1) + '_funcarea" type="text" class="form-control custom-input" value="' + valueA["FunctionalArea"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;"><input id="row_cat_' + (indexi + 1) + '_process" type="text" class="form-control custom-input" value="' + valueA["Process"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;"><input id="row_cat_' + (indexi + 1) + '_subprocess" type="text" class="form-control custom-input" value="' + valueA["SubProcess"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_kpi_btn_cat_' + (indexi + 1) + '_edr" onClick="edit_cat_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpi_btn_cat_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_cat_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpi_btn_cat_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_cat_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpi_btn_cat_' + (indexi + 1) + '_der" onClick="delete_cat_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>';

                    $('#kpi_filter_cat').append($('<option>', { value: valueA["Id"], text: valueA["CategoryName"] }));

                });

                $('#kpi_list_add_cat').append(rowsA);
                $('#kpi_list_edit_cat').append(rowsB);

                $("#data_loading_cat").css({ "display": "none", "margin": "auto" });
                $("#data_list_cat").css({ "display": "block" });

            }

        }
    });
    

}


function btn_kpi_msr_add_new() {

    $("#btn_kpi_msr_add_new").prop("disabled", true);
    $("#kpi_msr_es_add_new").prop("readonly", true);
    $("#kpi_msr_en_add_new").prop("readonly", true);
    $("#kpi_msr_uom_add_new").prop("readonly", true);

    var data_msr = [];
    var obj = {};

    obj['Name_Sp'] = $("#kpi_msr_es_add_new").val();
    obj['Name_En'] = $("#kpi_msr_en_add_new").val();
    obj['UOM'] = $("#kpi_msr_uom_add_new option:selected").val();
    obj['Type'] = "msr";

    data_msr.push(obj);
    
    $.ajax({
        beforeSend: function () {
            
            $("#btn_kpi_msr_add_new").html("Añadiendo...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'data': data_msr },
        url: "/KPI/SaveNewItem",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#btn_kpi_msr_add_new").html("Añadir");
            $("#btn_kpi_msr_add_new").prop("disabled", false);
            $("#kpi_msr_es_add_new").prop("readonly", false);
            $("#kpi_msr_en_add_new").prop("readonly", false);
            $("#kpi_msr_uom_add_new").prop("readonly", false);

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            $("#kpi_msr_es_add_new").val("");
            $("#kpi_msr_en_add_new").val("");
            refresh_msr_cat_list("msr");

        }
    });

}


function btn_kpi_cat_add_new() {

    $("#btn_kpi_cat_add_new").prop("disabled", true);
    $("#kpi_cat_es_add_new").prop("readonly", true);
    $("#kpi_cat_funcarea_add_new").prop("readonly", true);
    $("#kpi_cat_process_add_new").prop("readonly", true);
    $("#kpi_cat_subprocess_add_new").prop("readonly", true);

    var data_cat = [];
    var obj = {};

    obj['Name_Only'] = $("#kpi_cat_es_add_new").val();
    obj['FunctionalArea'] = $("#kpi_cat_funcarea_add_new").val();
    obj['Process'] = $("#kpi_cat_process_add_new").val();
    obj['SubProcess'] = $("#kpi_cat_subprocess_add_new").val();
    obj['Type'] = "cat";

    data_cat.push(obj);

    $.ajax({
        beforeSend: function () {

            $("#btn_kpi_cat_add_new").html("Añadiendo...");

        },
        data: { 'data': data_cat },
        url: "/KPI/SaveNewItem",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#btn_kpi_cat_add_new").html("Añadir");
            $("#btn_kpi_cat_add_new").prop("disabled", false);
            $("#kpi_cat_es_add_new").prop("readonly", false);
            $("#kpi_cat_funcarea_add_new").prop("readonly", false);
            $("#kpi_cat_process_add_new").prop("readonly", false);
            $("#kpi_cat_subprocess_add_new").prop("readonly", false);

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            refresh_msr_cat_list("cat");

        }
    });

}

// modals edit and cancel

function edit_msr_row(id_row) {
    $("#row_msr_" + id_row + "_desc_es").prop("disabled", false);
    $("#row_msr_" + id_row + "_desc_en").prop("disabled", false);
    $("#row_msr_" + id_row + "_uom").prop("disabled", false);
    $("#row_msr_" + id_row + "_uom").css({ "background-color": "#fff" });

    $("#row_kpi_btn_msr_" + id_row + "_edr").css({ "display": "none" });
    $("#row_kpi_btn_msr_" + id_row + "_der").css({ "display": "none" });
    $("#row_kpi_btn_msr_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_kpi_btn_msr_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_kpi_btn_msr_" + id_row + "_rcr").data("actived", 1);
    $("#row_kpi_btn_msr_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_msr_row(id_row) {
    $("#row_msr_" + id_row + "_desc_es").prop("disabled", true);
    $("#row_msr_" + id_row + "_desc_en").prop("disabled", true);
    $("#row_msr_" + id_row + "_uom").prop("disabled", true);
    $("#row_msr_" + id_row + "_uom").css({ "background-color": "#e9ecef" });

    $("#row_kpi_btn_msr_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_kpi_btn_msr_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_kpi_btn_msr_" + id_row + "_edr").css({ "display": "block" });
    $("#row_kpi_btn_msr_" + id_row + "_der").css({ "display": "block" });

    $("#row_kpi_btn_msr_" + id_row + "_rcr").data("actived", 0);
    $("#row_kpi_btn_msr_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_msr_row(id_row) {

    let rcr_actived = $("#row_kpi_btn_msr_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_msr = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_msr_" + id_row + "_id").data("value"));
    obj['Name_En'] = $("#row_msr_" + id_row + "_desc_en").val();
    obj['Name_Sp'] = $("#row_msr_" + id_row + "_desc_es").val();
    obj['UOM'] = encodeURIComponent($("#row_msr_" + id_row + "_uom option:selected").val());
    obj['Type'] = "msr";

    data_msr.push(obj);

    $.ajax({
        beforeSend: function () {

            // deshabilitar entradas
            $("#row_msr_" + id_row + "_desc_es").prop("disabled", true);
            $("#row_msr_" + id_row + "_desc_en").prop("disabled", true);
            $("#row_msr_" + id_row + "_uom").prop("disabled", true);
            $("#row_msr_" + id_row + "_uom").css({ "background-color": "#e9ecef" });

            $("#row_kpi_btn_msr_" + id_row + "_edr").prop("disabled", false);
            $("#row_kpi_btn_msr_" + id_row + "_rcr").prop("disabled", false);
            $("#row_kpi_btn_msr_" + id_row + "_ccr").prop("disabled", false);
            $("#row_kpi_btn_msr_" + id_row + "_der").prop("disabled", false);
            
            $("#row_kpi_btn_msr_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_msr },
        url: "/KPI/SaveChangesMsrCat",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_kpi_btn_msr_" + id_row + "_edr").prop("disabled", true);
            $("#row_kpi_btn_msr_" + id_row + "_rcr").prop("disabled", true);
            $("#row_kpi_btn_msr_" + id_row + "_ccr").prop("disabled", true);
            $("#row_kpi_btn_msr_" + id_row + "_der").prop("disabled", true);
            $("#row_kpi_btn_msr_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_msr_row(id_row);
            refresh_msr_cat_list("msr");

        }
    });

}

function delete_msr_row(id_row) {

    let id = encodeURIComponent($("#row_msr_" + id_row + "_id").data("value"));

    $.ajax({
        beforeSend: function () {
            //$("#factkpi_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#row_kpi_btn_msr_" + id_row + "_edr").prop("disabled", false);
            $("#row_kpi_btn_msr_" + id_row + "_rcr").prop("disabled", false);
            $("#row_kpi_btn_msr_" + id_row + "_ccr").prop("disabled", false);
            $("#row_kpi_btn_msr_" + id_row + "_der").prop("disabled", false);
            $("#row_kpi_btn_msr_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
        },
        url: "/KPI/DeleteMsrCat?id=" + id + "&type=msr",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_kpi_btn_msr_" + id_row + "_edr").prop("disabled", true);
            $("#row_kpi_btn_msr_" + id_row + "_rcr").prop("disabled", true);
            $("#row_kpi_btn_msr_" + id_row + "_ccr").prop("disabled", true);
            $("#row_kpi_btn_msr_" + id_row + "_der").prop("disabled", true);
            $("#row_kpi_btn_msr_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_msr_row(id_row);
            refresh_msr_cat_list("msr");

        }
    });

}



function edit_cat_row(id_row) {
    $("#row_cat_" + id_row + "_name").prop("disabled", false);
    $("#row_cat_" + id_row + "_funcarea").prop("disabled", false);
    $("#row_cat_" + id_row + "_process").prop("disabled", false);
    $("#row_cat_" + id_row + "_subprocess").prop("disabled", false);

    $("#row_kpi_btn_cat_" + id_row + "_edr").css({ "display": "none" });
    $("#row_kpi_btn_cat_" + id_row + "_der").css({ "display": "none" });
    $("#row_kpi_btn_cat_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_kpi_btn_cat_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_kpi_btn_cat_" + id_row + "_rcr").data("actived", 1);
    $("#row_kpi_btn_cat_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_cat_row(id_row) {
    $("#row_cat_" + id_row + "_name").prop("disabled", true);
    $("#row_cat_" + id_row + "_funcarea").prop("disabled", true);
    $("#row_cat_" + id_row + "_process").prop("disabled", true);
    $("#row_cat_" + id_row + "_subprocess").prop("disabled", true);

    $("#row_kpi_btn_cat_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_kpi_btn_cat_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_kpi_btn_cat_" + id_row + "_edr").css({ "display": "block" });
    $("#row_kpi_btn_cat_" + id_row + "_der").css({ "display": "block" });

    $("#row_kpi_btn_cat_" + id_row + "_rcr").data("actived", 0);
    $("#row_kpi_btn_cat_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_cat_row(id_row) {

    let rcr_actived = $("#row_kpi_btn_cat_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_cat = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_cat_" + id_row + "_id").data("value"));
    obj['Name_Only'] = $("#row_cat_" + id_row + "_name").val();
    obj['FunctionalArea'] = $("#row_cat_" + id_row + "_funcarea").val();
    obj['Process'] = $("#row_cat_" + id_row + "_process").val();
    obj['SubProcess'] = $("#row_cat_" + id_row + "_subprocess").val();
    obj['Type'] = "cat";

    data_cat.push(obj);

    $.ajax({
        beforeSend: function () {

            // deshabilitar entradas
            $("#row_cat_" + id_row + "_name").prop("disabled", true);
            $("#row_cat_" + id_row + "_funcarea").prop("disabled", true);
            $("#row_cat_" + id_row + "_process").prop("disabled", true);
            $("#row_cat_" + id_row + "_subprocess").prop("disabled", true);

            $("#row_kpi_btn_cat_" + id_row + "_edr").prop("disabled", false);
            $("#row_kpi_btn_cat_" + id_row + "_rcr").prop("disabled", false);
            $("#row_kpi_btn_cat_" + id_row + "_ccr").prop("disabled", false);
            $("#row_kpi_btn_cat_" + id_row + "_der").prop("disabled", false);

            $("#row_kpi_btn_cat_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_cat },
        url: "/KPI/SaveChangesMsrCat",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_kpi_btn_cat_" + id_row + "_edr").prop("disabled", true);
            $("#row_kpi_btn_cat_" + id_row + "_rcr").prop("disabled", true);
            $("#row_kpi_btn_cat_" + id_row + "_ccr").prop("disabled", true);
            $("#row_kpi_btn_cat_" + id_row + "_der").prop("disabled", true);
            $("#row_kpi_btn_cat_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_cat_row(id_row);
            refresh_msr_cat_list("cat");

        }
    });

}

function delete_cat_row(id_row) {

    let id = encodeURIComponent($("#row_cat_" + id_row + "_id").data("value"));

    $.ajax({
        beforeSend: function () {
            //$("#factkpi_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#row_kpi_btn_cat_" + id_row + "_edr").prop("disabled", false);
            $("#row_kpi_btn_cat_" + id_row + "_rcr").prop("disabled", false);
            $("#row_kpi_btn_cat_" + id_row + "_ccr").prop("disabled", false);
            $("#row_kpi_btn_cat_" + id_row + "_der").prop("disabled", false);
            $("#row_kpi_btn_cat_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
        },
        url: "/KPI/DeleteMsrCat?id=" + id + "&type=cat",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_kpi_btn_cat_" + id_row + "_edr").prop("disabled", true);
            $("#row_kpi_btn_cat_" + id_row + "_rcr").prop("disabled", true);
            $("#row_kpi_btn_cat_" + id_row + "_ccr").prop("disabled", true);
            $("#row_kpi_btn_cat_" + id_row + "_der").prop("disabled", true);
            $("#row_kpi_btn_cat_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_cat_row(id_row);
            refresh_msr_cat_list("cat");

        }
    });
    
}


function open_select_kpi_row(id_row) {

    let btn_actived = $("#row_kpi_btn_" + id_row + "_openselect").data("actived");

    if (btn_actived == "0") {
        let element = document.getElementById("kpi_section_select_hidden")
        let selectelement = element.cloneNode(true)

        var row = selectelement.innerHTML;
        row = row.replace("kpi_num_select_section", "kpi_" + id_row + "_select_section");
        row = row.replace("js_select_num_kpi", "js_select_" + id_row + "_kpi");
        row = row.replace("js_selected_fn_kpi(num)", "js_selected_fn_kpi(" + id_row + ")");

        $("#kpi_" + id_row + "_select_section_print").html(row);

        var selectrowkpi = $("#js_select_" + id_row + "_kpi");
        selectrowkpi.select2();

        $("#kpi_" + id_row + "_select_section > span").addClass("float-select");
        $("#row_kpi_btn_" + id_row + "_openselect").data("actived", "1");
        $("#row_kpi_btn_" + id_row + "_openselect > i").attr('class', 'fa fa-angle-up fa-w-16 fa-1x');
    }

    if (btn_actived == "1") {
        $("#kpi_" + id_row + "_select_section_print").html("");
        $("#row_kpi_btn_" + id_row + "_openselect").data("actived", "0");
        $("#row_kpi_btn_" + id_row + "_openselect > i").attr('class', 'fa fa-angle-down fa-w-16 fa-1x');
    }

}

function js_selected_fn_kpi(id_row) {

    let cod_kpi = $("#js_select_" + id_row + "_kpi").val();
    $("#row_kpi_" + id_row + "_weig").val(cod_kpi);

    $("#kpi_" + id_row + "_select_section_print").html("");
    $("#row_kpi_btn_" + id_row + "_openselect").data("actived", "0");
    $("#row_kpi_btn_" + id_row + "_openselect > i").attr('class', 'fa fa-angle-down fa-w-16 fa-1x');
};



function open_select_kpi_new_row(id_row) {

    let btn_actived = $("#row_kpi_btn_new_openselect_" + id_row).data("actived");

    if (btn_actived == "0") {
        let element = document.getElementById("kpi_section_select_hidden")
        let selectelement = element.cloneNode(true)

        var row = selectelement.innerHTML;
        row = row.replace("kpi_num_select_section", "kpi_new_" + id_row + "_select_section");
        row = row.replace("js_select_num_kpi", "js_select_new_" + id_row + "_kpi");
        row = row.replace("js_selected_fn_kpi(num)", "js_selected_fn_new_kpi(" + id_row + ")");

        $("#kpi_new_select_section_print_" + id_row).html(row);

        var selectrowkpi = $("#js_select_new_" + id_row + "_kpi");
        selectrowkpi.select2();

        $("#kpi_new_" + id_row + "_select_section > span").addClass("float-select");
        $("#row_kpi_btn_new_openselect_" + id_row).data("actived", "1");
        $("#row_kpi_btn_new_openselect_" + id_row + " > i").attr('class', 'fa fa-angle-up fa-w-16 fa-1x');
    }

    if (btn_actived == "1") {
        $("#kpi_new_select_section_print_" + id_row).html("");
        $("#row_kpi_btn_new_openselect_" + id_row).data("actived", "0");
        $("#row_kpi_btn_new_openselect_" + id_row + " > i").attr('class', 'fa fa-angle-down fa-w-16 fa-1x');
    }

}

function js_selected_fn_new_kpi(id_row) {

    let cod_kpi = $("#js_select_new_" + id_row + "_kpi").val();
    $("#row_kpi_new_weig_" + id_row).val(cod_kpi);

    $("#kpi_new_select_section_print_" + id_row).html("");
    $("#row_kpi_btn_new_openselect_" + id_row).data("actived", "0");
    $("#row_kpi_btn_new_openselect_" + id_row + " > i").attr('class', 'fa fa-angle-down fa-w-16 fa-1x');

};
// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
//let count_kpisce_new = 0;
// Write your JavaScript code.
//$('#kpisce_add_new_row').click(function () {

//    let element = document.getElementById("kpisce_row_example_hidden");
//    let newelement = element.cloneNode(true);
//    count_kpisce_new += 1;

//    var row = '<tr id="new_row_' + count_kpisce_new + '">' + newelement.innerHTML + '</tr>';
//    row = row.replace("row_kpisce_new_id", "row_kpisce_new_id_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_kpi", "row_kpisce_new_kpi_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_source", "row_kpisce_new_source_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_table_name", "row_kpisce_new_table_name_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_column_name_date", "row_kpisce_new_column_name_date_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_column_name_shift", "row_kpisce_new_column_name_shift_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_column_name_value", "row_kpisce_new_column_name_value_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_filter_additional", "row_kpisce_new_filter_additional_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_parameters", "row_kpisce_new_parameters_" + count_kpisce_new);
//    $("#kpisce_rows_list tr:first").before(row);

//});

$('#kpisce_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_kpisce_new = 0;
    return false;
});

/*
$('#kpisce_save_new_rows').click(function () {

    if (count_kpisce_new == 0) {
        return;
    }

    $("#kpisce_filter_kpi").prop("disabled", true);
    $("#kpisce_filter_source").prop("disabled", true);

    $("#kpisce_add_new_row").prop("disabled", true);
    $("#kpisce_save_new_rows").prop("disabled", true);
    $("#kpisce_cancel_new_rows").prop("disabled", true);
    $("#kpisce_refresh_rows").prop("disabled", true);
    $("#kpisce_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var kpisce_new_count = $("th[id^='row_kpisce_new_id_']");
    var datas_kpisce = [];

    for (var i = 1; i <= kpisce_new_count.length; i++) {

        var obj = {};

        obj['kpisce_kpi'] = encodeURIComponent($("#row_kpisce_new_kpi_" +  i).val());
        obj['kpisce_source'] = encodeURIComponent($("#row_kpisce_new_source_" + i).val());
        obj['kpisce_table_name'] = $("#row_kpisce_new_table_name_" + i).val();
        obj['kpisce_column_name_date'] = $("#row_kpisce_new_column_name_date_" + i).val();
        obj['kpisce_column_name_shift'] = $("#row_kpisce_new_column_name_shift_" + i).val();
        obj['kpisce_column_name_value'] = $("#row_kpisce_new_column_name_value_" + i).val();
        obj['kpisce_filter_additional'] = $("#row_kpisce_new_filter_additional_" + i).val();
        obj['kpisce_parameters'] = $("#row_kpisce_new_parameters_" + i).val();

        datas_kpisce.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');
            $('#kpisce_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewKPIScenario': datas_kpisce }, 
        url: "/KPIScenario/SetNewKPIScenarios",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#kpisce_filter_kpi").prop("disabled", false);
            $("#kpisce_filter_source").prop("disabled", false);

            $("#kpisce_add_new_row").prop("disabled", false);
            $("#kpisce_save_new_rows").prop("disabled", false);
            $("#kpisce_cancel_new_rows").prop("disabled", false);
            $("#kpisce_refresh_rows").prop("disabled", false);
            $("#kpisce_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_kpisce_new = 0;
            refresh_kpisce_table();

        }
    });

});
*/

function edit_kpisce_row(id_row) {

    edit_kpisce_refresh_modal(id_row);

}

function edit_kpisce_refresh_modal(id_row) {

    let kpisce_id = encodeURIComponent($("#row_kpisce_" + id_row + "_id").data("value"));
    let kpisce_kpi = encodeURIComponent($("#row_kpisce_" + id_row + "_kpi").val());
    let kpisce_source = encodeURIComponent($("#row_kpisce_" + id_row + "_source").val());

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');
            $("#data_loading_edit_kpisce").css({ "display": "block", "margin": "auto" });
            $("#data_list_edit_kpisce").css({ "display": "none" });

        },
        url: "/KPIScenario/GetKPIScenarioInfo?num1=" + kpisce_kpi + "&num2=" + kpisce_id + "&num3=" + kpisce_source,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#kpisce_select_modal_edit_kpi").find('option').remove();
            $('#kpisce_select_modal_edit_kpi').append($('<option>', { value: '-', text: 'Seleccionar' }));
            $("#kpisce_select_modal_edit_source").find('option').remove();
            $('#kpisce_select_modal_edit_source').append($('<option>', { value: '-', text: 'Seleccionar' }));

            $.each(myList.CollectionB, function (indexi, valueA) {

                $('#kpisce_select_modal_edit_kpi').append($('<option>', { value: valueA["Id"], text: (window.language_short == "es" ? valueA["KPINameEs"] : valueA["KPINameEn"]) }));

            });
            $.each(myList.CollectionC, function (indexi, valueB) {

                $('#kpisce_select_modal_edit_source').append($('<option>', { value: valueB["Id"], text: valueB["SourceName"] }));

            });
            
            $("#kpisce_select_modal_edit_kpi").val(myList.CollectionA[0].IdKPI);
            $("#kpisce_select_modal_edit_source").val(myList.CollectionA[0].IdSource);
            $("#kpisce_select_modal_edit_kpi").prop("disabled", true);
            $("#kpisce_select_modal_edit_source").prop("disabled", true);
            $("#kpisce_input_modal_edit_tablename").val(myList.CollectionA[0].TableName);
            $("#kpisce_input_modal_edit_colnamedate").val(myList.CollectionA[0].ColumnNameDate);
            $("#kpisce_input_modal_edit_colnameshift").val(myList.CollectionA[0].ColumnNameShift);
            $("#kpisce_input_modal_edit_colnamevalue").val(myList.CollectionA[0].ColumnNameValue);
            $("#kpisce_input_modal_edit_filteradd").val(myList.CollectionA[0].FilterAdditional);
            $("#kpisce_input_modal_edit_parameters").val(myList.CollectionA[0].Parameters);
            $("#kpisce_btn_modal_edit").data("editid", id_row); 

            $("#data_loading_edit_kpisce").css({ "display": "none", "margin": "auto" });
            $("#data_list_edit_kpisce").css({ "display": "flex" });

            let source_select = $("#kpisce_select_modal_edit_source").find(":selected").text();

            if (source_select == "N.A.") {
                $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
                $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
                $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
                $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", true);
                $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
                $("#kpisce_input_modal_edit_parameters").prop("disabled", true);
            } else {
                if (source_select == "FORMULA") {
                    $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
                    $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
                    $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
                    $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
                    $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
                    $("#kpisce_input_modal_edit_parameters").prop("disabled", false);
                } else {
                    $("#kpisce_input_modal_edit_tablename").prop("disabled", false);
                    $("#kpisce_input_modal_edit_colnamedate").prop("disabled", false);
                    $("#kpisce_input_modal_edit_colnameshift").prop("disabled", false);
                    $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
                    $("#kpisce_input_modal_edit_filteradd").prop("disabled", false);
                    $("#kpisce_input_modal_edit_parameters").prop("disabled", true);
                }
            }

        }
    });


}

//$("#Modal_edit_KPI_Scenario > div > div > div.modal-footer > button").click(function () {

    //$("#kpisce_select_modal_edit_kpi").val("-");
    //$("#kpisce_select_modal_edit_source").val("-");
    //$("#kpisce_input_modal_edit_tablename").val("");
    //$("#kpisce_input_modal_edit_colnamedate").val("");
    //$("#kpisce_input_modal_edit_colnameshift").val("");
    //$("#kpisce_input_modal_edit_colnamevalue").val("");
    //$("#kpisce_input_modal_edit_filteradd").val("");
    //$("#kpisce_input_modal_edit_parameters").val("");
    //$("#kpisce_btn_modal_edit").data("editid", ""); 

//    alert("dsadsa");

//});

function select_modal_add_change_source() {

    let source_select = $("#kpisce_select_modal_add_source").find(":selected").text();

    if (source_select == "N.A." || $("#kpisce_select_modal_add_source").val() == "-") {
        $("#kpisce_input_modal_add_tablename").prop("disabled", true);
        $("#kpisce_input_modal_add_colnamedate").prop("disabled", true);
        $("#kpisce_input_modal_add_colnameshift").prop("disabled", true);
        $("#kpisce_input_modal_add_colnamevalue").prop("disabled", true);
        $("#kpisce_input_modal_add_filteradd").prop("disabled", true);
        $("#kpisce_input_modal_add_parameters").prop("disabled", true);

        $("#kpisce_input_modal_add_tablename").val("");
        $("#kpisce_input_modal_add_colnamedate").val("");
        $("#kpisce_input_modal_add_colnameshift").val("");
        $("#kpisce_input_modal_add_filteradd").val("");
        $("#kpisce_input_modal_add_colnamevalue").val("");
        $("#kpisce_input_modal_add_parameters").val("");
    } else {
        if (source_select == "FORMULA") {
            $("#kpisce_input_modal_add_tablename").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_add_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_add_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_add_parameters").prop("disabled", false);

            $("#kpisce_input_modal_add_tablename").val("");
            $("#kpisce_input_modal_add_colnamedate").val("");
            $("#kpisce_input_modal_add_colnameshift").val("");
            $("#kpisce_input_modal_add_filteradd").val("");
            $("#kpisce_input_modal_add_colnamevalue").val("");
            $("#kpisce_input_modal_add_parameters").val("");
        } else {
            $("#kpisce_input_modal_add_tablename").prop("disabled", false);
            $("#kpisce_input_modal_add_colnamedate").prop("disabled", false);
            $("#kpisce_input_modal_add_colnameshift").prop("disabled", false);
            $("#kpisce_input_modal_add_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_add_filteradd").prop("disabled", false);
            $("#kpisce_input_modal_add_parameters").prop("disabled", true);

            $("#kpisce_input_modal_add_tablename").val("");
            $("#kpisce_input_modal_add_colnamedate").val("");
            $("#kpisce_input_modal_add_colnameshift").val("");
            $("#kpisce_input_modal_add_filteradd").val("");
            $("#kpisce_input_modal_add_colnamevalue").val("");
            $("#kpisce_input_modal_add_parameters").val("");
        }

    }

}

function select_modal_edit_change_source() {

    let source_select = $("#kpisce_select_modal_edit_source").find(":selected").text();

    if (source_select == "N.A." || $("#kpisce_select_modal_edit_source").val() == "-") {
        $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
        $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
        $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
        $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", true);
        $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
        $("#kpisce_input_modal_edit_parameters").prop("disabled", true);

        $("#kpisce_input_modal_edit_tablename").val("");
        $("#kpisce_input_modal_edit_colnamedate").val("");
        $("#kpisce_input_modal_edit_colnameshift").val("");
        $("#kpisce_input_modal_edit_filteradd").val("");
        $("#kpisce_input_modal_edit_colnamevalue").val("");
        $("#kpisce_input_modal_edit_parameters").val("");
    } else {
        if (source_select == "FORMULA") {
            $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_edit_parameters").prop("disabled", false);

            $("#kpisce_input_modal_edit_tablename").val("");
            $("#kpisce_input_modal_edit_colnamedate").val("");
            $("#kpisce_input_modal_edit_colnameshift").val("");
            $("#kpisce_input_modal_edit_filteradd").val("");
            $("#kpisce_input_modal_edit_colnamevalue").val("");
            $("#kpisce_input_modal_edit_parameters").val("");
        } else {
            $("#kpisce_input_modal_edit_tablename").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnamedate").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnameshift").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_edit_filteradd").prop("disabled", false);
            $("#kpisce_input_modal_edit_parameters").prop("disabled", true);

            $("#kpisce_input_modal_edit_tablename").val("");
            $("#kpisce_input_modal_edit_colnamedate").val("");
            $("#kpisce_input_modal_edit_colnameshift").val("");
            $("#kpisce_input_modal_edit_filteradd").val("");
            $("#kpisce_input_modal_edit_colnamevalue").val("");
            $("#kpisce_input_modal_edit_parameters").val("");
        }

    }

}

function cancelar_cambios_kpisce_row(id_row) {

    $("#row_kpisce_" + id_row + "_kpi").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_source").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_kpi").css({ "background-color": "#e9ecef" });
    $("#row_kpisce_" + id_row + "_source").css({ "background-color": "#e9ecef" });
    $("#row_kpisce_" + id_row + "_table_name").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_column_name_date").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_column_name_shift").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_column_name_value").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_filter_additional").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_parameters").prop("disabled", true);

    $("#row_kpisce_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_kpisce_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_kpisce_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_kpisce_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_kpisce_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_kpisce_btn_" + id_row + "_ccr").data("actived", 0);
}

function kpisce_btn_modal_edit() {

    let id_row = $("#kpisce_btn_modal_edit").data("editid"); 
    var attibutevalue = $("#Modal_edit_KPI_Scenario").attr('aria-hidden');

    if (typeof attibutevalue !== 'undefined' && attibutevalue !== false) {
        return;
    }

    if (id_row == "") {
        return;
    }

    var data_edit_kpisce = [];
    var obj = {};

    if ($("#kpisce_select_modal_edit_source").val() == "-") {
        return;
    }

    obj['kpisce_id'] = encodeURIComponent($("#row_kpisce_" + id_row + "_id").data("value"));
    obj['kpisce_kpi'] = encodeURIComponent($("#kpisce_select_modal_edit_kpi").val());
    obj['kpisce_source'] = encodeURIComponent($("#kpisce_select_modal_edit_source").val());
    obj['kpisce_table_name'] = $("#kpisce_input_modal_edit_tablename").val();
    obj['kpisce_column_name_date'] = $("#kpisce_input_modal_edit_colnamedate").val();
    obj['kpisce_column_name_shift'] = $("#kpisce_input_modal_edit_colnameshift").val();
    obj['kpisce_column_name_value'] = $("#kpisce_input_modal_edit_colnamevalue").val();
    obj['kpisce_filter_additional'] = $("#kpisce_input_modal_edit_filteradd").val();
    obj['kpisce_parameters'] = $("#kpisce_input_modal_edit_parameters").val();

    data_edit_kpisce.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');

            // deshabilitar controles
            $("#kpisce_filter_kpi").prop("disabled", true);
            $("#kpisce_filter_source").prop("disabled", true);
            // deshabilitar botones
            $("#kpisce_add_new_row").prop("disabled", true);
            $("#kpisce_save_new_rows").prop("disabled", true);
            $("#kpisce_cancel_new_rows").prop("disabled", true);
            $("#kpisce_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#kpisce_select_modal_edit_kpi").prop("disabled", true);
            $("#kpisce_select_modal_edit_source").prop("disabled", true);
            $("#kpisce_select_modal_edit_kpi").css({ "background-color": "#e9ecef" });
            $("#kpisce_select_modal_edit_source").css({ "background-color": "#e9ecef" });
            $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", true);
            $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_edit_parameters").prop("disabled", true);

            $("#kpisce_btn_modal_edit").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeKPIScenario': data_edit_kpisce },
        url: "/KPIScenario/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            // habilitar controles
            $("#kpisce_filter_kpi").prop("disabled", false);
            $("#kpisce_filter_source").prop("disabled", false);
            // habilitar botones
            $("#kpisce_add_new_row").prop("disabled", false);
            $("#kpisce_save_new_rows").prop("disabled", false);
            $("#kpisce_cancel_new_rows").prop("disabled", false);
            $("#kpisce_refresh_rows").prop("disabled", false);
            // habilitar entradas
            $("#kpisce_select_modal_edit_kpi").prop("disabled", false);
            $("#kpisce_select_modal_edit_source").prop("disabled", false);
            $("#kpisce_select_modal_edit_kpi").css({ "background-color": "#ffffff" });
            $("#kpisce_select_modal_edit_source").css({ "background-color": "#ffffff" });
            $("#kpisce_input_modal_edit_tablename").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnamedate").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnameshift").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_edit_filteradd").prop("disabled", false);
            $("#kpisce_input_modal_edit_parameters").prop("disabled", false);

            $("#kpisce_btn_modal_edit").html('Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            refresh_kpisce_table();

            $("#kpisce_select_modal_edit_kpi").val("-");
            $("#kpisce_select_modal_edit_source").val("-");
            $("#kpisce_input_modal_edit_tablename").val("");
            $("#kpisce_input_modal_edit_colnamedate").val("");
            $("#kpisce_input_modal_edit_colnameshift").val("");
            $("#kpisce_input_modal_edit_colnamevalue").val("");
            $("#kpisce_input_modal_edit_filteradd").val("");
            $("#kpisce_input_modal_edit_parameters").val("");
            $("#kpisce_btn_modal_edit").data("editid", ""); 

            $("#Modal_edit_KPI_Scenario > div > div > div.modal-footer > button").trigger('click');

        }
    });

}

function delete_kpisce_row(delete_body_message_var, id_row) {

    let kpisce_id = encodeURIComponent($("#row_kpisce_" + id_row + "_id").data("value"));
    let kpisce_kpi = encodeURIComponent($("#row_kpisce_" + id_row + "_kpi").val());
    let kpisce_source = encodeURIComponent($("#row_kpisce_" + id_row + "_source").val());

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factkpisce_compatibility").attr('disabled', 'disabled');

                // deshabilitar controles
                $("#kpisce_filter_kpi").prop("disabled", true);
                $("#kpisce_filter_source").prop("disabled", true);
                // deshabilitar botones
                $("#kpisce_add_new_row").prop("disabled", true);
                $("#kpisce_save_new_rows").prop("disabled", true);
                $("#kpisce_cancel_new_rows").prop("disabled", true);
                $("#kpisce_refresh_rows").prop("disabled", true);

                $("#row_kpisce_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/KPIScenario/DeleteKPIScenario?kpisce_kpi=" + kpisce_kpi + "&kpisce_id=" + kpisce_id + "&kpisce_source=" + kpisce_source,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#kpisce_filter_kpi").prop("disabled", false);
                $("#kpisce_filter_source").prop("disabled", false);
                $("#kpisce_add_new_row").prop("disabled", false);
                $("#kpisce_save_new_rows").prop("disabled", false);
                $("#kpisce_cancel_new_rows").prop("disabled", false);
                $("#kpisce_refresh_rows").prop("disabled", false);

                $("#row_kpisce_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_kpisce_row(id_row);
                refresh_kpisce_table();

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

$('#kpisce_filter_kpi').on('change', function () {
    refresh_kpisce_table();
});
$('#kpisce_filter_source').on('change', function () {
    refresh_kpisce_table();
});

function refresh_kpisce_table() {

    let filter_kpi = encodeURIComponent($("#kpisce_filter_kpi").val());
    let filter_source = encodeURIComponent($("#kpisce_filter_source").val());

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');

            $("#kpisce_filter_kpi").prop("disabled", true);
            $("#kpisce_filter_source").prop("disabled", true);

            $("#kpisce_add_new_row").prop("disabled", true);
            $("#kpisce_save_new_rows").prop("disabled", true);
            $("#kpisce_cancel_new_rows").prop("disabled", true);
            $("#kpisce_refresh_rows").prop("disabled", true);
            $("#kpisce_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#kpisce_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/KPIScenario/RefreshTable?filter_kpi=" + filter_kpi + "&filter_source=" + filter_source,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#kpisce_filter_kpi").prop("disabled", false);
            $("#kpisce_filter_source").prop("disabled", false);

            $("#kpisce_add_new_row").prop("disabled", false);
            $("#kpisce_save_new_rows").prop("disabled", false);
            $("#kpisce_cancel_new_rows").prop("disabled", false);
            $("#kpisce_refresh_rows").prop("disabled", false);
            $("#kpisce_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#kpisce_rows_list').html("");
            $('#kpisce_rows_list').removeAttr("style");
            let columns = '';

            if (myList.CollectionA.length != 0) {
                $.each(myList.CollectionA, function (indexi, valueA) {

                    columns += '<tr>';

                    columns += '<th scope="row" id="row_kpisce_' + (indexi + 1) + '_id" data-value="' + valueA["IdScenario"] + '" style="display: none;"></th>';
                    columns += '<td style="padding: 2px;">';
                    columns += '<select type="select" id="row_kpisce_' + (indexi + 1) + '_kpi" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';

                    $.each(myList.CollectionB, function (indexj, valueB) {

                        if (valueA["IdKPI"] == valueB["Id"]) {
                            columns += '<option value="' + valueB["Id"] + '" selected="selected">' + (window.language_short == "es" ? valueB["KPINameEs"] : valueB["KPINameEn"]) + '</option>';
                        }
                        else {
                            columns += '<option value="' + valueB["Id"] + '">' + (window.language_short == "es" ? valueB["KPINameEs"] : valueB["KPINameEn"]) + '</option>';
                        }

                    });

                    columns += '</select>';
                    columns += '</td>';

                    columns += '<td style="padding: 2px;">';
                    columns += '<select type="select" id="row_kpisce_' + (indexi + 1) + '_source" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';
                    $.each(myList.CollectionC, function (indexk, valueC) {

                        if (valueA["IdSource"] == valueC["Id"]) {
                            columns += '<option value="' + valueC["Id"] + '" selected="selected">' + valueC["SourceName"] + '</option>';
                        }
                        else {
                            columns += '<option value="' + valueC["Id"] + '">' + valueC["SourceName"] + '</option>';
                        }

                    });

                    columns += '</select>';
                    columns += '</td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_table_name" type="text" class="form-control" value="' + valueA["TableName"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_column_name_date" type="text" class="form-control" value="' + valueA["ColumnNameDate"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_column_name_shift" type="text" class="form-control" value="' + valueA["ColumnNameShift"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_column_name_value" type="text" class="form-control" style="width: 80%;" value="' + valueA["ColumnNameValue"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_filter_additional" type="text" class="form-control" style="width: 90px;" value="' + valueA["FilterAdditional"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_parameters" type="text" class="form-control" style="width: 90px;" value="' + valueA["Parameters"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;">';
                    columns += '<div class="input-group">';
                    columns += '<button type="button" id="row_kpisce_btn_' + (indexi + 1) + '_edr" onClick="edit_kpisce_row(' + (indexi + 1) + ')" data-toggle="modal" data-target="#Modal_edit_KPI_Scenario" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    columns += '<button type="button" id="row_kpisce_btn_' + (indexi + 1) + '_der" onClick="delete_kpisce_row(\'' + valueA["TableName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    columns += '</div>';
                    columns += '</td>';

                    columns += '</tr>';


                });
            }
            

            // Row hidden

            columns += '<tr id="kpisce_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_kpisce_new_id" style="display: none;">-</th>';
            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_kpisce_new_kpi" class="custom-select">';

            $.each(myList.CollectionB, function (indexj, valueB) {

                columns += '<option value="' + valueB["Id"] + '">' + (window.language_short == "es" ? valueB["KPINameEs"] : valueB["KPINameEn"]) + '</option>';
                
            });

            columns += '</select>';
            columns += '</td>';
            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_kpisce_new_source" class="custom-select">';
            $.each(myList.CollectionC, function (indexk, valueC) {

                columns += '<option value="' + valueC["Id"] + '">' + valueC["SourceName"] + '</option>';
                
            });

            columns += '</select>';
            columns += '</td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_table_name" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_column_name_date" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_column_name_shift" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_column_name_value" type="text" class="form-control" style="width: 80%;"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_filter_additional" type="text" class="form-control" style="width: 90px;"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_parameters" type="text" class="form-control" style="width: 90px;"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#kpisce_rows_list").append(columns);
            count_kpisce_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}

$('#kpisce_list_add_edit_source').click(function () {

    refresh_source_list("source");

});

function refresh_source_list(tipo) {
    
    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');
            $("#data_loading_source").css({ "display": "block", "margin": "auto" });
            $("#data_list_source").css({ "display": "none" });

        },
        url: "/KPIScenario/RefreshList?type=" + tipo,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);
            let rowsA = '';
            let rowsB = '';

            if (tipo == "source") {

                $('#kpisce_list_add_source').html("");
                $('#kpisce_list_edit_source').html("");
                $("#kpisce_filter_source").find('option').remove();
                $('#kpisce_filter_source').append($('<option>', { value: 'All', text: 'Todos' }));
                
                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + (indexi + 1) + '. ' + valueA["SourceName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_source_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_source_' + (indexi + 1) + '_name" type="text" class="form-control custom-input" value="' + valueA["SourceName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_edr" onClick="edit_source_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_source_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_source_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_der" onClick="delete_source_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>'; 

                    $('#kpisce_filter_source').append($('<option>', { value: valueA["Id"], text: valueA["SourceName"] }));

                });

                $('#kpisce_list_add_source').append(rowsA);
                $('#kpisce_list_edit_source').append(rowsB);

                $("#data_loading_source").css({ "display": "none", "margin": "auto" });
                $("#data_list_source").css({ "display": "block" });

            } else {
                /*
                $('#kpisce_list_add_source').html("");
                $('#kpisce_list_edit_source').html("");
                $("#kpisce_filter_source").find('option').remove();
                $('#kpisce_filter_source').append($('<option>', { value: 'All', text: 'Todos' }));

                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + valueA["Id"] + '. ' + valueA["CategoryName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_source_' + (indexi + 1) + '_kpi" data-value="' + valueA["Id"] + '">' + valueA["Id"] + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_source_' + (indexi + 1) + '_table_name" type="text" class="form-control custom-input" value="' + valueA["CategoryName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_edr" onClick="editcatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_rcr" onClick="realizarcambioscatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_ccr" onClick="cancelarcambiocatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_der" onClick="deletecatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>';

                    $('#kpisce_filter_source').append($('<option>', { value: valueA["Id"], text: valueA["CategoryName"] }));

                });

                $('#kpisce_list_add_source').append(rowsA);
                $('#kpisce_list_edit_source').append(rowsB);

                $("#data_loading_source").css({ "display": "none", "margin": "auto" });
                $("#data_list_source").css({ "display": "block" });
                */
            }

        }
    });
    

}


function btn_kpisce_source_add_new() {

    $("#btn_kpisce_source_add_new").prop("disabled", true);
    $("#kpisce_source_add_new").prop("readonly", true);
    //$("#kpisce_scenario_en_add_new").prop("readonly", true);

    let source_name = encodeURIComponent($("#kpisce_source_name_add_new").val());
    
    $.ajax({
        beforeSend: function () {
            
            $("#btn_kpisce_source_add_new").html("Añadiendo...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        url: "/KPIScenario/SaveNewItem?source_name=" + source_name + "&type=source",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#btn_kpisce_source_add_new").html("Añadir");
            $("#btn_kpisce_source_add_new").prop("disabled", false);
            $("#kpisce_source_add_new").prop("readonly", false);

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            $("#kpisce_source_add_new").val("");
            refresh_source_list("source");

        }
    });

}

// modals edit and cancel

function edit_source_row(id_row) {
    $("#row_source_" + id_row + "_name").prop("disabled", false);

    $("#row_kpisce_btn_source_" + id_row + "_edr").css({ "display": "none" });
    $("#row_kpisce_btn_source_" + id_row + "_der").css({ "display": "none" });
    $("#row_kpisce_btn_source_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_kpisce_btn_source_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_kpisce_btn_source_" + id_row + "_rcr").data("actived", 1);
    $("#row_kpisce_btn_source_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_source_row(id_row) {
    $("#row_source_" + id_row + "_name").prop("disabled", true);

    $("#row_kpisce_btn_source_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_kpisce_btn_source_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_kpisce_btn_source_" + id_row + "_edr").css({ "display": "block" });
    $("#row_kpisce_btn_source_" + id_row + "_der").css({ "display": "block" });

    $("#row_kpisce_btn_source_" + id_row + "_rcr").data("actived", 0);
    $("#row_kpisce_btn_source_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_source_row(id_row) {

    let rcr_actived = $("#row_kpisce_btn_source_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_source = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_source_" + id_row + "_id").data("value"));
    obj['Name'] = $("#row_source_" + id_row + "_name").val();
    obj['Type'] = "source";

    data_source.push(obj);

    $.ajax({
        beforeSend: function () {

            // deshabilitar entradas
            $("#row_source_" + id_row + "_name").prop("disabled", true);

            $("#row_kpisce_btn_source_" + id_row + "_edr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_ccr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_der").prop("disabled", false);
            
            $("#row_kpisce_btn_source_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_source },
        url: "/KPIScenario/SaveChangesSource",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_kpisce_btn_source_" + id_row + "_edr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_ccr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_der").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_source_row(id_row);
            refresh_source_list("source");

        }
    });

}

function delete_source_row(id_row) {

    let rcr_actived = $("#row_kpisce_btn_source_" + id_row + "_der").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    let id = encodeURIComponent($("#row_source_" + id_row + "_id").data("value"));

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#row_kpisce_btn_source_" + id_row + "_edr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_ccr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_der").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
        },
        url: "/KPIScenario/DeleteSource?id=" + id + "&type=source",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_kpisce_btn_source_" + id_row + "_edr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_ccr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_der").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_source_row(id_row);
            refresh_source_list("source");

        }
    });

}


$('#kpisce_add_new_row').click(function () {

    refresh_modal_select_list();

});

function refresh_modal_select_list() {

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');
            $("#data_loading_add_kpisce").css({ "display": "block", "margin": "auto" });
            $("#data_list_add_kpisce").css({ "display": "none" });

        },
        url: "/KPIScenario/RefreshSelectKPIList",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#kpisce_select_modal_add_kpi").find('option').remove();
            $('#kpisce_select_modal_add_kpi').append($('<option>', { value: '-', text: 'Seleccionar' }));
            $("#kpisce_select_modal_add_source").find('option').remove();
            $('#kpisce_select_modal_add_source').append($('<option>', { value: '-', text: 'Seleccionar' }));

            $.each(myList.CollectionA, function (indexi, valueA) {
                
                $('#kpisce_select_modal_add_kpi').append($('<option>', { value: valueA["Id"], text: valueA["CategoryName"] + ': ' + (window.language_short == "es" ? valueA["DescriptionEs"] : valueA["DescriptionEn"]) }));

            });
            $.each(myList.CollectionB, function (indexi, valueB) {

                $('#kpisce_select_modal_add_source').append($('<option>', { value: valueB["Id"], text: valueB["SourceName"] }));

            });

            $("#data_loading_add_kpisce").css({ "display": "none", "margin": "auto" });
            $("#data_list_add_kpisce").css({ "display": "flex" });

        }
    });


}



function kpisce_btn_modal_add() {

    var attibutevalue = $("#Modal_add_KPI_Scenario").attr('aria-hidden');

    if (typeof attibutevalue !== 'undefined' && attibutevalue !== false) {
        return;
    }

    var datas_kpisce = [];
    var obj = {};

    if ($("#kpisce_select_modal_add_kpi").val() == '-') {
        toastr.error("Debe seleccionar un valor", "Error", { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
        return;
    }
    if ($("#kpisce_select_modal_add_source").val() == '-') {
        toastr.error("Debe seleccionar un valor", "Error", { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
        return;
    }
    
    obj['kpisce_kpi'] = encodeURIComponent($("#kpisce_select_modal_add_kpi").val());
    obj['kpisce_source'] = encodeURIComponent($("#kpisce_select_modal_add_source").val());
    obj['kpisce_table_name'] = $("#kpisce_input_modal_add_tablename").val();
    obj['kpisce_column_name_date'] = $("#kpisce_input_modal_add_colnamedate").val();
    obj['kpisce_column_name_shift'] = $("#kpisce_input_modal_add_colnameshift").val();
    obj['kpisce_column_name_value'] = $("#kpisce_input_modal_add_colnamevalue").val();
    obj['kpisce_filter_additional'] = $("#kpisce_input_modal_add_filteradd").val();
    obj['kpisce_parameters'] = $("#kpisce_input_modal_add_parameters").val();

    datas_kpisce.push(obj);

    $.ajax({
        beforeSend: function () {
            
            $("#kpisce_select_modal_add_kpi").prop("disabled", true);
            $("#kpisce_select_modal_add_source").prop("disabled", true);
            $("#kpisce_input_modal_add_tablename").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_add_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamevalue").prop("disabled", true);
            $("#kpisce_input_modal_add_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_add_parameters").prop("disabled", true);

            $("#kpisce_btn_modal_add").prop("disabled", true);
            $("#kpisce_btn_modal_add").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');

        },
        data: { 'NewKPIScenario': datas_kpisce },
        url: "/KPIScenario/SetNewKPIScenarios",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#kpisce_select_modal_add_kpi").prop("disabled", false);
            $("#kpisce_select_modal_add_source").prop("disabled", false);
            $("#kpisce_input_modal_add_tablename").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_add_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamevalue").prop("disabled", true);
            $("#kpisce_input_modal_add_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_add_parameters").prop("disabled", true);

            $("#kpisce_btn_modal_add").prop("disabled", false);
            $("#kpisce_btn_modal_add").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            $("#kpisce_select_modal_add_kpi").val("-");
            $("#kpisce_select_modal_add_source").val("-");
            $("#kpisce_input_modal_add_tablename").val("");
            $("#kpisce_input_modal_add_colnamedate").val("");
            $("#kpisce_input_modal_add_colnameshift").val("");
            $("#kpisce_input_modal_add_colnamevalue").val("");
            $("#kpisce_input_modal_add_filteradd").val("");
            $("#kpisce_input_modal_add_parameters").val("");

            $("#Modal_add_KPI_Scenario > div > div > div.modal-footer > button").trigger('click');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            refresh_kpisce_table();

        }
    });

}



// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let ua_verified = "";
// Write your JavaScript code.
$('#btn_go_login_basic').click(function () {

    $("#login_with_microsoft").css({ "display": "none" });
    $("#login_with_basic").css({ "display": "block" });

});

$('#btn_go_login_microsoft').click(function () {

    $("#login_with_basic").css({ "display": "none" });
    $("#login_with_microsoft").css({ "display": "block" });
    $('#login_with_microsoft').fadeIn();

    $("#section_login_email").css({ "display": "block" });
    $("#login_email_input").val("");
    $("#section_login_password").css({ "display": "none" });
    $("#login_password_input").val("");
    $("#section_login_new_password").css({ "display": "none" });
    $("#login_new_password").val("");
    $("#section_login_repeat_password").css({ "display": "none" });
    $("#login_repeat_new_password").val("");
    $("#login_error_message").css({ "display": "none" });
    $("#login_info_message").css({ "display": "none" });
    $("#login_error_message label").html("");
    $("#login_info_message label").html("");
    $("#section_keep_login").css({ "display": "none" });
    $("#login_keep_login").attr("checked", false)
    
    $("#btn_login_basic_account").prop("disabled", false);
    $("#btn_login_basic_account").html(window.login_basic_next);

    $("#btn_login_basic_account").data("steps", "1");
    $("#btn_login_basic_account").data("new-password", "0");

    $("#login_message_welcome").html("<div>" + window.login_basic_account_header_1 + "</div><span>" + window.login_basic_account_header_2 + "</span>");

});

$('#btn_login_basic_account').click(function () {

    let login_email = $("#login_email_input").val();
    let step_current = $("#btn_login_basic_account").data("steps");
    if (login_email == "") {
        return;
    }
    if (step_current != "1") {
        return;
    }

    $.ajax({
        beforeSend: function () {

            $("#btn_login_basic_account").prop("disabled", true);
            $("#btn_login_basic_account").html('<i class="fa fa-spinner fa-spin"></i>');
            
        },
        url: "/Login/VerifyAccount?acc=" + login_email,
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const data_resp = JSON.parse(resp);

            if (data_resp.Error === undefined) {
                if (data_resp.CollectionA.length != 0) {
                    if (data_resp.CollectionA[0].NewPassword == true) {
                        $("#btn_login_basic_account").prop("disabled", false);
                        $("#login_error_message").css({ "display": "none" });
                        $("#btn_login_basic_account").html(window.login_basic_register_btn);
                        $("#btn_login_basic_account").data("steps", "2");
                        $("#btn_login_basic_account").data("new-password", "1");

                        $("#section_login_email").css({ "display": "none" });
                        $("#section_login_new_password").css({ "display": "block" });
                        $("#section_login_repeat_password").css({ "display": "block" });

                        $("#login_message_welcome").html("<div>" + window.login_basic_account_header_3 + "</div><span>" + window.login_basic_account_header_4 + "</span>");

                    } else {
                        $("#btn_login_basic_account").prop("disabled", false);
                        $("#login_error_message").css({ "display": "none" });
                        $("#btn_login_basic_account").html(window.login_basic_login_btn);
                        $("#btn_login_basic_account").data("steps", "2");
                        $("#btn_login_basic_account").data("new-password", "0");

                        $("#section_login_email").css({ "display": "none" });
                        $("#section_login_password").css({ "display": "block" });
                        $("#section_keep_login").css({ "display": "block" });
                    }

                    ua_verified = data_resp.CollectionA[0].UserPrincipalName;
                    
                } else {
                    $("#login_error_message").css({ "display": "block" });
                    $("#login_error_message label").html(window.login_basic_user_not_found);
                    $("#login_email_input").prop("disabled", false);
                    $("#btn_login_basic_account").prop("disabled", false);
                    $("#btn_login_basic_account").html(window.login_basic_next_btn);
                }
            } else {
                if (data_resp.Error == true) {
                    $("#login_error_message").css({ "display": "block" });
                    $("#login_error_message label").html(data_resp.Message);
                    $("#login_email_input").prop("disabled", false);
                    $("#btn_login_basic_account").prop("disabled", false);
                    $("#btn_login_basic_account").html(window.login_basic_next_btn);
                }
            }

        }
    });

});



$('#btn_login_basic_account').click(function () {

    let step_current = $("#btn_login_basic_account").data("steps");
    if (step_current != "2") {
        return;
    }
    let new_password = $("#btn_login_basic_account").data("new-password");

    if (new_password == "1") {

        let new_password_input = $("#login_new_password").val();
        let repeat_password_input = $("#login_repeat_new_password").val();

        if (new_password_input != repeat_password_input) {
            $("#login_error_message").css({ "display": "block" });
            $("#login_error_message label").html(window.login_basic_password_not_match);
        } else {
            $("#login_error_message").css({ "display": "none" });
        }

        $.ajax({
            beforeSend: function () {

                $("#login_new_password").prop("disabled", true);
                $("#login_repeat_new_password").prop("disabled", true);
                $("#btn_login_basic_account").prop("disabled", true);
                $("#btn_login_basic_account").html('<i class="fa fa-spinner fa-spin"></i>');

            },
            url: "/Login/RegisterPasswordAccount?acc=" + ua_verified + "&pass=" + new_password_input,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                const data_resp = JSON.parse(resp);

                if (data_resp.Error === undefined) {
                    $("#login_info_message").css({ "display": "block" });
                    $("#login_info_message label").html(window.login_basic_message_label);
                    setTimeout(function () {
                        window.location.replace(location.protocol + '//' + location.host + '/Login');
                    }, 3000);
                } else {
                    if (data_resp.Error == true) {
                        $("#login_new_password").prop("disabled", false);
                        $("#login_repeat_new_password").prop("disabled", false);

                        $("#login_error_message").css({ "display": "block" });
                        $("#login_error_message label").html(data_resp.Message);
                        $("#login_email_input").prop("disabled", false);
                        $("#btn_login_basic_account").prop("disabled", false);
                        $("#btn_login_basic_account").html(window.login_basic_register_btn);
                    }
                }

            }
        });
    } else {

        let password_input = $("#login_password_input").val();
        let keep_input = $("#login_keep_login").attr("checked") ? 1 : 0;

        if (password_input == "") {
            $("#login_error_message").css({ "display": "block" });
            $("#login_error_message label").html(window.login_basic_enter_password);
            return;
        } 

        $.ajax({
            beforeSend: function () {

                $("#btn_login_basic_account").prop("disabled", true);
                $("#btn_login_basic_account").html('<i class="fa fa-spinner fa-spin"></i>');

            },
            url: "/Login/LoginAcount?acc=" + ua_verified + "&pass=" + password_input + "&keep=" + keep_input,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                const data_resp = JSON.parse(resp);

                if (data_resp.Error === undefined) {
                    window.location.replace(location.protocol + '//' + location.host + '/Home');
                } else {
                    if (data_resp.Error == true) {
                        $("#login_error_message").css({ "display": "block" });
                        $("#login_error_message label").html(data_resp.Message);
                        $("#login_email_input").prop("disabled", false);
                        $("#btn_login_basic_account").prop("disabled", false);
                        $("#btn_login_basic_account").html(window.login_basic_login_btn);
                    }
                }

            }
        });
    }

    

    

});







// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_modset_new = 0;
// Write your JavaScript code.
$('#modset_add_new_row').click(function () {

    let element = document.getElementById("modset_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_modset_new += 1;

    var row = '<tr id="new_row_' + count_modset_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_modset_new_id", "row_modset_new_id_" +  count_modset_new);
    row = row.replace("row_modset_new_module_es", "row_modset_new_module_es_" +  count_modset_new);
    row = row.replace("row_modset_new_module_en", "row_modset_new_module_en_" +  count_modset_new);
    $("#modset_rows_list tr:first").before(row);

});

$('#modset_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_modset_new = 0;
    return false;
});

$('#modset_save_new_rows').click(function () {

    if (count_modset_new == 0) {
        return;
    }

    $("#modset_add_new_row").prop("disabled", true);
    $("#modset_save_new_rows").prop("disabled", true);
    $("#modset_cancel_new_rows").prop("disabled", true);
    $("#modset_refresh_rows").prop("disabled", true);
    $("#modset_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var modset_new_count = $("th[id^='row_modset_new_id_']");
    var datas_modset = [];

    for (var i = 1; i <= modset_new_count.length; i++) {

        var obj = {};

        obj['modset_module_es'] = $("#row_modset_new_module_es_" +  i).val();
        obj['modset_module_en'] = $("#row_modset_new_module_en_" +  i).val();

        datas_modset.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factmodset_compatibility").attr('disabled', 'disabled');
            $('#modset_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
        },
        data: { 'NewModule': datas_modset },
        url: "/Module/SetNewModule",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#modset_add_new_row").prop("disabled", false);
            $("#modset_save_new_rows").prop("disabled", false);
            $("#modset_cancel_new_rows").prop("disabled", false);
            $("#modset_refresh_rows").prop("disabled", false);
            $("#modset_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_modset_new = 0;
            refresh_modset_table();

        }
    });

});


function edit_modset_row(id_row) {

    $("#row_modset_" +  id_row + "_module_es").prop("disabled", false);
    $("#row_modset_" +  id_row + "_module_en").prop("disabled", false);
    $("#row_modset_" +  id_row + "_status").prop("disabled", false);

    $("#row_modset_btn_" +  id_row + "_edr").css({ "display": "none" });
    $("#row_modset_btn_" +  id_row + "_der").css({ "display": "none" });
    $("#row_modset_btn_" +  id_row + "_rcr").css({ "display": "block" });
    $("#row_modset_btn_" +  id_row + "_ccr").css({ "display": "block" });

    $("#row_modset_btn_" +  id_row + "_rcr").data("actived", 1);
    $("#row_modset_btn_" +  id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_modset_row(id_row) {

    $("#row_modset_" +  id_row + "_module_es").prop("disabled", true);
    $("#row_modset_" +  id_row + "_module_en").prop("disabled", true);
    $("#row_modset_" +  id_row + "_status").prop("disabled", true);

    $("#row_modset_btn_" +  id_row + "_rcr").css({ "display": "none" });
    $("#row_modset_btn_" +  id_row + "_ccr").css({ "display": "none" });
    $("#row_modset_btn_" +  id_row + "_edr").css({ "display": "block" });
    $("#row_modset_btn_" +  id_row + "_der").css({ "display": "block" });

    $("#row_modset_btn_" +  id_row + "_rcr").data("actived", 0);
    $("#row_modset_btn_" +  id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_modset_row(id_row) {

    let rcr_actived = $("#row_modset_btn_" +  id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_modset = [];
    var obj = {};

    obj['modset_id'] = encodeURIComponent($("#row_modset_" +  id_row + "_id").data("value"));
    obj['modset_module_es'] = $("#row_modset_" +  id_row + "_module_es").val();
    obj['modset_module_en'] = $("#row_modset_" +  id_row + "_module_en").val();
    obj['modset_status'] = $("#row_modset_" +  id_row + "_status").attr("checked") ? 1 : 0;
    
    data_edit_modset.push(obj);

    $.ajax({
        beforeSend: function () {
            
            // deshabilitar botones
            $("#modset_add_new_row").prop("disabled", true);
            $("#modset_save_new_rows").prop("disabled", true);
            $("#modset_cancel_new_rows").prop("disabled", true);
            $("#modset_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_modset_" +  id_row + "_module_es").prop("disabled", true);
            $("#row_modset_" +  id_row + "_module_en").prop("disabled", true);

            $("#row_modset_btn_" +  id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeModule': data_edit_modset },
        url: "/Module/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#modset_add_new_row").prop("disabled", false);
            $("#modset_save_new_rows").prop("disabled", false);
            $("#modset_cancel_new_rows").prop("disabled", false);
            $("#modset_refresh_rows").prop("disabled", false);

            $("#row_modset_btn_" +  id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_modset_row(id_row);
            refresh_modset_table();

        }
    });

}

function delete_modset_row(delete_body_message_var1, delete_body_message_var2, id_row) {

    let modset_id = encodeURIComponent($("#row_modset_" +  id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var1 + "<br />" + delete_body_message_var2 + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');
    
        $.ajax({
            beforeSend: function () {
                // deshabilitar botones
                $("#modset_add_new_row").prop("disabled", true);
                $("#modset_save_new_rows").prop("disabled", true);
                $("#modset_cancel_new_rows").prop("disabled", true);
                $("#modset_refresh_rows").prop("disabled", true);

                $("#row_modset_btn_" +  id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/Module/DeleteModule?modset_id=" + modset_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#modset_add_new_row").prop("disabled", false);
                $("#modset_save_new_rows").prop("disabled", false);
                $("#modset_cancel_new_rows").prop("disabled", false);
                $("#modset_refresh_rows").prop("disabled", false);

                $("#row_modset_btn_" +  id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_modset_row(id_row);
                refresh_modset_table();
                
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

function refresh_modset_table() {

    $.ajax({
        beforeSend: function () {

            $("#modset_add_new_row").prop("disabled", true);
            $("#modset_save_new_rows").prop("disabled", true);
            $("#modset_cancel_new_rows").prop("disabled", true);
            $("#modset_refresh_rows").prop("disabled", true);
            $("#modset_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#modset_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/Module/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#modset_add_new_row").prop("disabled", false);
            $("#modset_save_new_rows").prop("disabled", false);
            $("#modset_cancel_new_rows").prop("disabled", false);
            $("#modset_refresh_rows").prop("disabled", false);
            $("#modset_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#modset_rows_list').html("");
            $('#modset_rows_list').removeAttr("style");
            let columns = '';
            let status_var = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                status_var = (valueA["Status"] == true ? 'checked="checked"' : '');

                columns += '<tr>';

                columns += '<th scope="row" id="row_modset_' + (indexi + 1) + '_id" data-value="' + valueA["IdModule"] + '">' + (indexi + 1) + '</th>';
                columns += '<td><input id="row_modset_' + (indexi + 1) + '_module_es" type="text" class="form-control" value="' + valueA["ModuleName_ES"] + '" disabled="disabled"></td>';
                columns += '<td><input id="row_modset_' + (indexi + 1) + '_module_en" type="text" class="form-control" value="' + valueA["ModuleName_EN"] + '" disabled="disabled"></td>';

                columns += '<td>';
                columns += '<label class="switch" style="margin: 0">';
                columns += '<input type="checkbox" id="row_modset_' + (indexi + 1) + '_status" ' + status_var + ' disabled="disabled">';
                columns += '<span class="slider round"></span>';
                columns += '</label>';
                columns += '</td>';

                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_modset_btn_' + (indexi + 1) + '_edr" onClick="edit_modset_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_modset_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_modset_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_modset_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_modset_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_modset_btn_' + (indexi + 1) + '_der" onClick="delete_modset_row(\'' + valueA["ModuleName_ES"] + '\',\'' + valueA["ModuleName_EN"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 


            });

            // Row hidden

            columns += '<tr id="modset_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_modset_new_id">-</th>';
            columns += '<td><input id="row_modset_new_module_es" type="text" class="form-control"></td>';
            columns += '<td><input id="row_modset_new_module_en" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';
            columns += '<td style="padding: 2px;"></td>';
            columns += '</tr>'; 

            $("#modset_rows_list").append(columns);
            count_modset_new = 0;
            
            /*
            $("#btn_general_table_data_" +  id).prop("disabled", false);
            $("#btn_general_table_data_" +  id).html("Press to test");
            */

        }
    });

}








// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_oper_new = 0;
// Write your JavaScript code.
$('#oper_add_new_row').click(function () {

    let element = document.getElementById("oper_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_oper_new += 1;

    var row = '<tr id="new_row_' + count_oper_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_oper_new_id", "row_oper_new_id_" + count_oper_new);
    row = row.replace("row_oper_new_name", "row_oper_new_name_" + count_oper_new);
    row = row.replace("row_oper_new_country", "row_oper_new_country_" + count_oper_new);
    row = row.replace("row_oper_new_region", "row_oper_new_region_" + count_oper_new);
    $("#oper_rows_list tr:first").before(row);

});

$('#oper_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_oper_new = 0;
    return false;
});

$('#oper_save_new_rows').click(function () {

    if (count_oper_new == 0) {
        return;
    }

    $("#oper_add_new_row").prop("disabled", true);
    $("#oper_save_new_rows").prop("disabled", true);
    $("#oper_cancel_new_rows").prop("disabled", true);
    $("#oper_refresh_rows").prop("disabled", true);
    $("#oper_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var oper_new_count = $("th[id^='row_oper_new_id_']");
    var datas_oper = [];

    for (var i = 1; i <= oper_new_count.length; i++) {

        var obj = {};

        obj['oper_name'] = $("#row_oper_new_name_" + i).val();
        obj['oper_country'] = $("#row_oper_new_country_" + i).val();
        obj['oper_region'] = $("#row_oper_new_region_" + i).val();

        datas_oper.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factoper_compatibility").attr('disabled', 'disabled');
            $('#oper_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewOperation': datas_oper },
        url: "/Operation/SetNewOperations",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#oper_add_new_row").prop("disabled", false);
            $("#oper_save_new_rows").prop("disabled", false);
            $("#oper_cancel_new_rows").prop("disabled", false);
            $("#oper_refresh_rows").prop("disabled", false);
            $("#oper_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_oper_new = 0;
            refresh_oper_table();

        }
    });

});


function edit_oper_row(id_row) {
    $("#row_oper_" + id_row + "_name").prop("disabled", false);
    $("#row_oper_" + id_row + "_country").prop("disabled", false);
    $("#row_oper_" + id_row + "_region").prop("disabled", false);

    $("#row_oper_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_oper_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_oper_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_oper_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_oper_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_oper_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_oper_row(id_row) {

    $("#row_oper_" + id_row + "_name").prop("disabled", true);
    $("#row_oper_" + id_row + "_country").prop("disabled", true);
    $("#row_oper_" + id_row + "_region").prop("disabled", true);

    $("#row_oper_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_oper_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_oper_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_oper_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_oper_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_oper_btn_" + id_row + "_ccr").data("actived", 0);

}

function realizar_cambios_oper_row(id_row) {

    let rcr_actived = $("#row_oper_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_oper = [];
    var obj = {};

    obj['oper_id'] = encodeURIComponent($("#row_oper_" + id_row + "_id").data("value"));
    obj['oper_name'] = $("#row_oper_" + id_row + "_name").val();
    obj['oper_country'] = $("#row_oper_" + id_row + "_country").val();
    obj['oper_region'] = $("#row_oper_" + id_row + "_region").val();

    data_edit_oper.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factoper_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#oper_add_new_row").prop("disabled", true);
            $("#oper_save_new_rows").prop("disabled", true);
            $("#oper_cancel_new_rows").prop("disabled", true);
            $("#oper_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_oper_" + id_row + "_model").prop("disabled", true);
            $("#row_oper_" + id_row + "_model").css({ "background-color": "#e9ecef" });
            $("#row_oper_" + id_row + "_name").prop("disabled", true);
            $("#row_oper_" + id_row + "_country").prop("disabled", true);
            $("#row_oper_" + id_row + "_region").prop("disabled", true);

            $("#row_oper_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeOperation': data_edit_oper },
        url: "/Operation/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#oper_add_new_row").prop("disabled", false);
            $("#oper_save_new_rows").prop("disabled", false);
            $("#oper_cancel_new_rows").prop("disabled", false);
            $("#oper_refresh_rows").prop("disabled", false);

            $("#row_oper_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_oper_row(id_row);
            //refresh_oper_table();

        }
    });

}

function delete_oper_row(delete_body_message_var, id_row) {

    let oper_id = encodeURIComponent($("#row_oper_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factoper_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#oper_add_new_row").prop("disabled", true);
                $("#oper_save_new_rows").prop("disabled", true);
                $("#oper_cancel_new_rows").prop("disabled", true);
                $("#oper_refresh_rows").prop("disabled", true);

                $("#row_oper_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/Operation/DeleteOperation?oper_id=" + oper_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#oper_add_new_row").prop("disabled", false);
                $("#oper_save_new_rows").prop("disabled", false);
                $("#oper_cancel_new_rows").prop("disabled", false);
                $("#oper_refresh_rows").prop("disabled", false);

                $("#row_oper_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_oper_row(id_row);
                refresh_oper_table();

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

function refresh_oper_table() {

    $.ajax({
        beforeSend: function () {
            //$("#factoper_compatibility").attr('disabled', 'disabled');

            $("#oper_add_new_row").prop("disabled", true);
            $("#oper_save_new_rows").prop("disabled", true);
            $("#oper_cancel_new_rows").prop("disabled", true);
            $("#oper_refresh_rows").prop("disabled", true);
            $("#oper_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#oper_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/Operation/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#oper_add_new_row").prop("disabled", false);
            $("#oper_save_new_rows").prop("disabled", false);
            $("#oper_cancel_new_rows").prop("disabled", false);
            $("#oper_refresh_rows").prop("disabled", false);
            $("#oper_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#oper_rows_list').html("");
            $('#oper_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_oper_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;"><input id="row_oper_' + (indexi + 1) + '_name" type="text" class="form-control" value="' + valueA["OperationName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_oper_' + (indexi + 1) + '_country" type="text" class="form-control" value="' + valueA["Country"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_oper_' + (indexi + 1) + '_region" type="text" class="form-control" value="' + valueA["Region"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_oper_btn_' + (indexi + 1) + '_edr" onClick="edit_oper_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_oper_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_oper_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_oper_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_oper_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_oper_btn_' + (indexi + 1) + '_der" onClick="delete_oper_row(\'' + valueA["OperationName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 

            });

            // Row hidden

            columns += '<tr id="oper_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_oper_new_id">-</th>';
            columns += '<td style="padding: 2px;"><input id="row_oper_new_name" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_oper_new_country" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_oper_new_region" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#oper_rows_list").append(columns);
            count_oper_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}







// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_per_new = 0;
// Write your JavaScript code.
$('#per_add_new_row').click(function () {

    let element = document.getElementById("per_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_per_new += 1;

    var row = '<tr id="new_row_' + count_per_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_per_new_id", "row_per_new_id_" + count_per_new);
    row = row.replace("row_per_new_name", "row_per_new_name_" + count_per_new);
    row = row.replace("row_per_new_des", "row_per_new_des_" + count_per_new);
    $("#per_rows_list tr:first").before(row);

});

$('#per_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_per_new = 0;
    return false;
});

$('#per_save_new_rows').click(function () {

    if (count_per_new == 0) {
        return;
    }

    $("#per_add_new_row").prop("disabled", true);
    $("#per_save_new_rows").prop("disabled", true);
    $("#per_cancel_new_rows").prop("disabled", true);
    $("#per_refresh_rows").prop("disabled", true);
    $("#per_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var per_new_count = $("th[id^='row_per_new_id_']");
    var datas_per = [];

    for (var i = 1; i <= per_new_count.length; i++) {

        var obj = {};

        obj['per_name'] = $("#row_per_new_name_" + i).val();
        obj['per_des'] = $("#row_per_new_des_" + i).val();

        datas_per.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factper_compatibility").attr('disabled', 'disabled');
            $('#per_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewPeriod': datas_per },
        url: "/Period/SetNewPeriods",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#per_add_new_row").prop("disabled", false);
            $("#per_save_new_rows").prop("disabled", false);
            $("#per_cancel_new_rows").prop("disabled", false);
            $("#per_refresh_rows").prop("disabled", false);
            $("#per_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_per_new = 0;
            refresh_per_table();

        }
    });

});


function edit_per_row(id_row) {

    $("#row_per_" + id_row + "_name").prop("disabled", false);
    $("#row_per_" + id_row + "_des").prop("disabled", false);

    $("#row_per_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_per_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_per_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_per_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_per_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_per_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_per_row(id_row) {

    $("#row_per_" + id_row + "_name").prop("disabled", true);
    $("#row_per_" + id_row + "_des").prop("disabled", true);

    $("#row_per_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_per_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_per_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_per_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_per_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_per_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_per_row(id_row) {

    let rcr_actived = $("#row_per_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_per = [];
    var obj = {};

    obj['per_id'] = encodeURIComponent($("#row_per_" + id_row + "_id").data("value"));
    obj['per_name'] = $("#row_per_" + id_row + "_name").val();
    obj['per_des'] = $("#row_per_" + id_row + "_des").val();

    data_edit_per.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factper_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#per_add_new_row").prop("disabled", true);
            $("#per_save_new_rows").prop("disabled", true);
            $("#per_cancel_new_rows").prop("disabled", true);
            $("#per_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_per_" + id_row + "_name").prop("disabled", true);
            $("#row_per_" + id_row + "_des").prop("disabled", true);

            $("#row_per_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangePeriod': data_edit_per },
        url: "/Period/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#per_add_new_row").prop("disabled", false);
            $("#per_save_new_rows").prop("disabled", false);
            $("#per_cancel_new_rows").prop("disabled", false);
            $("#per_refresh_rows").prop("disabled", false);

            $("#row_per_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_per_row(id_row);
            //refresh_per_table();

        }
    });

}

function delete_per_row(delete_body_message_var, id_row) {

    let per_id = encodeURIComponent($("#row_per_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factper_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#per_add_new_row").prop("disabled", true);
                $("#per_save_new_rows").prop("disabled", true);
                $("#per_cancel_new_rows").prop("disabled", true);
                $("#per_refresh_rows").prop("disabled", true);

                $("#row_per_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/Period/DeletePeriod?per_id=" + per_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#per_add_new_row").prop("disabled", false);
                $("#per_save_new_rows").prop("disabled", false);
                $("#per_cancel_new_rows").prop("disabled", false);
                $("#per_refresh_rows").prop("disabled", false);

                $("#row_per_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_per_row(id_row);
                refresh_per_table();

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

function refresh_per_table() {

    $.ajax({
        beforeSend: function () {
            //$("#factper_compatibility").attr('disabled', 'disabled');

            $("#per_add_new_row").prop("disabled", true);
            $("#per_save_new_rows").prop("disabled", true);
            $("#per_cancel_new_rows").prop("disabled", true);
            $("#per_refresh_rows").prop("disabled", true);
            $("#per_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#per_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/Period/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#per_add_new_row").prop("disabled", false);
            $("#per_save_new_rows").prop("disabled", false);
            $("#per_cancel_new_rows").prop("disabled", false);
            $("#per_refresh_rows").prop("disabled", false);
            $("#per_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#per_rows_list').html("");
            $('#per_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_per_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;"><input id="row_per_' + (indexi + 1) + '_name" type="text" class="form-control" value="' + valueA["PeriodName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_per_' + (indexi + 1) + '_des" type="text" class="form-control" value="' + valueA["PeriodDescription"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_per_btn_' + (indexi + 1) + '_edr" onClick="edit_per_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_per_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_per_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_per_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_per_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_per_btn_' + (indexi + 1) + '_der" onClick="delete_per_row(\'' + valueA["PeriodName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 

            });

            // Row hidden

            columns += '<tr id="per_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_per_new_id">-</th>';
            columns += '<td style="padding: 2px;"><input id="row_per_new_name" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_per_new_des" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#per_rows_list").append(columns);
            count_per_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}







// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_proc_new = 0;
// Write your JavaScript code.
$('#proc_add_new_row').click(function () {

    let element = document.getElementById("proc_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_proc_new += 1;

    var row = '<tr id="new_row_' + count_proc_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_proc_new_id", "row_proc_new_id_" + count_proc_new);
    row = row.replace("row_proc_new_sarea", "row_proc_new_sarea_" + count_proc_new);
    row = row.replace("row_proc_new_name", "row_proc_new_name_" + count_proc_new);
    $("#proc_rows_list tr:first").before(row);

});

$('#proc_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_proc_new = 0;
    return false;
});

$('#proc_save_new_rows').click(function () {

    if (count_proc_new == 0) {
        return;
    }

    $("#proc_filter_sarea").prop("disabled", true);

    $("#proc_add_new_row").prop("disabled", true);
    $("#proc_save_new_rows").prop("disabled", true);
    $("#proc_cancel_new_rows").prop("disabled", true);
    $("#proc_refresh_rows").prop("disabled", true);
    $("#proc_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var proc_new_count = $("th[id^='row_proc_new_id_']");
    var datas_process = [];

    for (var i = 1; i <= proc_new_count.length; i++) {

        var obj = {};

        obj['proc_sarea'] = $("#row_proc_new_sarea_" + i).val();
        obj['proc_name'] = $("#row_proc_new_name_" + i).val();

        datas_process.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factproc_compatibility").attr('disabled', 'disabled');
            $('#proc_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewProcess': datas_process },
        url: "/Process/SetNewProcess",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#proc_filter_sarea").prop("disabled", false);

            $("#proc_add_new_row").prop("disabled", false);
            $("#proc_save_new_rows").prop("disabled", false);
            $("#proc_cancel_new_rows").prop("disabled", false);
            $("#proc_refresh_rows").prop("disabled", false);
            $("#proc_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_proc_new = 0;
            refresh_proc_table();

        }
    });

});


function edit_process_row(id_row) {
    $("#row_proc_" + id_row + "_sarea").prop("disabled", false);
    $("#row_proc_" + id_row + "_sarea").css({ "background-color": "#fff" });
    $("#row_proc_" + id_row + "_name").prop("disabled", false);

    $("#row_proc_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_proc_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_proc_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_proc_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_proc_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_proc_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_process_row(id_row) {

    $("#row_proc_" + id_row + "_sarea").prop("disabled", true);
    $("#row_proc_" + id_row + "_sarea").css({ "background-color": "#e9ecef" });
    $("#row_proc_" + id_row + "_name").prop("disabled", true);

    $("#row_proc_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_proc_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_proc_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_proc_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_proc_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_proc_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_process_row(id_row) {

    let rcr_actived = $("#row_proc_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_process = [];
    var obj = {};

    obj['proc_id'] = encodeURIComponent($("#row_proc_" + id_row + "_id").data("value"));
    obj['proc_sarea'] = encodeURIComponent($("#row_proc_" + id_row + "_sarea").val());
    obj['proc_name'] = $("#row_proc_" + id_row + "_name").val();

    data_edit_process.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factproc_compatibility").attr('disabled', 'disabled');

            // deshabilitar controles
            $("#proc_filter_sarea").prop("disabled", true);
            // deshabilitar botones
            $("#proc_add_new_row").prop("disabled", true);
            $("#proc_save_new_rows").prop("disabled", true);
            $("#proc_cancel_new_rows").prop("disabled", true);
            $("#proc_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_proc_" + id_row + "_sarea").prop("disabled", true);
            $("#row_proc_" + id_row + "_sarea").css({ "background-color": "#e9ecef" });
            $("#row_proc_" + id_row + "_name").prop("disabled", true);

            $("#row_proc_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeProcess': data_edit_process },
        url: "/Process/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#proc_filter_sarea").prop("disabled", false);

            $("#proc_add_new_row").prop("disabled", false);
            $("#proc_save_new_rows").prop("disabled", false);
            $("#proc_cancel_new_rows").prop("disabled", false);
            $("#proc_refresh_rows").prop("disabled", false);

            $("#row_proc_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_process_row(id_row);
            //refresh_proc_table();

        }
    });

}

function delete_process_row(delete_body_message_var, id_row) {

    let proc_id = encodeURIComponent($("#row_proc_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');
    
        $.ajax({
            beforeSend: function () {
                // deshabilitar controles
                $("#proc_filter_sarea").prop("disabled", true);
                // deshabilitar botones
                $("#proc_add_new_row").prop("disabled", true);
                $("#proc_save_new_rows").prop("disabled", true);
                $("#proc_cancel_new_rows").prop("disabled", true);
                $("#proc_refresh_rows").prop("disabled", true);

                $("#row_proc_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/Process/DeleteProcess?proc_id=" + proc_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#proc_filter_sarea").prop("disabled", false);

                $("#proc_add_new_row").prop("disabled", false);
                $("#proc_save_new_rows").prop("disabled", false);
                $("#proc_cancel_new_rows").prop("disabled", false);
                $("#proc_refresh_rows").prop("disabled", false);

                $("#row_proc_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_process_row(id_row);
                refresh_proc_table();

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

$('#proc_filter_sarea').on('change', function () {
    refresh_proc_table();
});

function refresh_proc_table() {

    let filter_sarea = encodeURIComponent($("#proc_filter_sarea").val());

    $.ajax({
        beforeSend: function () {
            //$("#factproc_compatibility").attr('disabled', 'disabled');

            $("#proc_filter_sarea").prop("disabled", true);

            $("#proc_add_new_row").prop("disabled", true);
            $("#proc_save_new_rows").prop("disabled", true);
            $("#proc_cancel_new_rows").prop("disabled", true);
            $("#proc_refresh_rows").prop("disabled", true);
            $("#proc_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#proc_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/Process/RefreshTable?filter_sarea=" + filter_sarea,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#proc_filter_sarea").prop("disabled", false);

            $("#proc_add_new_row").prop("disabled", false);
            $("#proc_save_new_rows").prop("disabled", false);
            $("#proc_cancel_new_rows").prop("disabled", false);
            $("#proc_refresh_rows").prop("disabled", false);
            $("#proc_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#proc_rows_list').html("");
            $('#proc_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';

                columns += '<th scope="row" id="row_proc_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;">';
                columns += '<select type="select" id="row_proc_' + (indexi + 1) + '_sarea" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';

                $.each(myList.CollectionB, function (indexj, valueB) {

                    if (valueA["IdSArea"] == valueB["Id"])
                    {
                        columns += '<option value="' + valueB["Id"] + '" selected="selected">' + valueB["AreaName"] + ': ' + valueB["SAreaName"] + '</option>';
                    }
                    else
                    {
                        columns += '<option value="' + valueB["Id"] + '">' + valueB["AreaName"] + ': ' + valueB["SAreaName"] + '</option>';
                    }

                });
                
                columns += '</select>';
                columns += '</td>';
                columns += '<td style="padding: 2px;"><input id="row_proc_' + (indexi + 1) + '_name" type="text" class="form-control" value="' + valueA["ProcessName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_proc_btn_' + (indexi + 1) + '_edr" onClick="edit_process_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_proc_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_process_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_proc_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_process_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_proc_btn_' + (indexi + 1) + '_der" onClick="delete_process_row(\'' + valueA["ProcessName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 


            });

            // Row hidden

            columns += '<tr id="proc_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_proc_new_id">-</th>';
            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_proc_new_sarea" class="custom-select">';

            $.each(myList.CollectionB, function (indexj, valueB) {

                columns += '<option value="' + valueB["Id"] + '">' + valueB["AreaName"] + ': ' + valueB["SAreaName"] + '</option>';
                
            });

            columns += '</select>';
            columns += '</td>';
            columns += '<td style="padding: 2px;"><input id="row_proc_new_name" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#proc_rows_list").append(columns);
            count_proc_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}


$('#proc_list_add_edit_sarea').click(function () {

    refresh_sarea_list("sarea");

});

function refresh_sarea_list(tipo) {
    
    $.ajax({
        beforeSend: function () {
            //$("#factproc_compatibility").attr('disabled', 'disabled');
            if (tipo == "sarea") {
                $("#data_loading_sarea").css({ "display": "block", "margin": "auto" });
                $("#data_list_sarea").css({ "display": "none" });
            } else {
                $("#data_loading_sarea").css({ "display": "block", "margin": "auto" });
                $("#data_list_sarea").css({ "display": "none" });
            }
        },
        url: "/Process/RefreshList?type=" + tipo,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);
            let rowsA = '';
            let rowsB = '';

            if (tipo == "sarea") {
                $('#proc_list_add_sarea').html("");
                $('#proc_list_edit_sarea').html("");
                $("#proc_filter_sarea").find('option').remove();
                $('#proc_filter_sarea').append($('<option>', { value: 'All', text: 'Todos' }));
                
                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + (indexi + 1) + '. ' + valueA["AreaName"] + ': ' + valueA["SAreaName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_sarea_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_area_' + (indexi + 1) + '_name" type="text" class="form-control custom-input" value="' + valueA["AreaName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;"><input id="row_sarea_' + (indexi + 1) + '_name" type="text" class="form-control custom-input" value="' + valueA["SAreaName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_proc_btn_sarea_' + (indexi + 1) + '_edr" onClick="edit_sarea_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_proc_btn_sarea_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_sarea_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_proc_btn_sarea_' + (indexi + 1) + '_ccr" onClick="cancelar_cambio_sarea_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_proc_btn_sarea_' + (indexi + 1) + '_der" onClick="delete_sarea_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>'; 

                    $('#proc_filter_sarea').append($('<option>', { value: valueA["Id"], text: valueA["AreaName"] + ': ' + valueA["SAreaName"]  }));

                });

                $('#proc_list_add_sarea').append(rowsA);
                $('#proc_list_edit_sarea').append(rowsB);

                $("#data_loading_sarea").css({ "display": "none", "margin": "auto" });
                $("#data_list_sarea").css({ "display": "block" });

            } else {
                /*
                $('#proc_list_add_cat').html("");
                $('#proc_list_edit_cat').html("");
                $("#proc_filter_cat").find('option').remove();
                $('#proc_filter_cat').append($('<option>', { value: 'All', text: 'Todos' }));

                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + valueA["Id"] + '. ' + valueA["CategoryName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_cat_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + valueA["Id"] + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_cat_' + (indexi + 1) + '_name" type="text" class="form-control custom-input" value="' + valueA["CategoryName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_proc_btn_cat_' + (indexi + 1) + '_edr" onClick="editcatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_proc_btn_cat_' + (indexi + 1) + '_rcr" onClick="realizarcambioscatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_proc_btn_cat_' + (indexi + 1) + '_ccr" onClick="cancelarcambiocatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_proc_btn_cat_' + (indexi + 1) + '_der" onClick="deletecatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>';

                    $('#proc_filter_cat').append($('<option>', { value: valueA["Id"], text: valueA["CategoryName"] }));

                });

                $('#proc_list_add_cat').append(rowsA);
                $('#proc_list_edit_cat').append(rowsB);

                $("#data_loading_cat").css({ "display": "none", "margin": "auto" });
                $("#data_list_cat").css({ "display": "block" });
                
                */

            }

        }
    });
    

}


function btn_proc_sarea_add_new() {

    $("#btn_proc_sarea_add_new").prop("disabled", true);
    $("#proc_area_name_add_new").prop("readonly", true);
    $("#proc_sarea_name_add_new").prop("readonly", true);

    let process_area_name = $("#proc_area_name_add_new").val();
    let process_sarea_name = $("#proc_sarea_name_add_new").val();
    
    $.ajax({
        beforeSend: function () {
            
            $("#btn_proc_sarea_add_new").html("Añadiendo...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        url: "/Process/SaveNewItem?area_name=" + process_area_name + "&sarea_name=" + process_sarea_name + "&type=sarea",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#btn_proc_sarea_add_new").html("Añadir");
            $("#btn_proc_sarea_add_new").prop("disabled", false);
            $("#proc_area_name_add_new").prop("readonly", false);
            $("#proc_sarea_name_add_new").prop("readonly", false);

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            $("#proc_area_name_add_new").val("");
            $("#proc_sarea_name_add_new").val("");
            refresh_sarea_list("sarea");

        }
    });

}

// sarea edit and cancel

function edit_sarea_row(id_row) {
    $("#row_area_" + id_row + "_name").prop("disabled", false);
    $("#row_sarea_" + id_row + "_name").prop("disabled", false);

    $("#row_proc_btn_sarea_" + id_row + "_edr").css({ "display": "none" });
    $("#row_proc_btn_sarea_" + id_row + "_der").css({ "display": "none" });
    $("#row_proc_btn_sarea_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_proc_btn_sarea_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_proc_btn_sarea_" + id_row + "_rcr").data("actived", 1);
    $("#row_proc_btn_sarea_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambio_sarea_row(id_row) {
    $("#row_area_" + id_row + "_name").prop("disabled", true);
    $("#row_sarea_" + id_row + "_name").prop("disabled", true);

    $("#row_proc_btn_sarea_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_proc_btn_sarea_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_proc_btn_sarea_" + id_row + "_edr").css({ "display": "block" });
    $("#row_proc_btn_sarea_" + id_row + "_der").css({ "display": "block" });

    $("#row_proc_btn_sarea_" + id_row + "_rcr").data("actived", 0);
    $("#row_proc_btn_sarea_" + id_row + "_ccr").data("actived", 0);

    
}

function realizar_cambios_sarea_row(id_row) {

    let rcr_actived = $("#row_proc_btn_sarea_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_sarea = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_sarea_" + id_row + "_id").data("value"));
    obj['area_name'] = $("#row_area_" + id_row + "_name").val();
    obj['sarea_name'] = $("#row_sarea_" + id_row + "_name").val();

    data_sarea.push(obj);

    $.ajax({
        beforeSend: function () {

            // deshabilitar entradas
            $("#row_area_" + id_row + "_name").prop("disabled", true);
            $("#row_sarea_" + id_row + "_name").prop("disabled", true);

            $("#row_proc_btn_sarea_" + id_row + "_edr").prop("disabled", false);
            $("#row_proc_btn_sarea_" + id_row + "_rcr").prop("disabled", false);
            $("#row_proc_btn_sarea_" + id_row + "_ccr").prop("disabled", false);
            $("#row_proc_btn_sarea_" + id_row + "_der").prop("disabled", false);
            
            $("#row_proc_btn_sarea_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_sarea },
        url: "/Process/SaveChangesSArea",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_proc_btn_sarea_" + id_row + "_edr").prop("disabled", true);
            $("#row_proc_btn_sarea_" + id_row + "_rcr").prop("disabled", true);
            $("#row_proc_btn_sarea_" + id_row + "_ccr").prop("disabled", true);
            $("#row_proc_btn_sarea_" + id_row + "_der").prop("disabled", true);
            $("#row_proc_btn_sarea_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambio_sarea_row(id_row);
            refresh_sarea_list("sarea");

        }
    });

}

function delete_sarea_row(id_row) {

    let id = encodeURIComponent($("#row_sarea_" + id_row + "_id").data("value"));

    $.ajax({
        beforeSend: function () {
            //$("#factproc_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#row_proc_btn_sarea_" + id_row + "_edr").prop("disabled", false);
            $("#row_proc_btn_sarea_" + id_row + "_rcr").prop("disabled", false);
            $("#row_proc_btn_sarea_" + id_row + "_ccr").prop("disabled", false);
            $("#row_proc_btn_sarea_" + id_row + "_der").prop("disabled", false);
            $("#row_proc_btn_sarea_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
        },
        url: "/Process/DeleteSArea?id=" + id + "&type=process",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_proc_btn_sarea_" + id_row + "_edr").prop("disabled", true);
            $("#row_proc_btn_sarea_" + id_row + "_rcr").prop("disabled", true);
            $("#row_proc_btn_sarea_" + id_row + "_ccr").prop("disabled", true);
            $("#row_proc_btn_sarea_" + id_row + "_der").prop("disabled", true);
            $("#row_proc_btn_sarea_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambio_sarea_row(id_row);
            refresh_sarea_list("sarea");

        }
    });

}







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



// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_rese_new = 0;
// Write your JavaScript code.
$('#rese_add_new_row').click(function () {

    let element = document.getElementById("rese_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_rese_new += 1;

    var row = '<tr id="new_row_' + count_rese_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_rese_new_id", "row_rese_new_id_" + count_rese_new);
    row = row.replace("row_rese_new_menu_name_en", "row_rese_new_menu_name_en_" + count_rese_new);
    row = row.replace("row_rese_new_menu_name_es", "row_rese_new_menu_name_es_" + count_rese_new);
    row = row.replace("row_rese_new_name_en", "row_rese_new_name_en_" + count_rese_new);
    row = row.replace("row_rese_new_url_en", "row_rese_new_url_en_" + count_rese_new);
    row = row.replace("row_rese_new_name_sp", "row_rese_new_name_sp_" + count_rese_new);
    row = row.replace("row_rese_new_url_sp", "row_rese_new_url_sp_" + count_rese_new);
    row = row.replace("row_rese_new_module", "row_rese_new_module_" + count_rese_new);
    $("#rese_rows_list tr:first").before(row);

});

$('#rese_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_rese_new = 0;
    return false;
});

$('#rese_save_new_rows').click(function () {

    if (count_rese_new == 0) {
        return;
    }

    $("#rese_add_new_row").prop("disabled", true);
    $("#rese_save_new_rows").prop("disabled", true);
    $("#rese_cancel_new_rows").prop("disabled", true);
    $("#rese_refresh_rows").prop("disabled", true);
    $("#rese_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var rese_new_count = $("th[id^='row_rese_new_id_']");
    var datas_rese = [];

    for (var i = 1; i <= rese_new_count.length; i++) {

        var obj = {};

        obj['rese_reportmenuenname'] = $("#row_rese_new_menu_name_en_" + i).val();
        obj['rese_reportmenuesname'] = $("#row_rese_new_menu_name_es_" + i).val();
        obj['rese_reportenname'] = $("#row_rese_new_name_en_" + i).val();
        obj['rese_reportenurl'] = $("#row_rese_new_url_en_" + i).val();
        obj['rese_reportesname'] = $("#row_rese_new_name_sp_" + i).val();
        obj['rese_reportesurl'] = $("#row_rese_new_url_sp_" + i).val();
        obj['rese_idmodule'] = $("#row_rese_new_module_" + i).val();

        datas_rese.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factrese_compatibility").attr('disabled', 'disabled');
            $('#rese_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewReportSetting': datas_rese },
        url: "/ReportSetting/SetNewReportSettings",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#rese_add_new_row").prop("disabled", false);
            $("#rese_save_new_rows").prop("disabled", false);
            $("#rese_cancel_new_rows").prop("disabled", false);
            $("#rese_refresh_rows").prop("disabled", false);
            $("#rese_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_rese_new = 0;
            //refresh_rese_table();
            window.location.reload();

        }
    });

});


function edit_rese_row(id_row) {

    $("#row_rese_" + id_row + "_menu_name_en").prop("disabled", false);
    $("#row_rese_" + id_row + "_menu_name_es").prop("disabled", false);
    $("#row_rese_" + id_row + "_name_en").prop("disabled", false);
    $("#row_rese_" + id_row + "_url_en").prop("disabled", false);
    $("#row_rese_" + id_row + "_name_sp").prop("disabled", false);
    $("#row_rese_" + id_row + "_url_sp").prop("disabled", false);
    $("#row_rese_" + id_row + "_module").prop("disabled", false);

    $("#row_rese_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_rese_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_rese_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_rese_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_rese_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_rese_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_rese_row(id_row) {

    $("#row_rese_" + id_row + "_menu_name_en").prop("disabled", true);
    $("#row_rese_" + id_row + "_menu_name_es").prop("disabled", true);
    $("#row_rese_" + id_row + "_name_en").prop("disabled", true);
    $("#row_rese_" + id_row + "_url_en").prop("disabled", true);
    $("#row_rese_" + id_row + "_name_sp").prop("disabled", true);
    $("#row_rese_" + id_row + "_url_sp").prop("disabled", true);
    $("#row_rese_" + id_row + "_module").prop("disabled", true);
    
    $("#row_rese_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_rese_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_rese_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_rese_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_rese_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_rese_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_rese_row(id_row) {

    let rcr_actived = $("#row_rese_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_rese = [];
    var obj = {};

    obj['rese_id'] = encodeURIComponent($("#row_rese_" + id_row + "_id").data("value"));
    obj['rese_reportmenuenname'] = $("#row_rese_" + id_row + "_menu_name_en").val();
    obj['rese_reportmenuesname'] = $("#row_rese_" + id_row + "_menu_name_es").val();
    obj['rese_reportenname'] = $("#row_rese_" + id_row + "_name_en").val();
    obj['rese_reportenurl'] = encodeURIComponent($("#row_rese_" + id_row + "_url_en").val());
    obj['rese_reportesname'] = $("#row_rese_" + id_row + "_name_sp").val();
    obj['rese_reportesurl'] = encodeURIComponent($("#row_rese_" + id_row + "_url_sp").val());
    obj['rese_idmodule'] = $("#row_rese_" + id_row + "_module").val();

    data_edit_rese.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factrese_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#rese_add_new_row").prop("disabled", true);
            $("#rese_save_new_rows").prop("disabled", true);
            $("#rese_cancel_new_rows").prop("disabled", true);
            $("#rese_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_rese_" + id_row + "_name").prop("disabled", true);

            $("#row_rese_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeReportSetting': data_edit_rese },
        url: "/ReportSetting/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#rese_add_new_row").prop("disabled", false);
            $("#rese_save_new_rows").prop("disabled", false);
            $("#rese_cancel_new_rows").prop("disabled", false);
            $("#rese_refresh_rows").prop("disabled", false);

            $("#row_rese_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_rese_row(id_row);
            //refresh_rese_table();
            window.location.reload();

        }
    });

}

function delete_rese_row(delete_body_message_var, id_row) {

    let rese_id = encodeURIComponent($("#row_rese_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factrese_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#rese_add_new_row").prop("disabled", true);
                $("#rese_save_new_rows").prop("disabled", true);
                $("#rese_cancel_new_rows").prop("disabled", true);
                $("#rese_refresh_rows").prop("disabled", true);

                $("#row_rese_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/ReportSetting/DeleteReportSetting?rese_id=" + rese_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#rese_add_new_row").prop("disabled", false);
                $("#rese_save_new_rows").prop("disabled", false);
                $("#rese_cancel_new_rows").prop("disabled", false);
                $("#rese_refresh_rows").prop("disabled", false);

                $("#row_rese_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_rese_row(id_row);
                //refresh_rese_table();
                window.location.reload();

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

function refresh_rese_table() {

    $.ajax({
        beforeSend: function () {
            //$("#factrese_compatibility").attr('disabled', 'disabled');

            $("#rese_add_new_row").prop("disabled", true);
            $("#rese_save_new_rows").prop("disabled", true);
            $("#rese_cancel_new_rows").prop("disabled", true);
            $("#rese_refresh_rows").prop("disabled", true);
            $("#rese_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#rese_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/ReportSetting/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#rese_add_new_row").prop("disabled", false);
            $("#rese_save_new_rows").prop("disabled", false);
            $("#rese_cancel_new_rows").prop("disabled", false);
            $("#rese_refresh_rows").prop("disabled", false);
            $("#rese_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#rese_rows_list').html("");
            $('#rese_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_rese_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;"><input id="row_rese_' + (indexi + 1) + '_menu_name_en" type="text" class="form-control" value="' + valueA["ReportEnMenuName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_rese_' + (indexi + 1) + '_menu_name_es" type="text" class="form-control" value="' + valueA["ReportEsMenuName"] + '" disabled="disabled"></td>';

                columns += '<td style="padding: 2px;"><input id="row_rese_' + (indexi + 1) + '_name_en" type="text" class="form-control" value="' + valueA["ReportEnName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_rese_' + (indexi + 1) + '_url_en" type="text" class="form-control" value="' + valueA["ReportEnURL"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_rese_' + (indexi + 1) + '_name_sp" type="text" class="form-control" value="' + valueA["ReportEsName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_rese_' + (indexi + 1) + '_url_sp" type="text" class="form-control" value="' + valueA["ReportEsURL"] + '" disabled="disabled"></td>';

                columns += '<td style="padding: 2px;">';
                columns += '<select type="select" id="row_rese_' + (indexi + 1) + '_module" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';

                $.each(myList.CollectionB, function (indexj, valueB) {

                    if (valueA["IdModule"] == valueB["Id"]) {
                        columns += '<option value="' + valueB["Id"] + '" selected="selected">' + valueB["ModuleName_ES"] + '</option>';
                    }
                    else {
                        columns += '<option value="' + valueB["Id"] + '">' + valueB["ModuleName_ES"] + '</option>';
                    }

                });

                columns += '</select>';
                columns += '</td>';

                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_rese_btn_' + (indexi + 1) + '_edr" onClick="edit_rese_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_rese_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_rese_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_rese_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_rese_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_rese_btn_' + (indexi + 1) + '_der" onClick="delete_rese_row(\'' + valueA["ReportEnName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 

            });

            // Row hidden

            columns += '<tr id="rese_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_rese_new_id">-</th>';
            columns += '<td style="padding: 2px;"><input id="row_rese_new_menu_name_en" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_rese_new_menu_name_es" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_rese_new_name_en" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_rese_new_url_en" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_rese_new_name_sp" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_rese_new_url_sp" type="text" class="form-control"></td>';

            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_rese_new_module" class="custom-select">';

            $.each(myList.CollectionB, function (indexj, valueB) {

                columns += '<option value="' + valueB["Id"] + '">' + valueB["ModuleName_ES"] + '</option>';

            });

            columns += '</select>';
            columns += '</td>';

            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#rese_rows_list").append(columns);
            count_rese_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}







// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_scty_new = 0;
// Write your JavaScript code.
$('#scty_add_new_row').click(function () {

    let element = document.getElementById("scty_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_scty_new += 1;

    var row = '<tr id="new_row_' + count_scty_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_scty_new_id", "row_scty_new_id_" + count_scty_new);
    row = row.replace("row_scty_new_name", "row_scty_new_name_" + count_scty_new);
    $("#scty_rows_list tr:first").before(row);

});

$('#scty_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_scty_new = 0;
    return false;
});

$('#scty_save_new_rows').click(function () {

    if (count_scty_new == 0) {
        return;
    }

    $("#scty_add_new_row").prop("disabled", true);
    $("#scty_save_new_rows").prop("disabled", true);
    $("#scty_cancel_new_rows").prop("disabled", true);
    $("#scty_refresh_rows").prop("disabled", true);
    $("#scty_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var scty_new_count = $("th[id^='row_scty_new_id_']");
    var datas_scty = [];

    for (var i = 1; i <= scty_new_count.length; i++) {

        var obj = {};

        obj['scty_name'] = $("#row_scty_new_name_" + i).val();

        datas_scty.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factscty_compatibility").attr('disabled', 'disabled');
            $('#scty_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewScenarioType': datas_scty },
        url: "/ScenarioType/SetNewScenarioTypes",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#scty_add_new_row").prop("disabled", false);
            $("#scty_save_new_rows").prop("disabled", false);
            $("#scty_cancel_new_rows").prop("disabled", false);
            $("#scty_refresh_rows").prop("disabled", false);
            $("#scty_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_scty_new = 0;
            refresh_scty_table();

        }
    });

});


function edit_scty_row(id_row) {

    $("#row_scty_" + id_row + "_name").prop("disabled", false);

    $("#row_scty_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_scty_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_scty_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_scty_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_scty_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_scty_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambio_scty_row(id_row) {

    $("#row_scty_" + id_row + "_name").prop("disabled", true);

    $("#row_scty_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_scty_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_scty_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_scty_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_scty_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_scty_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_scty_row(id_row) {

    let rcr_actived = $("#row_scty_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_scty = [];
    var obj = {};

    obj['scty_id'] = encodeURIComponent($("#row_scty_" + id_row + "_id").data("value"));
    obj['scty_name'] = $("#row_scty_" + id_row + "_name").val();

    data_edit_scty.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factscty_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#scty_add_new_row").prop("disabled", true);
            $("#scty_save_new_rows").prop("disabled", true);
            $("#scty_cancel_new_rows").prop("disabled", true);
            $("#scty_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_scty_" + id_row + "_name").prop("disabled", true);

            $("#row_scty_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeScenarioType': data_edit_scty },
        url: "/ScenarioType/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#scty_add_new_row").prop("disabled", false);
            $("#scty_save_new_rows").prop("disabled", false);
            $("#scty_cancel_new_rows").prop("disabled", false);
            $("#scty_refresh_rows").prop("disabled", false);

            $("#row_scty_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambio_scty_row(id_row);
            //refresh_scty_table();

        }
    });

}

function delete_scty_row(delete_body_message_var, id_row) {

    let scty_id = encodeURIComponent($("#row_scty_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factscty_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#scty_add_new_row").prop("disabled", true);
                $("#scty_save_new_rows").prop("disabled", true);
                $("#scty_cancel_new_rows").prop("disabled", true);
                $("#scty_refresh_rows").prop("disabled", true);

                $("#row_scty_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/ScenarioType/DeleteScenarioType?scty_id=" + scty_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#scty_add_new_row").prop("disabled", false);
                $("#scty_save_new_rows").prop("disabled", false);
                $("#scty_cancel_new_rows").prop("disabled", false);
                $("#scty_refresh_rows").prop("disabled", false);

                $("#row_scty_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambio_scty_row(id_row);
                refresh_scty_table();

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

function refresh_scty_table() {

    $.ajax({
        beforeSend: function () {
            //$("#factscty_compatibility").attr('disabled', 'disabled');

            $("#scty_add_new_row").prop("disabled", true);
            $("#scty_save_new_rows").prop("disabled", true);
            $("#scty_cancel_new_rows").prop("disabled", true);
            $("#scty_refresh_rows").prop("disabled", true);
            $("#scty_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#scty_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/ScenarioType/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#scty_add_new_row").prop("disabled", false);
            $("#scty_save_new_rows").prop("disabled", false);
            $("#scty_cancel_new_rows").prop("disabled", false);
            $("#scty_refresh_rows").prop("disabled", false);
            $("#scty_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#scty_rows_list').html("");
            $('#scty_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_scty_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;"><input id="row_scty_' + (indexi + 1) + '_name" type="text" class="form-control" value="' + valueA["ScenarioName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_scty_btn_' + (indexi + 1) + '_edr" onClick="edit_scty_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_scty_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_scty_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_scty_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambio_scty_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_scty_btn_' + (indexi + 1) + '_der" onClick="delete_scty_row(\'' + valueA["ScenarioName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 

            });

            // Row hidden

            columns += '<tr id="scty_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_scty_new_id">-</th>';
            columns += '<td style="padding: 2px;"><input id="row_scty_new_name" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_scty_new_des" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#scty_rows_list").append(columns);
            count_scty_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}







// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_sosy_new = 0;
// Write your JavaScript code.
$('#sosy_add_new_row').click(function () {

    let element = document.getElementById("sosy_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_sosy_new += 1;

    var row = '<tr id="new_row_' + count_sosy_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_sosy_new_id", "row_sosy_new_id_" + count_sosy_new);
    row = row.replace("row_sosy_new_name", "row_sosy_new_name_" + count_sosy_new);
    $("#sosy_rows_list tr:first").before(row);

});

$('#sosy_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_sosy_new = 0;
    return false;
});

$('#sosy_save_new_rows').click(function () {

    if (count_sosy_new == 0) {
        return;
    }

    $("#sosy_add_new_row").prop("disabled", true);
    $("#sosy_save_new_rows").prop("disabled", true);
    $("#sosy_cancel_new_rows").prop("disabled", true);
    $("#sosy_refresh_rows").prop("disabled", true);
    $("#sosy_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var sosy_new_count = $("th[id^='row_sosy_new_id_']");
    var datas_sosy = [];

    for (var i = 1; i <= sosy_new_count.length; i++) {

        var obj = {};

        obj['sosy_name'] = $("#row_sosy_new_name_" + i).val();

        datas_sosy.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factsosy_compatibility").attr('disabled', 'disabled');
            $('#sosy_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewSourceSystem': datas_sosy },
        url: "/SourceSystem/SetNewSourceSystems",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#sosy_add_new_row").prop("disabled", false);
            $("#sosy_save_new_rows").prop("disabled", false);
            $("#sosy_cancel_new_rows").prop("disabled", false);
            $("#sosy_refresh_rows").prop("disabled", false);
            $("#sosy_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_sosy_new = 0;
            refresh_sosy_table();

        }
    });

});


function edit_sosy_row(id_row) {

    $("#row_sosy_" + id_row + "_name").prop("disabled", false);

    $("#row_sosy_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_sosy_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_sosy_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_sosy_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_sosy_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_sosy_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_sosy_row(id_row) {

    $("#row_sosy_" + id_row + "_name").prop("disabled", true);
    
    $("#row_sosy_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_sosy_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_sosy_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_sosy_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_sosy_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_sosy_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_sosy_row(id_row) {

    let rcr_actived = $("#row_sosy_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_sosy = [];
    var obj = {};

    obj['sosy_id'] = encodeURIComponent($("#row_sosy_" + id_row + "_id").data("value"));
    obj['sosy_name'] = $("#row_sosy_" + id_row + "_name").val();

    data_edit_sosy.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factsosy_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#sosy_add_new_row").prop("disabled", true);
            $("#sosy_save_new_rows").prop("disabled", true);
            $("#sosy_cancel_new_rows").prop("disabled", true);
            $("#sosy_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_sosy_" + id_row + "_name").prop("disabled", true);

            $("#row_sosy_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeSourceSystem': data_edit_sosy },
        url: "/SourceSystem/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#sosy_add_new_row").prop("disabled", false);
            $("#sosy_save_new_rows").prop("disabled", false);
            $("#sosy_cancel_new_rows").prop("disabled", false);
            $("#sosy_refresh_rows").prop("disabled", false);

            $("#row_sosy_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_sosy_row(id_row);
            //refresh_sosy_table();

        }
    });

}

function delete_sosy_row(delete_body_message_var, id_row) {

    let sosy_id = encodeURIComponent($("#row_sosy_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factsosy_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#sosy_add_new_row").prop("disabled", true);
                $("#sosy_save_new_rows").prop("disabled", true);
                $("#sosy_cancel_new_rows").prop("disabled", true);
                $("#sosy_refresh_rows").prop("disabled", true);

                $("#row_sosy_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/SourceSystem/DeleteSourceSystem?sosy_id=" + sosy_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#sosy_add_new_row").prop("disabled", false);
                $("#sosy_save_new_rows").prop("disabled", false);
                $("#sosy_cancel_new_rows").prop("disabled", false);
                $("#sosy_refresh_rows").prop("disabled", false);

                $("#row_sosy_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_sosy_row(id_row);
                refresh_sosy_table();

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

function refresh_sosy_table() {

    $.ajax({
        beforeSend: function () {
            //$("#factsosy_compatibility").attr('disabled', 'disabled');

            $("#sosy_add_new_row").prop("disabled", true);
            $("#sosy_save_new_rows").prop("disabled", true);
            $("#sosy_cancel_new_rows").prop("disabled", true);
            $("#sosy_refresh_rows").prop("disabled", true);
            $("#sosy_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#sosy_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/SourceSystem/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#sosy_add_new_row").prop("disabled", false);
            $("#sosy_save_new_rows").prop("disabled", false);
            $("#sosy_cancel_new_rows").prop("disabled", false);
            $("#sosy_refresh_rows").prop("disabled", false);
            $("#sosy_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#sosy_rows_list').html("");
            $('#sosy_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_sosy_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;"><input id="row_sosy_' + (indexi + 1) + '_name" type="text" class="form-control" value="' + valueA["SourceName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_sosy_btn_' + (indexi + 1) + '_edr" onClick="edit_sosy_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_sosy_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_sosy_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_sosy_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_sosy_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_sosy_btn_' + (indexi + 1) + '_der" onClick="delete_sosy_row(\'' + valueA["SourceName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 

            });

            // Row hidden

            columns += '<tr id="sosy_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_sosy_new_id">-</th>';
            columns += '<td style="padding: 2px;"><input id="row_sosy_new_name" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#sosy_rows_list").append(columns);
            count_sosy_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}







// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_uomv_new = 0;
// Write your JavaScript code.
$('#uomv_add_new_row').click(function () {

    let element = document.getElementById("uomv_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_uomv_new += 1;

    var row = '<tr id="new_row_' + count_uomv_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_uomv_new_id", "row_uomv_new_id_" + count_uomv_new);
    row = row.replace("row_uomv_new_name_en", "row_uomv_new_name_en_" + count_uomv_new);
    row = row.replace("row_uomv_new_name_sp", "row_uomv_new_name_sp_" + count_uomv_new);
    row = row.replace("row_uomv_new_symbol", "row_uomv_new_symbol_" + count_uomv_new);
    $("#uomv_rows_list tr:first").before(row);

});

$('#uomv_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_uomv_new = 0;
    return false;
});

$('#uomv_save_new_rows').click(function () {

    if (count_uomv_new == 0) {
        return;
    }

    $("#uomv_add_new_row").prop("disabled", true);
    $("#uomv_save_new_rows").prop("disabled", true);
    $("#uomv_cancel_new_rows").prop("disabled", true);
    $("#uomv_refresh_rows").prop("disabled", true);
    $("#uomv_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var uomv_new_count = $("th[id^='row_uomv_new_id_']");
    var datas_uomv = [];

    for (var i = 1; i <= uomv_new_count.length; i++) {

        var obj = {};

        obj['uomv_name_en'] = $("#row_uomv_new_name_en_" + i).val();
        obj['uomv_name_sp'] = $("#row_uomv_new_name_sp_" + i).val();
        obj['uomv_symbol'] = $("#row_uomv_new_symbol_" + i).val();

        datas_uomv.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factuomv_compatibility").attr('disabled', 'disabled');
            $('#uomv_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewUom': datas_uomv },
        url: "/Uom/SetNewUoms",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#uomv_add_new_row").prop("disabled", false);
            $("#uomv_save_new_rows").prop("disabled", false);
            $("#uomv_cancel_new_rows").prop("disabled", false);
            $("#uomv_refresh_rows").prop("disabled", false);
            $("#uomv_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_uomv_new = 0;
            refresh_uomv_table();

        }
    });

});


function edit_uomv_row(id_row) {
    $("#row_uomv_" + id_row + "_name_en").prop("disabled", false);
    $("#row_uomv_" + id_row + "_name_sp").prop("disabled", false);
    $("#row_uomv_" + id_row + "_symbol").prop("disabled", false);

    $("#row_uomv_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_uomv_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_uomv_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_uomv_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_uomv_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_uomv_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_uomv_row(id_row) {

    $("#row_uomv_" + id_row + "_name_en").prop("disabled", true);
    $("#row_uomv_" + id_row + "_name_sp").prop("disabled", true);
    $("#row_uomv_" + id_row + "_symbol").prop("disabled", true);

    $("#row_uomv_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_uomv_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_uomv_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_uomv_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_uomv_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_uomv_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_uomv_row(id_row) {

    let rcr_actived = $("#row_uomv_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_uomv = [];
    var obj = {};

    obj['uomv_id'] = encodeURIComponent($("#row_uomv_" + id_row + "_id").data("value"));
    obj['uomv_name_en'] = $("#row_uomv_" + id_row + "_name_en").val();
    obj['uomv_name_sp'] = $("#row_uomv_" + id_row + "_name_sp").val();
    obj['uomv_symbol'] = $("#row_uomv_" + id_row + "_symbol").val();

    data_edit_uomv.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factuomv_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#uomv_add_new_row").prop("disabled", true);
            $("#uomv_save_new_rows").prop("disabled", true);
            $("#uomv_cancel_new_rows").prop("disabled", true);
            $("#uomv_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_uomv_" + id_row + "_name_en").prop("disabled", true);
            $("#row_uomv_" + id_row + "_name_sp").prop("disabled", true);
            $("#row_uomv_" + id_row + "_symbol").prop("disabled", true);

            $("#row_uomv_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeUom': data_edit_uomv },
        url: "/Uom/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#uomv_add_new_row").prop("disabled", false);
            $("#uomv_save_new_rows").prop("disabled", false);
            $("#uomv_cancel_new_rows").prop("disabled", false);
            $("#uomv_refresh_rows").prop("disabled", false);

            $("#row_uomv_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_uomv_row(id_row);
            //refresh_uomv_table();

        }
    });

}

function delete_uomv_row(delete_body_message_var, id_row) {

    let uomv_id = encodeURIComponent($("#row_uomv_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factuomv_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#uomv_add_new_row").prop("disabled", true);
                $("#uomv_save_new_rows").prop("disabled", true);
                $("#uomv_cancel_new_rows").prop("disabled", true);
                $("#uomv_refresh_rows").prop("disabled", true);

                $("#row_uomv_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/Uom/DeleteUom?uomv_id=" + uomv_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#uomv_add_new_row").prop("disabled", false);
                $("#uomv_save_new_rows").prop("disabled", false);
                $("#uomv_cancel_new_rows").prop("disabled", false);
                $("#uomv_refresh_rows").prop("disabled", false);

                $("#row_uomv_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_uomv_row(id_row);
                refresh_uomv_table();

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

function refresh_uomv_table() {

    $.ajax({
        beforeSend: function () {
            //$("#factuomv_compatibility").attr('disabled', 'disabled');

            $("#uomv_add_new_row").prop("disabled", true);
            $("#uomv_save_new_rows").prop("disabled", true);
            $("#uomv_cancel_new_rows").prop("disabled", true);
            $("#uomv_refresh_rows").prop("disabled", true);
            $("#uomv_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#uomv_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/Uom/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#uomv_add_new_row").prop("disabled", false);
            $("#uomv_save_new_rows").prop("disabled", false);
            $("#uomv_cancel_new_rows").prop("disabled", false);
            $("#uomv_refresh_rows").prop("disabled", false);
            $("#uomv_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#uomv_rows_list').html("");
            $('#uomv_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_uomv_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;"><input id="row_uomv_' + (indexi + 1) + '_name_en" type="text" class="form-control" value="' + valueA["UOMNameEn"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_uomv_' + (indexi + 1) + '_name_sp" type="text" class="form-control" value="' + valueA["UOMNameSp"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_uomv_' + (indexi + 1) + '_symbol" type="text" class="form-control" value="' + valueA["Symbol"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_uomv_btn_' + (indexi + 1) + '_edr" onClick="edit_uomv_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_uomv_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_uomv_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_uomv_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_uomv_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_uomv_btn_' + (indexi + 1) + '_der" onClick="delete_uomv_row(\'' + valueA["UOMNameEn"] + '<br>' + valueA["UOMNameSp"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 

            });

            // Row hidden

            columns += '<tr id="uomv_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_uomv_new_id">-</th>';
            columns += '<td style="padding: 2px;"><input id="row_uomv_new_name_en" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_uomv_new_name_sp" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_uomv_new_symbol" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#uomv_rows_list").append(columns);
            count_uomv_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}







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









// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_cnf_sosy_new = 0;
// Write your JavaScript code.
$('#cnf_sosy_add_new_row').click(function () {

    let element = document.getElementById("cnf_sosy_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_cnf_sosy_new += 1;

    var row = '<tr id="new_row_' + count_cnf_sosy_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_cnf_sosy_new_id", "row_cnf_sosy_new_id_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_schemasourcename", "row_cnf_sosy_new_schemasourcename_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_schematargetname", "row_cnf_sosy_new_schematargetname_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_tablename", "row_cnf_sosy_new_tablename_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_foldername", "row_cnf_sosy_new_foldername_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_secretservername", "row_cnf_sosy_new_secretservername_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_secretauthname", "row_cnf_sosy_new_secretauthname_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_username", "row_cnf_sosy_new_username_" + count_cnf_sosy_new);
    $("#cnf_sosy_rows_list tr:first").before(row);

});

$('#cnf_sosy_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_cnf_sosy_new = 0;
    return false;
});

$('#cnf_sosy_save_new_rows').click(function () {

    if (count_cnf_sosy_new == 0) {
        return;
    }

    $("#cnf_sosy_add_new_row").prop("disabled", true);
    $("#cnf_sosy_save_new_rows").prop("disabled", true);
    $("#cnf_sosy_cancel_new_rows").prop("disabled", true);
    $("#cnf_sosy_refresh_rows").prop("disabled", true);
    $("#cnf_sosy_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var sosy_new_count = $("th[id^='row_cnf_sosy_new_id_']");
    var datas_cnf_sosy = [];

    for (var i = 1; i <= sosy_new_count.length; i++) {

        var obj = {};

        obj['cnf_sosy_schema_source_name'] = $("#row_cnf_sosy_new_schemasourcename_" + i).val();
        obj['cnf_sosy_schema_target_name'] = $("#row_cnf_sosy_new_schematargetname_" + i).val();
        obj['cnf_sosy_table_name'] = $("#row_cnf_sosy_new_tablename_" + i).val();
        obj['cnf_sosy_folder_name'] = $("#row_cnf_sosy_new_foldername_" + i).val();
        obj['cnf_sosy_secret_server_name'] = $("#row_cnf_sosy_new_secretservername_" + i).val();
        obj['cnf_sosy_secret_auth_name'] = $("#row_cnf_sosy_new_secretauthname_" + i).val();
        obj['cnf_sosy_user_name'] = $("#row_cnf_sosy_new_username_" + i).val();

        datas_cnf_sosy.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factsosy_compatibility").attr('disabled', 'disabled');
            $('#cnf_sosy_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewCnfSourceSystem': datas_cnf_sosy },
        url: "/CnfSourceSystem/SetNewCnfSourceSystems",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#cnf_sosy_add_new_row").prop("disabled", false);
            $("#cnf_sosy_save_new_rows").prop("disabled", false);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", false);
            $("#cnf_sosy_refresh_rows").prop("disabled", false);
            $("#cnf_sosy_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_cnf_sosy_new = 0;
            refresh_cnf_sosy_table();

        }
    });

});


function edit_cnf_sosy_row(id_row) {

    $("#row_cnf_sosy_" + id_row + "_schemasourcename").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_schematargetname").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_tablename").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_foldername").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_secretservername").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_secretauthname").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_username").prop("disabled", false);

    $("#row_cnf_sosy_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_cnf_sosy_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_cnf_sosy_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_cnf_sosy_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_cnf_sosy_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_cnf_sosy_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_cnf_sosy_row(id_row) {

    $("#row_cnf_sosy_" + id_row + "_schemasourcename").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_schematargetname").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_tablename").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_foldername").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_secretservername").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_secretauthname").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_username").prop("disabled", true);
    
    $("#row_cnf_sosy_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_cnf_sosy_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_cnf_sosy_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_cnf_sosy_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_cnf_sosy_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_cnf_sosy_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_cnf_sosy_row(id_row) {

    let rcr_actived = $("#row_cnf_sosy_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_cnf_sosy = [];
    var obj = {};

    obj['cnf_sosy_id'] = encodeURIComponent($("#row_cnf_sosy_" + id_row + "_id").data("value"));
    obj['cnf_sosy_schema_source_name'] = $("#row_cnf_sosy_" + id_row + "_schemasourcename").val();
    obj['cnf_sosy_schema_target_name'] = $("#row_cnf_sosy_" + id_row + "_schematargetname").val();
    obj['cnf_sosy_table_name'] = $("#row_cnf_sosy_" + id_row + "_tablename").val();
    obj['cnf_sosy_folder_name'] = $("#row_cnf_sosy_" + id_row + "_foldername").val();
    obj['cnf_sosy_secret_server_name'] = $("#row_cnf_sosy_" + id_row + "_secretservername").val();
    obj['cnf_sosy_secret_auth_name'] = $("#row_cnf_sosy_" + id_row + "_secretauthname").val();
    obj['cnf_sosy_user_name'] = $("#row_cnf_sosy_" + id_row + "_username").val();

    data_edit_cnf_sosy.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factsosy_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#cnf_sosy_add_new_row").prop("disabled", true);
            $("#cnf_sosy_save_new_rows").prop("disabled", true);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", true);
            $("#cnf_sosy_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_cnf_sosy_" + id_row + "_schemasourcename").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_schematargetname").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_tablename").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_foldername").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_secretservername").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_secretauthname").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_username").prop("disabled", true);

            $("#row_cnf_sosy_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeCnfSourceSystem': data_edit_cnf_sosy },
        url: "/CnfSourceSystem/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#cnf_sosy_add_new_row").prop("disabled", false);
            $("#cnf_sosy_save_new_rows").prop("disabled", false);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", false);
            $("#cnf_sosy_refresh_rows").prop("disabled", false);

            $("#row_cnf_sosy_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_cnf_sosy_row(id_row);
            //refresh_cnf_sosy_table();

        }
    });

}

function delete_cnf_sosy_row(delete_body_message_var, id_row) {

    let sosy_id = encodeURIComponent($("#row_cnf_sosy_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factsosy_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#cnf_sosy_add_new_row").prop("disabled", true);
                $("#cnf_sosy_save_new_rows").prop("disabled", true);
                $("#cnf_sosy_cancel_new_rows").prop("disabled", true);
                $("#cnf_sosy_refresh_rows").prop("disabled", true);

                $("#row_cnf_sosy_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/CnfSourceSystem/DeleteCnfSourceSystem?sosy_id=" + sosy_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#cnf_sosy_add_new_row").prop("disabled", false);
                $("#cnf_sosy_save_new_rows").prop("disabled", false);
                $("#cnf_sosy_cancel_new_rows").prop("disabled", false);
                $("#cnf_sosy_refresh_rows").prop("disabled", false);

                $("#row_cnf_sosy_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_cnf_sosy_row(id_row);
                refresh_cnf_sosy_table();

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

function refresh_cnf_sosy_table() {

    $.ajax({
        beforeSend: function () {
            //$("#factsosy_compatibility").attr('disabled', 'disabled');

            $("#cnf_sosy_add_new_row").prop("disabled", true);
            $("#cnf_sosy_save_new_rows").prop("disabled", true);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", true);
            $("#cnf_sosy_refresh_rows").prop("disabled", true);
            $("#cnf_sosy_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#cnf_sosy_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/CnfSourceSystem/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#cnf_sosy_add_new_row").prop("disabled", false);
            $("#cnf_sosy_save_new_rows").prop("disabled", false);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", false);
            $("#cnf_sosy_refresh_rows").prop("disabled", false);
            $("#cnf_sosy_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#cnf_sosy_rows_list').html("");
            $('#cnf_sosy_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_cnf_sosy_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_schemasourcename" type="text" class="form-control" value="' + valueA["SchemaSourceName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_schematargetname" type="text" class="form-control" value="' + valueA["SchemaTargetName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_tablename" type="text" class="form-control" value="' + valueA["TableName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_foldername" type="text" class="form-control" value="' + valueA["FolderName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_secretservername" type="text" class="form-control" value="' + valueA["SecretServerName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_secretauthname" type="text" class="form-control" value="' + valueA["SecretAuthName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_username" type="text" class="form-control" value="' + valueA["UserName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_cnf_sosy_btn_' + (indexi + 1) + '_edr" onClick="edit_cnf_sosy_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_cnf_sosy_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_cnf_sosy_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_cnf_sosy_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_cnf_sosy_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_cnf_sosy_btn_' + (indexi + 1) + '_der" onClick="delete_cnf_sosy_row(\'' + (indexi + 1) + '. ' + valueA["TableName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 

            });

            // Row hidden

            columns += '<tr id="cnf_sosy_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_cnf_sosy_new_id"></th>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_schemasourcename" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_schematargetname" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_tablename" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_foldername" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_secretservername" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_secretauthname" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_username" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#cnf_sosy_rows_list").append(columns);
            count_cnf_sosy_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}







// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
//let count_lase_new = 0;
// Write your JavaScript code.
//$('#lase_add_new_row').click(function () {

//    let element = document.getElementById("lase_row_example_hidden");
//    let newelement = element.cloneNode(true);
//    count_lase_new += 1;

//    var row = '<tr id="new_row_' + count_lase_new + '">' + newelement.innerHTML + '</tr>';
//    row = row.replace("row_lase_new_id", "row_lase_new_id_" + count_lase_new);
//    row = row.replace("row_lase_new_kpi", "row_lase_new_kpi_" + count_lase_new);
//    row = row.replace("row_lase_new_language", "row_lase_new_language_" + count_lase_new);
//    row = row.replace("row_lase_new_table_name", "row_lase_new_table_name_" + count_lase_new);
//    row = row.replace("row_lase_new_column_name_date", "row_lase_new_column_name_date_" + count_lase_new);
//    row = row.replace("row_lase_new_column_name_shift", "row_lase_new_column_name_shift_" + count_lase_new);
//    row = row.replace("row_lase_new_column_name_value", "row_lase_new_column_name_value_" + count_lase_new);
//    row = row.replace("row_lase_new_filter_additional", "row_lase_new_filter_additional_" + count_lase_new);
//    row = row.replace("row_lase_new_parameters", "row_lase_new_parameters_" + count_lase_new);
//    $("#lase_rows_list tr:first").before(row);

//});

$('#lase_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_lase_new = 0;
    return false;
});

/*
$('#lase_save_new_rows').click(function () {

    if (count_lase_new == 0) {
        return;
    }

    $("#lase_filter_kpi").prop("disabled", true);
    $("#lase_filter_language").prop("disabled", true);

    $("#lase_add_new_row").prop("disabled", true);
    $("#lase_save_new_rows").prop("disabled", true);
    $("#lase_cancel_new_rows").prop("disabled", true);
    $("#lase_refresh_rows").prop("disabled", true);
    $("#lase_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var lase_new_count = $("th[id^='row_lase_new_id_']");
    var datas_lase = [];

    for (var i = 1; i <= lase_new_count.length; i++) {

        var obj = {};

        obj['lase_kpi'] = encodeURIComponent($("#row_lase_new_kpi_" +  i).val());
        obj['lase_language'] = encodeURIComponent($("#row_lase_new_language_" + i).val());
        obj['lase_table_name'] = $("#row_lase_new_table_name_" + i).val();
        obj['lase_column_name_date'] = $("#row_lase_new_column_name_date_" + i).val();
        obj['lase_column_name_shift'] = $("#row_lase_new_column_name_shift_" + i).val();
        obj['lase_column_name_value'] = $("#row_lase_new_column_name_value_" + i).val();
        obj['lase_filter_additional'] = $("#row_lase_new_filter_additional_" + i).val();
        obj['lase_parameters'] = $("#row_lase_new_parameters_" + i).val();

        datas_lase.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factlase_compatibility").attr('disabled', 'disabled');
            $('#lase_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-{id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'Newlasenario': datas_lase }, 
        url: "/LanguageSetting/SetNewlasenarios",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#lase_filter_kpi").prop("disabled", false);
            $("#lase_filter_language").prop("disabled", false);

            $("#lase_add_new_row").prop("disabled", false);
            $("#lase_save_new_rows").prop("disabled", false);
            $("#lase_cancel_new_rows").prop("disabled", false);
            $("#lase_refresh_rows").prop("disabled", false);
            $("#lase_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_lase_new = 0;
            refresh_lase_table();

        }
    });

});
*/

function edit_lase_row(id_row) {

    edit_lase_refresh_modal(id_row);

}

function edit_lase_refresh_modal(id_row) {

    let lase_id = encodeURIComponent($("#row_lase_" + id_row + "_id").data("value"));
    let lase_language = encodeURIComponent($("#row_lase_" + id_row + "_id").data("language"));
    let lase_sharedresource = encodeURIComponent($("#row_lase_" + id_row + "_id").data("sharedresource"));

    $.ajax({
        beforeSend: function () {
            //$("#factlase_compatibility").attr('disabled', 'disabled');
            $("#data_loading_edit_sharedresource").css({ "display": "block", "margin": "auto" });
            $("#data_list_edit_sharedresource").css({ "display": "none" });

            $("#lase_text_modal_edit_englishname").html("");
            $("#lase_input_modal_edit_variable").val("");
            $("#lase_input_modal_edit_value").val("");
            $("#lase_input_modal_edit_value").attr("placeholder", "");
            $("#lase_input_modal_edit_comments").val("");
            $("#lase_input_modal_edit_comments").attr("placeholder", "");
            $("#lase_btn_modal_edit").data("editid", ""); 
        },
        url: "/LanguageSetting/GetLanguageInfo?num1=" + lase_id + "&num2=" + lase_language + "&num3=" + lase_sharedresource,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#lase_text_modal_edit_englishname").html(myList.CollectionA[0].EnglishName);
            $("#lase_input_modal_edit_variable").val(myList.CollectionA[0].VariableName);
            $("#lase_input_modal_edit_value").val(myList.CollectionA[0].ValueName);
            $("#lase_input_modal_edit_value").attr("placeholder", myList.CollectionA[0].ValueNameEn);
            $("#lase_input_modal_edit_comments").val(myList.CollectionA[0].Comments);
            $("#lase_input_modal_edit_comments").attr("placeholder", myList.CollectionA[0].CommentsEn);
            $("#lase_btn_modal_edit").data("editid", id_row); 
            
            $("#data_loading_edit_sharedresource").css({ "display": "none", "margin": "auto" });
            $("#data_list_edit_sharedresource").css({ "display": "flex" });


        }
    });


}

//$("#Modal_edit_KPI_Scenario > div > div > div.modal-footer > button").click(function () {

    //$("#lase_select_modal_edit_kpi").val("-");
    //$("#lase_select_modal_edit_language").val("-");
    //$("#lase_input_modal_edit_tablename").val("");
    //$("#lase_input_modal_edit_colnamedate").val("");
    //$("#lase_input_modal_edit_colnameshift").val("");
    //$("#lase_input_modal_edit_colnamevalue").val("");
    //$("#lase_input_modal_edit_filteradd").val("");
    //$("#lase_input_modal_edit_parameters").val("");
    //$("#lase_btn_modal_edit").data("editid", ""); 

//    alert("dsadsa");

//});

function lase_btn_modal_edit() {

    let id_row = $("#lase_btn_modal_edit").data("editid"); 
    var attibutevalue = $("#Modal_edit_LanguageSetting").attr('aria-hidden');

    if (typeof attibutevalue !== 'undefined' && attibutevalue !== false) {
        return;
    }

    if (id_row == "") {
        return;
    }

    var data_edit_lase = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_lase_" + id_row + "_id").data("value"));
    obj['ValueName'] = encodeURIComponent($("#lase_input_modal_edit_value").val());
    obj['Comments'] = encodeURIComponent($("#lase_input_modal_edit_comments").val());

    data_edit_lase.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factlase_compatibility").attr('disabled', 'disabled');

            // deshabilitar controles
            $("#lase_btn_modal_edit").prop("disabled", true);
            $("#lase_filter_language").prop("disabled", true);
            // deshabilitar entradas
            $("#lase_input_modal_edit_value").prop("disabled", true);
            $("#lase_input_modal_edit_comments").prop("disabled", true);

            $("#lase_btn_modal_edit").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_edit_lase },
        url: "/LanguageSetting/EditResourceLanguage",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            // habilitar controles
            $("#lase_btn_modal_edit").prop("disabled", false);
            $("#lase_filter_language").prop("disabled", false);
            // habilitar entradas
            $("#lase_input_modal_edit_value").prop("disabled", false);
            $("#lase_input_modal_edit_comments").prop("disabled", false);

            $("#lase_btn_modal_edit").html('Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            refresh_lase_table();

            $("#lase_input_modal_edit_value").val("");
            $("#lase_input_modal_edit_value").attr("placeholder", "");
            $("#lase_input_modal_edit_comments").val("");
            $("#lase_input_modal_edit_comments").attr("placeholder", "");
            $("#lase_btn_modal_edit").data("editid", ""); 

            $("#Modal_edit_LanguageSetting > div > div > div.modal-footer > button").trigger('click');

        }
    });

}

$('#lase_filter_kpi').on('change', function () {
    refresh_lase_table();
});
$('#lase_filter_language').on('change', function () {
    refresh_lase_table();
});

function refresh_lase_table() {

    let filter_language = encodeURIComponent($("#lase_filter_language").val());

    $.ajax({
        beforeSend: function () {
            //$("#factlase_compatibility").attr('disabled', 'disabled');

            $("#lase_filter_language").prop("disabled", true);

            $("#lase_add_new_row").prop("disabled", true);
            $("#lase_save_new_rows").prop("disabled", true);
            $("#lase_cancel_new_rows").prop("disabled", true);
            $("#lase_refresh_rows").prop("disabled", true);
            $("#lase_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#lase_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/LanguageSetting/RefreshTable?filter_language=" + filter_language,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#lase_filter_language").prop("disabled", false);

            $("#lase_add_new_row").prop("disabled", false);
            $("#lase_save_new_rows").prop("disabled", false);
            $("#lase_cancel_new_rows").prop("disabled", false);
            $("#lase_refresh_rows").prop("disabled", false);
            $("#lase_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#lase_rows_list').html("");
            $('#lase_rows_list').removeAttr("style");
            let columns = '';

            if (myList.CollectionA.length != 0) {
                $.each(myList.CollectionA, function (indexi, valueA) {

                    columns += '<tr>';

                    columns += '<th scope="row" id="row_lase_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                    
                    columns += '<td style="padding: 2px;">' + valueA["VariableName"] + '</td>';
                    columns += '<td style="padding: 2px;">' + (isEmpty(valueA["ValueName"]) ? "" : valueA["ValueName"]) + '</td>';
                    columns += '<td style="padding: 2px;">' + (isEmpty(valueA["Comments"]) ? "" : valueA["Comments"]) + '</td>';
                    columns += '<td style="padding: 2px;">';
                    columns += '<div class="input-group">';
                    columns += '<button type="button" id="row_lase_btn_' + (indexi + 1) + '_edr" onClick="edit_lase_row(' + (indexi + 1) + ')" data-toggle="modal" data-target="#Modal_edit_LanguageSetting" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    columns += '</div>';
                    columns += '</td>';

                    columns += '</tr>';


                });
            }
            
            $("#lase_rows_list").append(columns);
            count_lase_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}

function isEmpty(str) {
    return (!str || str.length === 0);
}

$('#lase_list_add_edit_language').click(function () {

    refresh_language_list();

});

function refresh_language_list() {
    
    $.ajax({
        beforeSend: function () {
            //$("#factlase_compatibility").attr('disabled', 'disabled');
            $("#data_loading_language").css({ "display": "block", "margin": "auto" });
            $("#data_list_language").css({ "display": "none" });

        },
        url: "/LanguageSetting/RefreshListLanguage",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);
            let rowsA = '';
            let rowsB = '';

            $('#lase_list_add_language').html("");
            $('#lase_list_edit_language').html("");
            $("#lase_filter_language").find('option').remove();

            $.each(myList.CollectionA, function (indexi, valueA) {
                rowsA += '<p style="margin-bottom: 0.3rem;">' + (indexi + 1) + '. ' + valueA["EnglishName"] + ' | ' + valueA["NativeName"] + ' | (' + valueA["CultureName"] + ')</p>';

                rowsB += '<tr>';
                rowsB += '<th scope="row" id="row_language_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                rowsB += '<td style="padding: 2px;">' + valueA["EnglishName"] + '</td>';
                rowsB += '<td style="padding: 2px;">' + valueA["NativeName"] + '</td>';
                rowsB += '<td style="padding: 2px;">' + valueA["CultureName"] + '</td>';
                rowsB += '<td style="padding: 2px;"><input type="checkbox" id="row_language_' + (indexi + 1) + '_checked" ' + (valueA["IsEnabled"] ? "checked=\"checked\"" : "") + ' disabled="disabled"></td>';
                rowsB += '<td style="padding: 2px;">';
                rowsB += '<div class="input-group">';
                rowsB += '<button type="button" id="row_lase_btn_language_' + (indexi + 1) + '_edr" onClick="edit_language_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                rowsB += '<button type="button" id="row_lase_btn_language_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_language_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                rowsB += '<button type="button" id="row_lase_btn_language_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_language_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                rowsB += '<button type="button" id="row_lase_btn_language_' + (indexi + 1) + '_der" onClick="delete_language_row(\'' + valueA["EnglishName"] + '<br>' + valueA["NativeName"] + '\',' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                rowsB += '</div>';
                rowsB += '</td>';
                rowsB += '</tr>';

                $('#lase_filter_language').append($('<option>', { value: valueA["Id"], text: (valueA["EnglishName"] + ' : ' + valueA["NativeName"]) }));

            });

            $('#lase_list_add_language').append(rowsA);
            $('#lase_list_edit_language').append(rowsB);

            $("#data_loading_language").css({ "display": "none", "margin": "auto" });
            $("#data_list_language").css({ "display": "block" });

        }
    });
    

}


function btn_lase_language_add_new() {

    $("#btn_lase_language_add_new").prop("disabled", true);
    $("#lase_language_culture_add_new").prop("disabled", true);

    var data_language = [];
    var obj = {};

    obj['EnglishName'] = encodeURIComponent($("#lase_language_culture_add_new option").filter(":selected").data("englishname"));
    obj['NativeName'] = encodeURIComponent($("#lase_language_culture_add_new option").filter(":selected").data("nativename"));
    obj['CultureName'] = encodeURIComponent($("#lase_language_culture_add_new option").filter(":selected").data("culturename"));
    obj['TwoLetter'] = encodeURIComponent($("#lase_language_culture_add_new option").filter(":selected").data("twoletter"));
    obj['ParentEnglishName'] = encodeURIComponent($("#lase_language_culture_add_new option").filter(":selected").data("parentenglishname"));
    obj['ParentNativeName'] = encodeURIComponent($("#lase_language_culture_add_new option").filter(":selected").data("parentnativename"));
    obj['ParentCultureName'] = encodeURIComponent($("#lase_language_culture_add_new option").filter(":selected").data("parentculturename"));
    obj['ParentTwoLetter'] = encodeURIComponent($("#lase_language_culture_add_new option").filter(":selected").data("parenttwoletter"));

    data_language.push(obj);

    $.ajax({
        beforeSend: function () {
            
            $("#btn_lase_language_add_new").html("Añadiendo...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'data': data_language },
        url: "/LanguageSetting/AddLanguage",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#btn_lase_language_add_new").html("Añadir");
            $("#btn_lase_language_add_new").prop("disabled", false);

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            $("#lase_language_culture_add_new").prop("disabled", false);
            refresh_language_list();

        }
    });

}

// modals edit and cancel

function edit_language_row(id_row) {
    $("#row_language_" + id_row + "_checked").prop("disabled", false);

    $("#row_lase_btn_language_" + id_row + "_edr").css({ "display": "none" });
    $("#row_lase_btn_language_" + id_row + "_der").css({ "display": "none" });
    $("#row_lase_btn_language_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_lase_btn_language_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_lase_btn_language_" + id_row + "_rcr").data("actived", 1);
    $("#row_lase_btn_language_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_language_row(id_row) {
    $("#row_language_" + id_row + "_checked").prop("disabled", true);

    $("#row_lase_btn_language_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_lase_btn_language_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_lase_btn_language_" + id_row + "_edr").css({ "display": "block" });
    $("#row_lase_btn_language_" + id_row + "_der").css({ "display": "block" });

    $("#row_lase_btn_language_" + id_row + "_rcr").data("actived", 0);
    $("#row_lase_btn_language_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_language_row(id_row) {

    let rcr_actived = $("#row_lase_btn_language_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_language = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_language_" + id_row + "_id").data("value"));
    obj['IsEnabled'] = $("#row_language_" + id_row + "_checked").attr("checked") ? 1 : 0; 

    data_language.push(obj);

    $.ajax({
        beforeSend: function () {

            // deshabilitar entradas
            $("#row_language_" + id_row + "_checked").prop("disabled", true);

            $("#row_lase_btn_language_" + id_row + "_edr").prop("disabled", false);
            $("#row_lase_btn_language_" + id_row + "_rcr").prop("disabled", false);
            $("#row_lase_btn_language_" + id_row + "_ccr").prop("disabled", false);
            $("#row_lase_btn_language_" + id_row + "_der").prop("disabled", false);
            
            $("#row_lase_btn_language_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_language },
        url: "/LanguageSetting/EditLanguages",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_lase_btn_language_" + id_row + "_edr").prop("disabled", true);
            $("#row_lase_btn_language_" + id_row + "_rcr").prop("disabled", true);
            $("#row_lase_btn_language_" + id_row + "_ccr").prop("disabled", true);
            $("#row_lase_btn_language_" + id_row + "_der").prop("disabled", true);
            $("#row_lase_btn_language_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_language_row(id_row);
            refresh_language_list();

        }
    });

}

function delete_language_row(delete_main_body, id_row) {

    let rcr_actived = $("#row_lase_btn_language_" + id_row + "_der").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + " " + id_row + "<br /><br />" + delete_main_body + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        let id = encodeURIComponent($("#row_language_" + id_row + "_id").data("value"));

        $.ajax({
            beforeSend: function () {
                //$("#factlase_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#row_lase_btn_language_" + id_row + "_edr").prop("disabled", false);
                $("#row_lase_btn_language_" + id_row + "_rcr").prop("disabled", false);
                $("#row_lase_btn_language_" + id_row + "_ccr").prop("disabled", false);
                $("#row_lase_btn_language_" + id_row + "_der").prop("disabled", false);
                $("#row_lase_btn_language_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/LanguageSetting/DeleteLanguage?id=" + id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#row_lase_btn_language_" + id_row + "_edr").prop("disabled", true);
                $("#row_lase_btn_language_" + id_row + "_rcr").prop("disabled", true);
                $("#row_lase_btn_language_" + id_row + "_ccr").prop("disabled", true);
                $("#row_lase_btn_language_" + id_row + "_der").prop("disabled", true);
                $("#row_lase_btn_language_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_language_row(id_row);
                refresh_language_list("language");

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
        zIndex: 2000,
        buttons: btnNames
    });


}


function lase_btn_modal_add() {

    var attibutevalue = $("#Modal_add_KPI_Scenario").attr('aria-hidden');

    if (typeof attibutevalue !== 'undefined' && attibutevalue !== false) {
        return;
    }

    var datas_lase = [];
    var obj = {};

    if ($("#lase_select_modal_add_kpi").val() == '-') {
        toastr.error("Debe seleccionar un valor", "Error", { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
        return;
    }
    if ($("#lase_select_modal_add_language").val() == '-') {
        toastr.error("Debe seleccionar un valor", "Error", { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
        return;
    }
    
    obj['lase_kpi'] = encodeURIComponent($("#lase_select_modal_add_kpi").val());
    obj['lase_language'] = encodeURIComponent($("#lase_select_modal_add_language").val());
    obj['lase_table_name'] = $("#lase_input_modal_add_tablename").val();
    obj['lase_column_name_date'] = $("#lase_input_modal_add_colnamedate").val();
    obj['lase_column_name_shift'] = $("#lase_input_modal_add_colnameshift").val();
    obj['lase_column_name_value'] = $("#lase_input_modal_add_colnamevalue").val();
    obj['lase_filter_additional'] = $("#lase_input_modal_add_filteradd").val();
    obj['lase_parameters'] = $("#lase_input_modal_add_parameters").val();

    datas_lase.push(obj);

    $.ajax({
        beforeSend: function () {
            
            $("#lase_select_modal_add_kpi").prop("disabled", true);
            $("#lase_select_modal_add_language").prop("disabled", true);
            $("#lase_input_modal_add_tablename").prop("disabled", true);
            $("#lase_input_modal_add_colnamedate").prop("disabled", true);
            $("#lase_input_modal_add_colnameshift").prop("disabled", true);
            $("#lase_input_modal_add_colnamevalue").prop("disabled", true);
            $("#lase_input_modal_add_filteradd").prop("disabled", true);
            $("#lase_input_modal_add_parameters").prop("disabled", true);

            $("#lase_btn_modal_add").prop("disabled", true);
            $("#lase_btn_modal_add").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');

        },
        data: { 'Newlasenario': datas_lase },
        url: "/LanguageSetting/SetNewlasenarios",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#lase_select_modal_add_kpi").prop("disabled", false);
            $("#lase_select_modal_add_language").prop("disabled", false);
            $("#lase_input_modal_add_tablename").prop("disabled", true);
            $("#lase_input_modal_add_colnamedate").prop("disabled", true);
            $("#lase_input_modal_add_colnameshift").prop("disabled", true);
            $("#lase_input_modal_add_colnamevalue").prop("disabled", true);
            $("#lase_input_modal_add_filteradd").prop("disabled", true);
            $("#lase_input_modal_add_parameters").prop("disabled", true);

            $("#lase_btn_modal_add").prop("disabled", false);
            $("#lase_btn_modal_add").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            $("#lase_select_modal_add_kpi").val("-");
            $("#lase_select_modal_add_language").val("-");
            $("#lase_input_modal_add_tablename").val("");
            $("#lase_input_modal_add_colnamedate").val("");
            $("#lase_input_modal_add_colnameshift").val("");
            $("#lase_input_modal_add_colnamevalue").val("");
            $("#lase_input_modal_add_filteradd").val("");
            $("#lase_input_modal_add_parameters").val("");

            $("#Modal_add_KPI_Scenario > div > div > div.modal-footer > button").trigger('click');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            refresh_lase_table();

        }
    });

}


$('#lase_list_add_edit_sharedvariable').click(function () {

    refresh_shared_list();

});

function refresh_shared_list() {
    $.ajax({
        beforeSend: function () {
            //$("#factlase_compatibility").attr('disabled', 'disabled');
            $("#data_loading_shared").css({ "display": "block", "margin": "auto" });
            $("#data_list_shared").css({ "display": "none" });

        },
        url: "/LanguageSetting/RefreshListSharedResource",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);
            let rowsA = '';
            let rowsB = '';

            $('#lase_list_add_shared').html("");
            $('#lase_list_edit_shared').html("");
            $("#lase_filter_shared").find('option').remove();

            $.each(myList.CollectionA, function (indexi, valueA) {
                rowsA += '<p style="margin-bottom: 0.3rem;">' + (indexi + 1) + '. ' + valueA["VariableName"] + '</p>';

                rowsB += '<tr>';
                rowsB += '<th scope="row" id="row_shared_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                rowsB += '<td style="padding: 2px;"><input id="row_shared_' + (indexi + 1) + '_variable_name" type="text" class="form-control" value="' + valueA["VariableName"] + '" disabled="disabled"></td>';
                rowsB += '<td style="padding: 2px;">';
                rowsB += '<div class="input-group">';
                rowsB += '<button type="button" id="row_lase_btn_shared_' + (indexi + 1) + '_edr" onClick="edit_shared_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                rowsB += '<button type="button" id="row_lase_btn_shared_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_shared_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                rowsB += '<button type="button" id="row_lase_btn_shared_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_shared_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                rowsB += '<button type="button" id="row_lase_btn_shared_' + (indexi + 1) + '_der" onClick="delete_shared_row(\'' + valueA["VariableName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                rowsB += '</div>';
                rowsB += '</td>';
                rowsB += '</tr>';

            });

            $('#lase_list_add_shared').append(rowsA);
            $('#lase_list_edit_shared').append(rowsB);

            $("#data_loading_shared").css({ "display": "none", "margin": "auto" });
            $("#data_list_shared").css({ "display": "block" });

        }
    });
}

function edit_shared_row(id_row) {
    $("#row_shared_" + id_row + "_variable_name").prop("disabled", false);

    $("#row_lase_btn_shared_" + id_row + "_edr").css({ "display": "none" });
    $("#row_lase_btn_shared_" + id_row + "_der").css({ "display": "none" });
    $("#row_lase_btn_shared_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_lase_btn_shared_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_lase_btn_shared_" + id_row + "_rcr").data("actived", 1);
    $("#row_lase_btn_shared_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_shared_row(id_row) {
    $("#row_shared_" + id_row + "_variable_name").prop("disabled", true);

    $("#row_lase_btn_shared_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_lase_btn_shared_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_lase_btn_shared_" + id_row + "_edr").css({ "display": "block" });
    $("#row_lase_btn_shared_" + id_row + "_der").css({ "display": "block" });

    $("#row_lase_btn_shared_" + id_row + "_rcr").data("actived", 0);
    $("#row_lase_btn_shared_" + id_row + "_ccr").data("actived", 0);
}

function btn_lase_shared_add_new() {

    $("#btn_lase_shared_add_new").prop("disabled", true);
    $("#lase_shared_name_add_new").prop("disabled", true);

    let shared_name = encodeURIComponent($("#lase_shared_name_add_new").val()); 

    $.ajax({
        beforeSend: function () {

            $("#btn_lase_shared_add_new").html("Añadiendo...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        }, 
        url: "/LanguageSetting/AddShared?shared_name=" + shared_name,
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#btn_lase_shared_add_new").html("Añadir");
            $("#btn_lase_shared_add_new").prop("disabled", false);

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            $("#lase_shared_name_add_new").prop("disabled", false);
            $("#lase_shared_name_add_new").val("");
            refresh_shared_list();

        }
    });

}





function realizar_cambios_shared_row(id_row) {

    let rcr_actived = $("#row_lase_btn_shared_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_shared = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_shared_" + id_row + "_id").data("value"));
    obj['SharedName'] = $("#row_shared_" + id_row + "_variable_name").val();

    data_shared.push(obj);

    $.ajax({
        beforeSend: function () {

            // deshabilitar entradas
            $("#row_shared_" + id_row + "_checked").prop("disabled", true);

            $("#row_lase_btn_shared_" + id_row + "_edr").prop("disabled", false);
            $("#row_lase_btn_shared_" + id_row + "_rcr").prop("disabled", false);
            $("#row_lase_btn_shared_" + id_row + "_ccr").prop("disabled", false);
            $("#row_lase_btn_shared_" + id_row + "_der").prop("disabled", false);

            $("#row_lase_btn_shared_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_shared },
        url: "/LanguageSetting/EditShared",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_lase_btn_shared_" + id_row + "_edr").prop("disabled", true);
            $("#row_lase_btn_shared_" + id_row + "_rcr").prop("disabled", true);
            $("#row_lase_btn_shared_" + id_row + "_ccr").prop("disabled", true);
            $("#row_lase_btn_shared_" + id_row + "_der").prop("disabled", true);
            $("#row_lase_btn_shared_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_shared_row(id_row);
            refresh_shared_list();

        }
    });

}

function delete_shared_row(variable_name, id_row) {

    let rcr_actived = $("#row_lase_btn_shared_" + id_row + "_der").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + " " + id_row + "<br /><br />" + variable_name + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        let id = encodeURIComponent($("#row_shared_" + id_row + "_id").data("value"));

        $.ajax({
            beforeSend: function () {
                //$("#factlase_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#row_lase_btn_shared_" + id_row + "_edr").prop("disabled", false);
                $("#row_lase_btn_shared_" + id_row + "_rcr").prop("disabled", false);
                $("#row_lase_btn_shared_" + id_row + "_ccr").prop("disabled", false);
                $("#row_lase_btn_shared_" + id_row + "_der").prop("disabled", false);
                $("#row_lase_btn_shared_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/LanguageSetting/DeleteShared?id=" + id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#row_lase_btn_shared_" + id_row + "_edr").prop("disabled", true);
                $("#row_lase_btn_shared_" + id_row + "_rcr").prop("disabled", true);
                $("#row_lase_btn_shared_" + id_row + "_ccr").prop("disabled", true);
                $("#row_lase_btn_shared_" + id_row + "_der").prop("disabled", true);
                $("#row_lase_btn_shared_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_shared_row(id_row);
                refresh_shared_list();

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
        zIndex: 2000,
        buttons: btnNames
    });

}



// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_measure_new = 0;
// Write your JavaScript code.
$('#measure_add_new_row').click(function () {

    let element = document.getElementById("measure_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_measure_new += 1;

    var row = '<tr id="new_row_' + count_measure_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_measure_new_id", "row_measure_new_id_" + count_measure_new);
    row = row.replace("row_measure_new_uom", "row_measure_new_uom_" + count_measure_new);
    row = row.replace("row_measure_new_desc_en", "row_measure_new_desc_en_" + count_measure_new);
    row = row.replace("row_measure_new_desc_es", "row_measure_new_desc_es_" + count_measure_new);
    $("#measure_rows_list tr:first").before(row);

});

$('#measure_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_measure_new = 0;
    return false;
});

$('#measure_save_new_rows').click(function () {

    if (count_measure_new == 0) {
        return;
    }

    $("#measure_filter_uom").prop("disabled", true);

    $("#measure_add_new_row").prop("disabled", true);
    $("#measure_save_new_rows").prop("disabled", true);
    $("#measure_cancel_new_rows").prop("disabled", true);
    $("#measure_refresh_rows").prop("disabled", true);
    $("#measure_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var measure_new_count = $("th[id^='row_measure_new_id_']");
    var datas_measure = [];

    for (var i = 1; i <= measure_new_count.length; i++) {

        var obj = {};

        obj['measure_uom'] = encodeURIComponent($("#row_measure_new_uom_" + i).val());
        obj['measure_desc_en'] = $("#row_measure_new_desc_en_" + i).val();
        obj['measure_desc_es'] = $("#row_measure_new_desc_es_" + i).val();

        datas_measure.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factmeasure_compatibility").attr('disabled', 'disabled');
            $('#measure_rows_list tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('input,select').attr("disabled", true);
                });
                $(this).find('th').each(function () {
                    $(this).find('input').attr("disabled", true);
                });
            });
            
            //$("#area-data-table-" + id).html("Please wait while we get the data...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        data: { 'NewMeasurement': datas_measure },
        url: "/Measurement/SetNewMeasurement",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#measure_filter_uom").prop("disabled", false);

            $("#measure_add_new_row").prop("disabled", false);
            $("#measure_save_new_rows").prop("disabled", false);
            $("#measure_cancel_new_rows").prop("disabled", false);
            $("#measure_refresh_rows").prop("disabled", false);
            $("#measure_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_measure_new = 0;
            refresh_measure_table();

        }
    });

});


function edit_measure_row(id_row) {
    $("#row_measure_" + id_row + "_uom").prop("disabled", false);
    $("#row_measure_" + id_row + "_uom").css({ "background-color": "#fff" });
    $("#row_measure_" + id_row + "_desc_en").prop("disabled", false);
    $("#row_measure_" + id_row + "_desc_es").prop("disabled", false);
    $("#row_measure_" + id_row + "_desc_estype").prop("disabled", false);

    $("#row_measure_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_measure_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_measure_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_measure_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_measure_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_measure_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_measure_row(id_row) {

    $("#row_measure_" + id_row + "_uom").prop("disabled", true);
    $("#row_measure_" + id_row + "_uom").css({ "background-color": "#e9ecef" });
    $("#row_measure_" + id_row + "_desc_en").prop("disabled", true);
    $("#row_measure_" + id_row + "_desc_es").prop("disabled", true);
    $("#row_measure_" + id_row + "_desc_estype").prop("disabled", true);

    $("#row_measure_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_measure_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_measure_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_measure_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_measure_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_measure_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_measure_row(id_row) {

    let rcr_actived = $("#row_measure_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_measure = [];
    var obj = {};

    obj['measure_id'] = encodeURIComponent($("#row_measure_" + id_row + "_id").data("value"));
    obj['measure_uom'] = encodeURIComponent($("#row_measure_" + id_row + "_uom").val());
    obj['measure_desc_en'] = $("#row_measure_" + id_row + "_desc_en").val();
    obj['measure_desc_es'] = $("#row_measure_" + id_row + "_desc_es").val();

    data_edit_measure.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factmeasure_compatibility").attr('disabled', 'disabled');

            // deshabilitar controles
            $("#measure_filter_uom").prop("disabled", true);
            // deshabilitar botones
            $("#measure_add_new_row").prop("disabled", true);
            $("#measure_save_new_rows").prop("disabled", true);
            $("#measure_cancel_new_rows").prop("disabled", true);
            $("#measure_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_measure_" + id_row + "_uom").prop("disabled", true);
            $("#row_measure_" + id_row + "_uom").css({ "background-color": "#e9ecef" });
            $("#row_measure_" + id_row + "_desc_en").prop("disabled", true);
            $("#row_measure_" + id_row + "_desc_es").prop("disabled", true);

            $("#row_measure_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeMeasurement': data_edit_measure },
        url: "/Measurement/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#measure_filter_uom").prop("disabled", false);

            $("#measure_add_new_row").prop("disabled", false);
            $("#measure_save_new_rows").prop("disabled", false);
            $("#measure_cancel_new_rows").prop("disabled", false);
            $("#measure_refresh_rows").prop("disabled", false);

            $("#row_measure_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_measure_row(id_row);
            //refresh_measure_table();

        }
    });

}

function delete_measure_row(delete_body_message_var, id_row) {

    let measure_id = encodeURIComponent($("#row_measure_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factmeasure_compatibility").attr('disabled', 'disabled');

                // deshabilitar controles
                $("#measure_filter_uom").prop("disabled", true);
                // deshabilitar botones
                $("#measure_add_new_row").prop("disabled", true);
                $("#measure_save_new_rows").prop("disabled", true);
                $("#measure_cancel_new_rows").prop("disabled", true);
                $("#measure_refresh_rows").prop("disabled", true);

                $("#row_measure_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/Measurement/DeleteMeasurement?measure_id=" + measure_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#measure_filter_uom").prop("disabled", false);

                $("#measure_add_new_row").prop("disabled", false);
                $("#measure_save_new_rows").prop("disabled", false);
                $("#measure_cancel_new_rows").prop("disabled", false);
                $("#measure_refresh_rows").prop("disabled", false);

                $("#row_measure_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_measure_row(id_row);
                refresh_measure_table();

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

$('#measure_filter_uom').on('change', function () {
    refresh_measure_table();
});
$('#measure_filter_cat').on('change', function () {
    refresh_measure_table();
});

function refresh_measure_table() {

    let filter_uom = encodeURIComponent($("#measure_filter_uom").val());
    //let filter_cat = $("#measure_filter_cat").val();

    $.ajax({
        beforeSend: function () {
            //$("#factmeasure_compatibility").attr('disabled', 'disabled');

            $("#measure_filter_uom").prop("disabled", true);

            $("#measure_add_new_row").prop("disabled", true);
            $("#measure_save_new_rows").prop("disabled", true);
            $("#measure_cancel_new_rows").prop("disabled", true);
            $("#measure_refresh_rows").prop("disabled", true);
            $("#measure_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#measure_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/Measurement/RefreshTable?filter_uom=" + filter_uom,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#measure_filter_uom").prop("disabled", false);

            $("#measure_add_new_row").prop("disabled", false);
            $("#measure_save_new_rows").prop("disabled", false);
            $("#measure_cancel_new_rows").prop("disabled", false);
            $("#measure_refresh_rows").prop("disabled", false);
            $("#measure_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#measure_rows_list').html("");
            $('#measure_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';

                
                columns += '<th scope="row" id="row_measure_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                
                columns += '<td style="padding: 2px;"><input id="row_measure_' + (indexi + 1) + '_desc_en" type="text" class="form-control" value="' + valueA["DescriptionEn"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_measure_' + (indexi + 1) + '_desc_es" type="text" class="form-control" value="' + valueA["DescriptionEs"] + '" disabled="disabled"></td>';
                
                columns += '<td style="padding: 2px;">';
                columns += '<select type="select" id="row_measure_' + (indexi + 1) + '_uom" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';

                $.each(myList.CollectionB, function (indexj, valueB) {

                    if (valueA["IdUOMNum"] == valueB["IdNum"]) {
                        columns += '<option value="' + valueB["Id"] + '" selected="selected">' + (window.language_short == "es" ? valueB["UOMNameSp"] : valueB["UOMNameEn"]) + '</option>';
                    }
                    else {
                        columns += '<option value="' + valueB["Id"] + '">' + (window.language_short == "es" ? valueB["UOMNameSp"] : valueB["UOMNameEn"]) + '</option>';
                    }

                });

                columns += '</select>';
                columns += '</td>';

                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_measure_btn_' + (indexi + 1) + '_edr" onClick="edit_measure_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_measure_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_measure_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_measure_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_measure_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_measure_btn_' + (indexi + 1) + '_der" onClick="delete_measure_row(\'' + valueA["DescriptionEn"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 


            });

            // Row hidden

            columns += '<tr id="measure_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_measure_new_id">-</th>';
            
            columns += '<td style="padding: 2px;"><input id="row_measure_new_desc_en" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_measure_new_desc_es" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_measure_new_uom" class="custom-select">';

            $.each(myList.CollectionB, function (indexj, valueB) {

                columns += '<option value="' + valueB["Id"] + '">' + (window.language_short == "es" ? valueB["UOMNameSp"] : valueB["UOMNameEn"]) + '</option>';

            });

            columns += '</select>';
            columns += '</td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#measure_rows_list").append(columns);
            count_measure_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}


$('#measure_list_add_edit_uom').click(function () {

    refresh_uom_list("uom");

});

function refresh_uom_list(tipo) {
    
    $.ajax({
        beforeSend: function () {
            //$("#factmeasure_compatibility").attr('disabled', 'disabled');
            if (tipo == "uom") {
                $("#data_loading_uom").css({ "display": "block", "margin": "auto" });
                $("#data_list_uom").css({ "display": "none" });
            } else {
                $("#data_loading_uom").css({ "display": "block", "margin": "auto" });
                $("#data_list_uom").css({ "display": "none" });
            }
            

        },
        url: "/Measurement/RefreshList?type=" + tipo,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);
            let rowsA = '';
            let rowsB = '';

            if (tipo == "uom") {
                $('#measure_list_add_uom').html("");
                $('#measure_list_edit_uom').html("");
                $("#measure_filter_uom").find('option').remove();
                $('#measure_filter_uom').append($('<option>', { value: 'All', text: (window.language_short == "es" ? 'Todo' : 'All') }));
                
                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + (indexi + 1) + '. ' + (window.language_short == "es" ? valueA["UOMNameSp"] : valueA["UOMNameEn"]) + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_uom_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_uom_' + (indexi + 1) + '_name_en" type="text" class="form-control custom-input" value="' + valueA["UOMNameEn"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;"><input id="row_uom_' + (indexi + 1) + '_name_es" type="text" class="form-control custom-input" value="' + valueA["UOMNameSp"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;"><input id="row_uom_' + (indexi + 1) + '_symbol" type="text" class="form-control custom-input" value="' + valueA["Symbol"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_measure_btn_uom_' + (indexi + 1) + '_edr" onClick="edit_uom_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_measure_btn_uom_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_uom_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_measure_btn_uom_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_uom_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_measure_btn_uom_' + (indexi + 1) + '_der" onClick="delete_uom_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>'; 

                    $('#measure_filter_uom').append($('<option>', { value: valueA["Id"], text: (window.language_short == "es" ? valueA["UOMNameSp"] : valueA["UOMNameEn"]) }));

                });

                $('#measure_list_add_uom').append(rowsA);
                $('#measure_list_edit_uom').append(rowsB);

                $("#data_loading_uom").css({ "display": "none", "margin": "auto" });
                $("#data_list_uom").css({ "display": "block" });

            } else {
                /*
                $('#measure_list_add_cat').html("");
                $('#measure_list_edit_cat').html("");
                $("#measure_filter_cat").find('option').remove();
                $('#measure_filter_cat').append($('<option>', { value: 'All', text: 'Todos' }));

                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + valueA["Id"] + '. ' + valueA["CategoryName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_cat_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + valueA["Id"] + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_cat_' + (indexi + 1) + '_desc_en" type="text" class="form-control custom-input" value="' + valueA["CategoryName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_measure_btn_cat_' + (indexi + 1) + '_edr" onClick="editcatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_measure_btn_cat_' + (indexi + 1) + '_rcr" onClick="realizarcambioscatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_measure_btn_cat_' + (indexi + 1) + '_ccr" onClick="cancelarcambiocatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_measure_btn_cat_' + (indexi + 1) + '_der" onClick="deletecatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>';

                    $('#measure_filter_cat').append($('<option>', { value: valueA["Id"], text: valueA["CategoryName"] }));

                });

                $('#measure_list_add_cat').append(rowsA);
                $('#measure_list_edit_cat').append(rowsB);

                $("#data_loading_cat").css({ "display": "none", "margin": "auto" });
                $("#data_list_cat").css({ "display": "block" });
                
                */

            }

        }
    });
    

}


function btn_measure_uom_add_new() {

    $("#btn_measure_uom_add_new").prop("disabled", true);
    $("#measure_uom_name_es_add_new").prop("readonly", true);
    $("#measure_uom_name_en_add_new").prop("readonly", true);
    $("#measure_uom_symbol_add_new").prop("readonly", true);

    let uom_name_es = $("#measure_uom_name_es_add_new").val();
    let uom_name_en = $("#measure_uom_name_en_add_new").val();
    let uom_symbol = $("#measure_uom_symbol_add_new").val();
    
    $.ajax({
        beforeSend: function () {
            
            $("#btn_measure_uom_add_new").html("Añadiendo...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        url: "/Measurement/SaveNewItem?name_es=" + uom_name_es + "&name_en=" + uom_name_en + "&symbol=" + uom_symbol,
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#btn_measure_uom_add_new").html("Añadir");
            $("#btn_measure_uom_add_new").prop("disabled", false);
            $("#measure_uom_name_es_add_new").prop("readonly", false);
            $("#measure_uom_name_en_add_new").prop("readonly", false);
            $("#measure_uom_symbol_add_new").prop("readonly", false);

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            $("#measure_uom_name_es_add_new").val("");
            $("#measure_uom_name_en_add_new").val("");
            $("#measure_uom_symbol_add_new").val("");
            refresh_uom_list("uom");

        }
    });

}

// modals edit and cancel

function edit_uom_row(id_row) {
    $("#row_uom_" + id_row + "_name_en").prop("disabled", false);
    $("#row_uom_" + id_row + "_name_es").prop("disabled", false);
    $("#row_uom_" + id_row + "_symbol").prop("disabled", false);

    $("#row_measure_btn_uom_" + id_row + "_edr").css({ "display": "none" });
    $("#row_measure_btn_uom_" + id_row + "_der").css({ "display": "none" });
    $("#row_measure_btn_uom_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_measure_btn_uom_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_measure_btn_uom_" + id_row + "_rcr").data("actived", 1);
    $("#row_measure_btn_uom_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_uom_row(id_row) {
    $("#row_uom_" + id_row + "_name_en").prop("disabled", true);
    $("#row_uom_" + id_row + "_name_es").prop("disabled", true);
    $("#row_uom_" + id_row + "_symbol").prop("disabled", true);

    $("#row_measure_btn_uom_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_measure_btn_uom_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_measure_btn_uom_" + id_row + "_edr").css({ "display": "block" });
    $("#row_measure_btn_uom_" + id_row + "_der").css({ "display": "block" });

    $("#row_measure_btn_uom_" + id_row + "_rcr").data("actived", 0);
    $("#row_measure_btn_uom_" + id_row + "_ccr").data("actived", 0);

}

function realizar_cambios_uom_row(id_row) {

    let rcr_actived = $("#row_measure_btn_uom_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_uom = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_uom_" + id_row + "_id").data("value"));
    obj['UomNameEn'] = $("#row_uom_" + id_row + "_name_en").val();
    obj['UomNameEs'] = $("#row_uom_" + id_row + "_name_es").val();
    obj['Symbol'] = $("#row_uom_" + id_row + "_symbol").val();

    data_uom.push(obj);

    $.ajax({
        beforeSend: function () {

            // deshabilitar entradas
            $("#row_uom_" + id_row + "_name_en").prop("disabled", true);
            $("#row_uom_" + id_row + "_name_es").prop("disabled", true);
            $("#row_uom_" + id_row + "_symbol").prop("disabled", true);

            $("#row_measure_btn_uom_" + id_row + "_edr").prop("disabled", false);
            $("#row_measure_btn_uom_" + id_row + "_rcr").prop("disabled", false);
            $("#row_measure_btn_uom_" + id_row + "_ccr").prop("disabled", false);
            $("#row_measure_btn_uom_" + id_row + "_der").prop("disabled", false);
            
            $("#row_measure_btn_uom_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_uom },
        url: "/Measurement/SaveChangesUom",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_measure_btn_uom_" + id_row + "_edr").prop("disabled", true);
            $("#row_measure_btn_uom_" + id_row + "_rcr").prop("disabled", true);
            $("#row_measure_btn_uom_" + id_row + "_ccr").prop("disabled", true);
            $("#row_measure_btn_uom_" + id_row + "_der").prop("disabled", true);
            $("#row_measure_btn_uom_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_uom_row(id_row);
            refresh_uom_list("uom");

        }
    });

}

function delete_uom_row(id_row) {

    let rcr_actived = $("#row_measure_btn_uom_" + id_row + "_der").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    let id = encodeURIComponent($("#row_uom_" + id_row + "_id").data("value"));

    $.ajax({
        beforeSend: function () {
            //$("#factmeasure_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#row_measure_btn_uom_" + id_row + "_edr").prop("disabled", false);
            $("#row_measure_btn_uom_" + id_row + "_rcr").prop("disabled", false);
            $("#row_measure_btn_uom_" + id_row + "_ccr").prop("disabled", false);
            $("#row_measure_btn_uom_" + id_row + "_der").prop("disabled", false);
            $("#row_measure_btn_uom_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
        },
        url: "/Measurement/DeleteUom?id=" + id,
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_measure_btn_uom_" + id_row + "_edr").prop("disabled", true);
            $("#row_measure_btn_uom_" + id_row + "_rcr").prop("disabled", true);
            $("#row_measure_btn_uom_" + id_row + "_ccr").prop("disabled", true);
            $("#row_measure_btn_uom_" + id_row + "_der").prop("disabled", true);
            $("#row_measure_btn_uom_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_uom_row(id_row);
            refresh_uom_list("uom");

        }
    });

}