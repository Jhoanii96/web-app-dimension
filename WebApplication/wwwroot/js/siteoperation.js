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






