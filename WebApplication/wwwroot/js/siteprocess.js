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






