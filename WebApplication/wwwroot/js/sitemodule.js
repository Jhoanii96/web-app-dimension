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







