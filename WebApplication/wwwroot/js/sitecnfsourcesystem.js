// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let count_cnf_sosy_new = 0;
// Write your JavaScript code.
$('#cnf_sosy_add_new_row').click(function () {

    let element = document.getElementById("cnf_sosy_row_example_hidden")
    let newelement = element.cloneNode(true)
    count_cnf_sosy_new += 1;

    var row = '<tr id="new_row_' + count_cnf_sosy_new + '">' + newelement.innerHTML + '</tr>';
    row = row.replace("row_cnf_sosy_new_id", "row_cnf_sosy_new_id_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_schemasourcename", "row_cnf_sosy_new_schemasourcename_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_schematargetname", "row_cnf_sosy_new_schematargetname_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_tablename", "row_cnf_sosy_new_tablename_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_foldername", "row_cnf_sosy_new_foldername_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_secretservername", "row_cnf_sosy_new_secretservername_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_secretauthname", "row_cnf_sosy_new_secretauthname_" + count_cnf_sosy_new);
    row = row.replace("row_cnf_sosy_new_username", "row_cnf_sosy_new_username_" + count_cnf_sosy_new);
    $("#cnf_sosy_rows_list tr:first").before(row);

});

$('#cnf_sosy_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_cnf_sosy_new = 0;
    return false;
});

$('#cnf_sosy_save_new_rows').click(function () {

    if (count_cnf_sosy_new == 0) {
        return;
    }

    $("#cnf_sosy_add_new_row").prop("disabled", true);
    $("#cnf_sosy_save_new_rows").prop("disabled", true);
    $("#cnf_sosy_cancel_new_rows").prop("disabled", true);
    $("#cnf_sosy_refresh_rows").prop("disabled", true);
    $("#cnf_sosy_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var sosy_new_count = $("th[id^='row_cnf_sosy_new_id_']");
    var datas_cnf_sosy = [];

    for (var i = 1; i <= sosy_new_count.length; i++) {

        var obj = {};

        obj['cnf_sosy_schema_source_name'] = $("#row_cnf_sosy_new_schemasourcename_" + i).val();
        obj['cnf_sosy_schema_target_name'] = $("#row_cnf_sosy_new_schematargetname_" + i).val();
        obj['cnf_sosy_table_name'] = $("#row_cnf_sosy_new_tablename_" + i).val();
        obj['cnf_sosy_folder_name'] = $("#row_cnf_sosy_new_foldername_" + i).val();
        obj['cnf_sosy_secret_server_name'] = $("#row_cnf_sosy_new_secretservername_" + i).val();
        obj['cnf_sosy_secret_auth_name'] = $("#row_cnf_sosy_new_secretauthname_" + i).val();
        obj['cnf_sosy_user_name'] = $("#row_cnf_sosy_new_username_" + i).val();

        datas_cnf_sosy.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factsosy_compatibility").attr('disabled', 'disabled');
            $('#cnf_sosy_rows_list tr').each(function () {
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
        data: { 'NewCnfSourceSystem': datas_cnf_sosy },
        url: "/CnfSourceSystem/SetNewCnfSourceSystems",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#cnf_sosy_add_new_row").prop("disabled", false);
            $("#cnf_sosy_save_new_rows").prop("disabled", false);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", false);
            $("#cnf_sosy_refresh_rows").prop("disabled", false);
            $("#cnf_sosy_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_cnf_sosy_new = 0;
            refresh_cnf_sosy_table();

        }
    });

});


function edit_cnf_sosy_row(id_row) {

    $("#row_cnf_sosy_" + id_row + "_schemasourcename").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_schematargetname").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_tablename").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_foldername").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_secretservername").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_secretauthname").prop("disabled", false);
    $("#row_cnf_sosy_" + id_row + "_username").prop("disabled", false);

    $("#row_cnf_sosy_btn_" + id_row + "_edr").css({ "display": "none" });
    $("#row_cnf_sosy_btn_" + id_row + "_der").css({ "display": "none" });
    $("#row_cnf_sosy_btn_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_cnf_sosy_btn_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_cnf_sosy_btn_" + id_row + "_rcr").data("actived", 1);
    $("#row_cnf_sosy_btn_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_cnf_sosy_row(id_row) {

    $("#row_cnf_sosy_" + id_row + "_schemasourcename").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_schematargetname").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_tablename").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_foldername").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_secretservername").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_secretauthname").prop("disabled", true);
    $("#row_cnf_sosy_" + id_row + "_username").prop("disabled", true);
    
    $("#row_cnf_sosy_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_cnf_sosy_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_cnf_sosy_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_cnf_sosy_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_cnf_sosy_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_cnf_sosy_btn_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_cnf_sosy_row(id_row) {

    let rcr_actived = $("#row_cnf_sosy_btn_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_edit_cnf_sosy = [];
    var obj = {};

    obj['cnf_sosy_id'] = encodeURIComponent($("#row_cnf_sosy_" + id_row + "_id").data("value"));
    obj['cnf_sosy_schema_source_name'] = $("#row_cnf_sosy_" + id_row + "_schemasourcename").val();
    obj['cnf_sosy_schema_target_name'] = $("#row_cnf_sosy_" + id_row + "_schematargetname").val();
    obj['cnf_sosy_table_name'] = $("#row_cnf_sosy_" + id_row + "_tablename").val();
    obj['cnf_sosy_folder_name'] = $("#row_cnf_sosy_" + id_row + "_foldername").val();
    obj['cnf_sosy_secret_server_name'] = $("#row_cnf_sosy_" + id_row + "_secretservername").val();
    obj['cnf_sosy_secret_auth_name'] = $("#row_cnf_sosy_" + id_row + "_secretauthname").val();
    obj['cnf_sosy_user_name'] = $("#row_cnf_sosy_" + id_row + "_username").val();

    data_edit_cnf_sosy.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factsosy_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#cnf_sosy_add_new_row").prop("disabled", true);
            $("#cnf_sosy_save_new_rows").prop("disabled", true);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", true);
            $("#cnf_sosy_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#row_cnf_sosy_" + id_row + "_schemasourcename").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_schematargetname").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_tablename").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_foldername").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_secretservername").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_secretauthname").prop("disabled", true);
            $("#row_cnf_sosy_" + id_row + "_username").prop("disabled", true);

            $("#row_cnf_sosy_btn_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeCnfSourceSystem': data_edit_cnf_sosy },
        url: "/CnfSourceSystem/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#cnf_sosy_add_new_row").prop("disabled", false);
            $("#cnf_sosy_save_new_rows").prop("disabled", false);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", false);
            $("#cnf_sosy_refresh_rows").prop("disabled", false);

            $("#row_cnf_sosy_btn_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_cnf_sosy_row(id_row);
            //refresh_cnf_sosy_table();

        }
    });

}

