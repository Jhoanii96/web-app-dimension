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






