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