function delete_cnf_sosy_row(delete_body_message_var, id_row) {

    let sosy_id = encodeURIComponent($("#row_cnf_sosy_" + id_row + "_id").data("value"));

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factsosy_compatibility").attr('disabled', 'disabled');

                // deshabilitar botones
                $("#cnf_sosy_add_new_row").prop("disabled", true);
                $("#cnf_sosy_save_new_rows").prop("disabled", true);
                $("#cnf_sosy_cancel_new_rows").prop("disabled", true);
                $("#cnf_sosy_refresh_rows").prop("disabled", true);

                $("#row_cnf_sosy_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/CnfSourceSystem/DeleteCnfSourceSystem?sosy_id=" + sosy_id,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#cnf_sosy_add_new_row").prop("disabled", false);
                $("#cnf_sosy_save_new_rows").prop("disabled", false);
                $("#cnf_sosy_cancel_new_rows").prop("disabled", false);
                $("#cnf_sosy_refresh_rows").prop("disabled", false);

                $("#row_cnf_sosy_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_cnf_sosy_row(id_row);
                refresh_cnf_sosy_table();

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

function refresh_cnf_sosy_table() {

    $.ajax({
        beforeSend: function () {
            //$("#factsosy_compatibility").attr('disabled', 'disabled');

            $("#cnf_sosy_add_new_row").prop("disabled", true);
            $("#cnf_sosy_save_new_rows").prop("disabled", true);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", true);
            $("#cnf_sosy_refresh_rows").prop("disabled", true);
            $("#cnf_sosy_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#cnf_sosy_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/CnfSourceSystem/RefreshTable",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#cnf_sosy_add_new_row").prop("disabled", false);
            $("#cnf_sosy_save_new_rows").prop("disabled", false);
            $("#cnf_sosy_cancel_new_rows").prop("disabled", false);
            $("#cnf_sosy_refresh_rows").prop("disabled", false);
            $("#cnf_sosy_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#cnf_sosy_rows_list').html("");
            $('#cnf_sosy_rows_list').removeAttr("style");
            let columns = '';

            $.each(myList.CollectionA, function (indexi, valueA) {

                columns += '<tr>';
                
                columns += '<th scope="row" id="row_cnf_sosy_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_schemasourcename" type="text" class="form-control" value="' + valueA["SchemaSourceName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_schematargetname" type="text" class="form-control" value="' + valueA["SchemaTargetName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_tablename" type="text" class="form-control" value="' + valueA["TableName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_foldername" type="text" class="form-control" value="' + valueA["FolderName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_secretservername" type="text" class="form-control" value="' + valueA["SecretServerName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_secretauthname" type="text" class="form-control" value="' + valueA["SecretAuthName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_' + (indexi + 1) + '_username" type="text" class="form-control" value="' + valueA["UserName"] + '" disabled="disabled"></td>';
                columns += '<td style="padding: 2px;">';
                columns += '<div class="input-group">';
                columns += '<button type="button" id="row_cnf_sosy_btn_' + (indexi + 1) + '_edr" onClick="edit_cnf_sosy_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_cnf_sosy_btn_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_cnf_sosy_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_cnf_sosy_btn_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_cnf_sosy_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                columns += '<button type="button" id="row_cnf_sosy_btn_' + (indexi + 1) + '_der" onClick="delete_cnf_sosy_row(\'' + (indexi + 1) + '. ' + valueA["TableName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                columns += '</div>';
                columns += '</td>';
                
                columns += '</tr>'; 

            });

            // Row hidden

            columns += '<tr id="cnf_sosy_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_cnf_sosy_new_id"></th>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_schemasourcename" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_schematargetname" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_tablename" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_foldername" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_secretservername" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_secretauthname" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_cnf_sosy_new_username" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#cnf_sosy_rows_list").append(columns);
            count_cnf_sosy_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}






