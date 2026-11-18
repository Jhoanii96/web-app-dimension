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






