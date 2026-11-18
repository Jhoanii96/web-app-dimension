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






