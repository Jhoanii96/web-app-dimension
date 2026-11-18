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






