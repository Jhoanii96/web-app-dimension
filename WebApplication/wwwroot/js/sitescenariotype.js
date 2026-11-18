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






