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


