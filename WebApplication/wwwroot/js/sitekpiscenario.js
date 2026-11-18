// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
//let count_kpisce_new = 0;
// Write your JavaScript code.
//$('#kpisce_add_new_row').click(function () {

//    let element = document.getElementById("kpisce_row_example_hidden");
//    let newelement = element.cloneNode(true);
//    count_kpisce_new += 1;

//    var row = '<tr id="new_row_' + count_kpisce_new + '">' + newelement.innerHTML + '</tr>';
//    row = row.replace("row_kpisce_new_id", "row_kpisce_new_id_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_kpi", "row_kpisce_new_kpi_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_source", "row_kpisce_new_source_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_table_name", "row_kpisce_new_table_name_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_column_name_date", "row_kpisce_new_column_name_date_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_column_name_shift", "row_kpisce_new_column_name_shift_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_column_name_value", "row_kpisce_new_column_name_value_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_filter_additional", "row_kpisce_new_filter_additional_" + count_kpisce_new);
//    row = row.replace("row_kpisce_new_parameters", "row_kpisce_new_parameters_" + count_kpisce_new);
//    $("#kpisce_rows_list tr:first").before(row);

//});

$('#kpisce_cancel_new_rows').click(function () {
    $("[id^='new_row_']").remove();
    count_kpisce_new = 0;
    return false;
});

/*
$('#kpisce_save_new_rows').click(function () {

    if (count_kpisce_new == 0) {
        return;
    }

    $("#kpisce_filter_kpi").prop("disabled", true);
    $("#kpisce_filter_source").prop("disabled", true);

    $("#kpisce_add_new_row").prop("disabled", true);
    $("#kpisce_save_new_rows").prop("disabled", true);
    $("#kpisce_cancel_new_rows").prop("disabled", true);
    $("#kpisce_refresh_rows").prop("disabled", true);
    $("#kpisce_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardando...');

    var kpisce_new_count = $("th[id^='row_kpisce_new_id_']");
    var datas_kpisce = [];

    for (var i = 1; i <= kpisce_new_count.length; i++) {

        var obj = {};

        obj['kpisce_kpi'] = encodeURIComponent($("#row_kpisce_new_kpi_" +  i).val());
        obj['kpisce_source'] = encodeURIComponent($("#row_kpisce_new_source_" + i).val());
        obj['kpisce_table_name'] = $("#row_kpisce_new_table_name_" + i).val();
        obj['kpisce_column_name_date'] = $("#row_kpisce_new_column_name_date_" + i).val();
        obj['kpisce_column_name_shift'] = $("#row_kpisce_new_column_name_shift_" + i).val();
        obj['kpisce_column_name_value'] = $("#row_kpisce_new_column_name_value_" + i).val();
        obj['kpisce_filter_additional'] = $("#row_kpisce_new_filter_additional_" + i).val();
        obj['kpisce_parameters'] = $("#row_kpisce_new_parameters_" + i).val();

        datas_kpisce.push(obj);

    }

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');
            $('#kpisce_rows_list tr').each(function () {
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
        data: { 'NewKPIScenario': datas_kpisce }, 
        url: "/KPIScenario/SetNewKPIScenarios",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#kpisce_filter_kpi").prop("disabled", false);
            $("#kpisce_filter_source").prop("disabled", false);

            $("#kpisce_add_new_row").prop("disabled", false);
            $("#kpisce_save_new_rows").prop("disabled", false);
            $("#kpisce_cancel_new_rows").prop("disabled", false);
            $("#kpisce_refresh_rows").prop("disabled", false);
            $("#kpisce_save_new_rows").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            count_kpisce_new = 0;
            refresh_kpisce_table();

        }
    });

});
*/

function edit_kpisce_row(id_row) {

    edit_kpisce_refresh_modal(id_row);

}

function edit_kpisce_refresh_modal(id_row) {

    let kpisce_id = encodeURIComponent($("#row_kpisce_" + id_row + "_id").data("value"));
    let kpisce_kpi = encodeURIComponent($("#row_kpisce_" + id_row + "_kpi").val());
    let kpisce_source = encodeURIComponent($("#row_kpisce_" + id_row + "_source").val());

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');
            $("#data_loading_edit_kpisce").css({ "display": "block", "margin": "auto" });
            $("#data_list_edit_kpisce").css({ "display": "none" });

        },
        url: "/KPIScenario/GetKPIScenarioInfo?num1=" + kpisce_kpi + "&num2=" + kpisce_id + "&num3=" + kpisce_source,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#kpisce_select_modal_edit_kpi").find('option').remove();
            $('#kpisce_select_modal_edit_kpi').append($('<option>', { value: '-', text: 'Seleccionar' }));
            $("#kpisce_select_modal_edit_source").find('option').remove();
            $('#kpisce_select_modal_edit_source').append($('<option>', { value: '-', text: 'Seleccionar' }));

            $.each(myList.CollectionB, function (indexi, valueA) {

                $('#kpisce_select_modal_edit_kpi').append($('<option>', { value: valueA["Id"], text: (window.language_short == "es" ? valueA["KPINameEs"] : valueA["KPINameEn"]) }));

            });
            $.each(myList.CollectionC, function (indexi, valueB) {

                $('#kpisce_select_modal_edit_source').append($('<option>', { value: valueB["Id"], text: valueB["SourceName"] }));

            });
            
            $("#kpisce_select_modal_edit_kpi").val(myList.CollectionA[0].IdKPI);
            $("#kpisce_select_modal_edit_source").val(myList.CollectionA[0].IdSource);
            $("#kpisce_select_modal_edit_kpi").prop("disabled", true);
            $("#kpisce_select_modal_edit_source").prop("disabled", true);
            $("#kpisce_input_modal_edit_tablename").val(myList.CollectionA[0].TableName);
            $("#kpisce_input_modal_edit_colnamedate").val(myList.CollectionA[0].ColumnNameDate);
            $("#kpisce_input_modal_edit_colnameshift").val(myList.CollectionA[0].ColumnNameShift);
            $("#kpisce_input_modal_edit_colnamevalue").val(myList.CollectionA[0].ColumnNameValue);
            $("#kpisce_input_modal_edit_filteradd").val(myList.CollectionA[0].FilterAdditional);
            $("#kpisce_input_modal_edit_parameters").val(myList.CollectionA[0].Parameters);
            $("#kpisce_btn_modal_edit").data("editid", id_row); 

            $("#data_loading_edit_kpisce").css({ "display": "none", "margin": "auto" });
            $("#data_list_edit_kpisce").css({ "display": "flex" });

            let source_select = $("#kpisce_select_modal_edit_source").find(":selected").text();

            if (source_select == "N.A.") {
                $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
                $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
                $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
                $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", true);
                $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
                $("#kpisce_input_modal_edit_parameters").prop("disabled", true);
            } else {
                if (source_select == "FORMULA") {
                    $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
                    $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
                    $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
                    $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
                    $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
                    $("#kpisce_input_modal_edit_parameters").prop("disabled", false);
                } else {
                    $("#kpisce_input_modal_edit_tablename").prop("disabled", false);
                    $("#kpisce_input_modal_edit_colnamedate").prop("disabled", false);
                    $("#kpisce_input_modal_edit_colnameshift").prop("disabled", false);
                    $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
                    $("#kpisce_input_modal_edit_filteradd").prop("disabled", false);
                    $("#kpisce_input_modal_edit_parameters").prop("disabled", true);
                }
            }

        }
    });


}

//$("#Modal_edit_KPI_Scenario > div > div > div.modal-footer > button").click(function () {

    //$("#kpisce_select_modal_edit_kpi").val("-");
    //$("#kpisce_select_modal_edit_source").val("-");
    //$("#kpisce_input_modal_edit_tablename").val("");
    //$("#kpisce_input_modal_edit_colnamedate").val("");
    //$("#kpisce_input_modal_edit_colnameshift").val("");
    //$("#kpisce_input_modal_edit_colnamevalue").val("");
    //$("#kpisce_input_modal_edit_filteradd").val("");
    //$("#kpisce_input_modal_edit_parameters").val("");
    //$("#kpisce_btn_modal_edit").data("editid", ""); 

//    alert("dsadsa");

//});

function select_modal_add_change_source() {

    let source_select = $("#kpisce_select_modal_add_source").find(":selected").text();

    if (source_select == "N.A." || $("#kpisce_select_modal_add_source").val() == "-") {
        $("#kpisce_input_modal_add_tablename").prop("disabled", true);
        $("#kpisce_input_modal_add_colnamedate").prop("disabled", true);
        $("#kpisce_input_modal_add_colnameshift").prop("disabled", true);
        $("#kpisce_input_modal_add_colnamevalue").prop("disabled", true);
        $("#kpisce_input_modal_add_filteradd").prop("disabled", true);
        $("#kpisce_input_modal_add_parameters").prop("disabled", true);

        $("#kpisce_input_modal_add_tablename").val("");
        $("#kpisce_input_modal_add_colnamedate").val("");
        $("#kpisce_input_modal_add_colnameshift").val("");
        $("#kpisce_input_modal_add_filteradd").val("");
        $("#kpisce_input_modal_add_colnamevalue").val("");
        $("#kpisce_input_modal_add_parameters").val("");
    } else {
        if (source_select == "FORMULA") {
            $("#kpisce_input_modal_add_tablename").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_add_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_add_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_add_parameters").prop("disabled", false);

            $("#kpisce_input_modal_add_tablename").val("");
            $("#kpisce_input_modal_add_colnamedate").val("");
            $("#kpisce_input_modal_add_colnameshift").val("");
            $("#kpisce_input_modal_add_filteradd").val("");
            $("#kpisce_input_modal_add_colnamevalue").val("");
            $("#kpisce_input_modal_add_parameters").val("");
        } else {
            $("#kpisce_input_modal_add_tablename").prop("disabled", false);
            $("#kpisce_input_modal_add_colnamedate").prop("disabled", false);
            $("#kpisce_input_modal_add_colnameshift").prop("disabled", false);
            $("#kpisce_input_modal_add_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_add_filteradd").prop("disabled", false);
            $("#kpisce_input_modal_add_parameters").prop("disabled", true);

            $("#kpisce_input_modal_add_tablename").val("");
            $("#kpisce_input_modal_add_colnamedate").val("");
            $("#kpisce_input_modal_add_colnameshift").val("");
            $("#kpisce_input_modal_add_filteradd").val("");
            $("#kpisce_input_modal_add_colnamevalue").val("");
            $("#kpisce_input_modal_add_parameters").val("");
        }

    }

}

function select_modal_edit_change_source() {

    let source_select = $("#kpisce_select_modal_edit_source").find(":selected").text();

    if (source_select == "N.A." || $("#kpisce_select_modal_edit_source").val() == "-") {
        $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
        $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
        $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
        $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", true);
        $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
        $("#kpisce_input_modal_edit_parameters").prop("disabled", true);

        $("#kpisce_input_modal_edit_tablename").val("");
        $("#kpisce_input_modal_edit_colnamedate").val("");
        $("#kpisce_input_modal_edit_colnameshift").val("");
        $("#kpisce_input_modal_edit_filteradd").val("");
        $("#kpisce_input_modal_edit_colnamevalue").val("");
        $("#kpisce_input_modal_edit_parameters").val("");
    } else {
        if (source_select == "FORMULA") {
            $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_edit_parameters").prop("disabled", false);

            $("#kpisce_input_modal_edit_tablename").val("");
            $("#kpisce_input_modal_edit_colnamedate").val("");
            $("#kpisce_input_modal_edit_colnameshift").val("");
            $("#kpisce_input_modal_edit_filteradd").val("");
            $("#kpisce_input_modal_edit_colnamevalue").val("");
            $("#kpisce_input_modal_edit_parameters").val("");
        } else {
            $("#kpisce_input_modal_edit_tablename").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnamedate").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnameshift").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_edit_filteradd").prop("disabled", false);
            $("#kpisce_input_modal_edit_parameters").prop("disabled", true);

            $("#kpisce_input_modal_edit_tablename").val("");
            $("#kpisce_input_modal_edit_colnamedate").val("");
            $("#kpisce_input_modal_edit_colnameshift").val("");
            $("#kpisce_input_modal_edit_filteradd").val("");
            $("#kpisce_input_modal_edit_colnamevalue").val("");
            $("#kpisce_input_modal_edit_parameters").val("");
        }

    }

}

function cancelar_cambios_kpisce_row(id_row) {

    $("#row_kpisce_" + id_row + "_kpi").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_source").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_kpi").css({ "background-color": "#e9ecef" });
    $("#row_kpisce_" + id_row + "_source").css({ "background-color": "#e9ecef" });
    $("#row_kpisce_" + id_row + "_table_name").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_column_name_date").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_column_name_shift").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_column_name_value").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_filter_additional").prop("disabled", true);
    $("#row_kpisce_" + id_row + "_parameters").prop("disabled", true);

    $("#row_kpisce_btn_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_kpisce_btn_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_kpisce_btn_" + id_row + "_edr").css({ "display": "block" });
    $("#row_kpisce_btn_" + id_row + "_der").css({ "display": "block" });

    $("#row_kpisce_btn_" + id_row + "_rcr").data("actived", 0);
    $("#row_kpisce_btn_" + id_row + "_ccr").data("actived", 0);
}

function kpisce_btn_modal_edit() {

    let id_row = $("#kpisce_btn_modal_edit").data("editid"); 
    var attibutevalue = $("#Modal_edit_KPI_Scenario").attr('aria-hidden');

    if (typeof attibutevalue !== 'undefined' && attibutevalue !== false) {
        return;
    }

    if (id_row == "") {
        return;
    }

    var data_edit_kpisce = [];
    var obj = {};

    if ($("#kpisce_select_modal_edit_source").val() == "-") {
        return;
    }

    obj['kpisce_id'] = encodeURIComponent($("#row_kpisce_" + id_row + "_id").data("value"));
    obj['kpisce_kpi'] = encodeURIComponent($("#kpisce_select_modal_edit_kpi").val());
    obj['kpisce_source'] = encodeURIComponent($("#kpisce_select_modal_edit_source").val());
    obj['kpisce_table_name'] = $("#kpisce_input_modal_edit_tablename").val();
    obj['kpisce_column_name_date'] = $("#kpisce_input_modal_edit_colnamedate").val();
    obj['kpisce_column_name_shift'] = $("#kpisce_input_modal_edit_colnameshift").val();
    obj['kpisce_column_name_value'] = $("#kpisce_input_modal_edit_colnamevalue").val();
    obj['kpisce_filter_additional'] = $("#kpisce_input_modal_edit_filteradd").val();
    obj['kpisce_parameters'] = $("#kpisce_input_modal_edit_parameters").val();

    data_edit_kpisce.push(obj);

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');

            // deshabilitar controles
            $("#kpisce_filter_kpi").prop("disabled", true);
            $("#kpisce_filter_source").prop("disabled", true);
            // deshabilitar botones
            $("#kpisce_add_new_row").prop("disabled", true);
            $("#kpisce_save_new_rows").prop("disabled", true);
            $("#kpisce_cancel_new_rows").prop("disabled", true);
            $("#kpisce_refresh_rows").prop("disabled", true);
            // deshabilitar entradas
            $("#kpisce_select_modal_edit_kpi").prop("disabled", true);
            $("#kpisce_select_modal_edit_source").prop("disabled", true);
            $("#kpisce_select_modal_edit_kpi").css({ "background-color": "#e9ecef" });
            $("#kpisce_select_modal_edit_source").css({ "background-color": "#e9ecef" });
            $("#kpisce_input_modal_edit_tablename").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", true);
            $("#kpisce_input_modal_edit_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_edit_parameters").prop("disabled", true);

            $("#kpisce_btn_modal_edit").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'ChangeKPIScenario': data_edit_kpisce },
        url: "/KPIScenario/SaveChanges",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            // habilitar controles
            $("#kpisce_filter_kpi").prop("disabled", false);
            $("#kpisce_filter_source").prop("disabled", false);
            // habilitar botones
            $("#kpisce_add_new_row").prop("disabled", false);
            $("#kpisce_save_new_rows").prop("disabled", false);
            $("#kpisce_cancel_new_rows").prop("disabled", false);
            $("#kpisce_refresh_rows").prop("disabled", false);
            // habilitar entradas
            $("#kpisce_select_modal_edit_kpi").prop("disabled", false);
            $("#kpisce_select_modal_edit_source").prop("disabled", false);
            $("#kpisce_select_modal_edit_kpi").css({ "background-color": "#ffffff" });
            $("#kpisce_select_modal_edit_source").css({ "background-color": "#ffffff" });
            $("#kpisce_input_modal_edit_tablename").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnamedate").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnameshift").prop("disabled", false);
            $("#kpisce_input_modal_edit_colnamevalue").prop("disabled", false);
            $("#kpisce_input_modal_edit_filteradd").prop("disabled", false);
            $("#kpisce_input_modal_edit_parameters").prop("disabled", false);

            $("#kpisce_btn_modal_edit").html('Guardar');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            refresh_kpisce_table();

            $("#kpisce_select_modal_edit_kpi").val("-");
            $("#kpisce_select_modal_edit_source").val("-");
            $("#kpisce_input_modal_edit_tablename").val("");
            $("#kpisce_input_modal_edit_colnamedate").val("");
            $("#kpisce_input_modal_edit_colnameshift").val("");
            $("#kpisce_input_modal_edit_colnamevalue").val("");
            $("#kpisce_input_modal_edit_filteradd").val("");
            $("#kpisce_input_modal_edit_parameters").val("");
            $("#kpisce_btn_modal_edit").data("editid", ""); 

            $("#Modal_edit_KPI_Scenario > div > div > div.modal-footer > button").trigger('click');

        }
    });

}

function delete_kpisce_row(delete_body_message_var, id_row) {

    let kpisce_id = encodeURIComponent($("#row_kpisce_" + id_row + "_id").data("value"));
    let kpisce_kpi = encodeURIComponent($("#row_kpisce_" + id_row + "_kpi").val());
    let kpisce_source = encodeURIComponent($("#row_kpisce_" + id_row + "_source").val());

    var btnNames = {};
    $("#dialog-delete-confirm").html(window.delete_body_message + "<br /><br />" + delete_body_message_var + "<br /><br />" + window.delete_body_message2);

    btnNames[window.yes_btn] = function () {
        $(this).dialog('close');

        $.ajax({
            beforeSend: function () {
                //$("#factkpisce_compatibility").attr('disabled', 'disabled');

                // deshabilitar controles
                $("#kpisce_filter_kpi").prop("disabled", true);
                $("#kpisce_filter_source").prop("disabled", true);
                // deshabilitar botones
                $("#kpisce_add_new_row").prop("disabled", true);
                $("#kpisce_save_new_rows").prop("disabled", true);
                $("#kpisce_cancel_new_rows").prop("disabled", true);
                $("#kpisce_refresh_rows").prop("disabled", true);

                $("#row_kpisce_btn_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
            },
            url: "/KPIScenario/DeleteKPIScenario?kpisce_kpi=" + kpisce_kpi + "&kpisce_id=" + kpisce_id + "&kpisce_source=" + kpisce_source,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                var result = resp;
                const message = JSON.parse(resp);

                $("#kpisce_filter_kpi").prop("disabled", false);
                $("#kpisce_filter_source").prop("disabled", false);
                $("#kpisce_add_new_row").prop("disabled", false);
                $("#kpisce_save_new_rows").prop("disabled", false);
                $("#kpisce_cancel_new_rows").prop("disabled", false);
                $("#kpisce_refresh_rows").prop("disabled", false);

                $("#row_kpisce_btn_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

                if (message.Error == true) {
                    toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                } else {
                    toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
                }

                cancelar_cambios_kpisce_row(id_row);
                refresh_kpisce_table();

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

$('#kpisce_filter_kpi').on('change', function () {
    refresh_kpisce_table();
});
$('#kpisce_filter_source').on('change', function () {
    refresh_kpisce_table();
});

function refresh_kpisce_table() {

    let filter_kpi = encodeURIComponent($("#kpisce_filter_kpi").val());
    let filter_source = encodeURIComponent($("#kpisce_filter_source").val());

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');

            $("#kpisce_filter_kpi").prop("disabled", true);
            $("#kpisce_filter_source").prop("disabled", true);

            $("#kpisce_add_new_row").prop("disabled", true);
            $("#kpisce_save_new_rows").prop("disabled", true);
            $("#kpisce_cancel_new_rows").prop("disabled", true);
            $("#kpisce_refresh_rows").prop("disabled", true);
            $("#kpisce_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh pe-spin"> </i> Refreshing...');

            $("#kpisce_rows_list").html('<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>');
        },
        url: "/KPIScenario/RefreshTable?filter_kpi=" + filter_kpi + "&filter_source=" + filter_source,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#kpisce_filter_kpi").prop("disabled", false);
            $("#kpisce_filter_source").prop("disabled", false);

            $("#kpisce_add_new_row").prop("disabled", false);
            $("#kpisce_save_new_rows").prop("disabled", false);
            $("#kpisce_cancel_new_rows").prop("disabled", false);
            $("#kpisce_refresh_rows").prop("disabled", false);
            $("#kpisce_refresh_rows").html('<i class="nav-link-icon pe-7s-refresh"> </i> Refresh');

            $('#kpisce_rows_list').html("");
            $('#kpisce_rows_list').removeAttr("style");
            let columns = '';

            if (myList.CollectionA.length != 0) {
                $.each(myList.CollectionA, function (indexi, valueA) {

                    columns += '<tr>';

                    columns += '<th scope="row" id="row_kpisce_' + (indexi + 1) + '_id" data-value="' + valueA["IdScenario"] + '" style="display: none;"></th>';
                    columns += '<td style="padding: 2px;">';
                    columns += '<select type="select" id="row_kpisce_' + (indexi + 1) + '_kpi" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';

                    $.each(myList.CollectionB, function (indexj, valueB) {

                        if (valueA["IdKPI"] == valueB["Id"]) {
                            columns += '<option value="' + valueB["Id"] + '" selected="selected">' + (window.language_short == "es" ? valueB["KPINameEs"] : valueB["KPINameEn"]) + '</option>';
                        }
                        else {
                            columns += '<option value="' + valueB["Id"] + '">' + (window.language_short == "es" ? valueB["KPINameEs"] : valueB["KPINameEn"]) + '</option>';
                        }

                    });

                    columns += '</select>';
                    columns += '</td>';

                    columns += '<td style="padding: 2px;">';
                    columns += '<select type="select" id="row_kpisce_' + (indexi + 1) + '_source" class="custom-select" style="background: none; background-color: #e9ecef;" disabled>';
                    $.each(myList.CollectionC, function (indexk, valueC) {

                        if (valueA["IdSource"] == valueC["Id"]) {
                            columns += '<option value="' + valueC["Id"] + '" selected="selected">' + valueC["SourceName"] + '</option>';
                        }
                        else {
                            columns += '<option value="' + valueC["Id"] + '">' + valueC["SourceName"] + '</option>';
                        }

                    });

                    columns += '</select>';
                    columns += '</td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_table_name" type="text" class="form-control" value="' + valueA["TableName"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_column_name_date" type="text" class="form-control" value="' + valueA["ColumnNameDate"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_column_name_shift" type="text" class="form-control" value="' + valueA["ColumnNameShift"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_column_name_value" type="text" class="form-control" style="width: 80%;" value="' + valueA["ColumnNameValue"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_filter_additional" type="text" class="form-control" style="width: 90px;" value="' + valueA["FilterAdditional"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;"><input id="row_kpisce_' + (indexi + 1) + '_parameters" type="text" class="form-control" style="width: 90px;" value="' + valueA["Parameters"] + '" disabled="disabled"></td>';
                    columns += '<td style="padding: 2px;">';
                    columns += '<div class="input-group">';
                    columns += '<button type="button" id="row_kpisce_btn_' + (indexi + 1) + '_edr" onClick="edit_kpisce_row(' + (indexi + 1) + ')" data-toggle="modal" data-target="#Modal_edit_KPI_Scenario" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    columns += '<button type="button" id="row_kpisce_btn_' + (indexi + 1) + '_der" onClick="delete_kpisce_row(\'' + valueA["TableName"] + '\', ' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    columns += '</div>';
                    columns += '</td>';

                    columns += '</tr>';


                });
            }
            

            // Row hidden

            columns += '<tr id="kpisce_row_example_hidden" style="display: none;">';
            columns += '<th scope="row" id="row_kpisce_new_id" style="display: none;">-</th>';
            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_kpisce_new_kpi" class="custom-select">';

            $.each(myList.CollectionB, function (indexj, valueB) {

                columns += '<option value="' + valueB["Id"] + '">' + (window.language_short == "es" ? valueB["KPINameEs"] : valueB["KPINameEn"]) + '</option>';
                
            });

            columns += '</select>';
            columns += '</td>';
            columns += '<td style="padding: 2px;">';
            columns += '<select type="select" id="row_kpisce_new_source" class="custom-select">';
            $.each(myList.CollectionC, function (indexk, valueC) {

                columns += '<option value="' + valueC["Id"] + '">' + valueC["SourceName"] + '</option>';
                
            });

            columns += '</select>';
            columns += '</td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_table_name" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_column_name_date" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_column_name_shift" type="text" class="form-control"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_column_name_value" type="text" class="form-control" style="width: 80%;"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_filter_additional" type="text" class="form-control" style="width: 90px;"></td>';
            columns += '<td style="padding: 2px;"><input id="row_kpisce_new_parameters" type="text" class="form-control" style="width: 90px;"></td>';
            columns += '<td style="padding: 2px;"></td>';

            columns += '</tr>'; 

            $("#kpisce_rows_list").append(columns);
            count_kpisce_new = 0;
            
            /*
            $("#btn_general_table_data_" + id).prop("disabled", false);
            $("#btn_general_table_data_" + id).html("Press to test");
            */

        }
    });

}

$('#kpisce_list_add_edit_source').click(function () {

    refresh_source_list("source");

});

function refresh_source_list(tipo) {
    
    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');
            $("#data_loading_source").css({ "display": "block", "margin": "auto" });
            $("#data_list_source").css({ "display": "none" });

        },
        url: "/KPIScenario/RefreshList?type=" + tipo,
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);
            let rowsA = '';
            let rowsB = '';

            if (tipo == "source") {

                $('#kpisce_list_add_source').html("");
                $('#kpisce_list_edit_source').html("");
                $("#kpisce_filter_source").find('option').remove();
                $('#kpisce_filter_source').append($('<option>', { value: 'All', text: 'Todos' }));
                
                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + (indexi + 1) + '. ' + valueA["SourceName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_source_' + (indexi + 1) + '_id" data-value="' + valueA["Id"] + '">' + (indexi + 1) + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_source_' + (indexi + 1) + '_name" type="text" class="form-control custom-input" value="' + valueA["SourceName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_edr" onClick="edit_source_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_rcr" onClick="realizar_cambios_source_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_ccr" onClick="cancelar_cambios_source_row(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_der" onClick="delete_source_row(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>'; 

                    $('#kpisce_filter_source').append($('<option>', { value: valueA["Id"], text: valueA["SourceName"] }));

                });

                $('#kpisce_list_add_source').append(rowsA);
                $('#kpisce_list_edit_source').append(rowsB);

                $("#data_loading_source").css({ "display": "none", "margin": "auto" });
                $("#data_list_source").css({ "display": "block" });

            } else {
                /*
                $('#kpisce_list_add_source').html("");
                $('#kpisce_list_edit_source').html("");
                $("#kpisce_filter_source").find('option').remove();
                $('#kpisce_filter_source').append($('<option>', { value: 'All', text: 'Todos' }));

                $.each(myList.CollectionA, function (indexi, valueA) {
                    rowsA += '<p style="margin-bottom: 0.3rem;">' + valueA["Id"] + '. ' + valueA["CategoryName"] + '</p>';

                    rowsB += '<tr>';
                    rowsB += '<th scope="row" id="row_source_' + (indexi + 1) + '_kpi" data-value="' + valueA["Id"] + '">' + valueA["Id"] + '</th>';
                    rowsB += '<td style="padding: 2px;"><input id="row_source_' + (indexi + 1) + '_table_name" type="text" class="form-control custom-input" value="' + valueA["CategoryName"] + '" disabled="disabled"></td>';
                    rowsB += '<td style="padding: 2px;">';
                    rowsB += '<div class="input-group">';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_edr" onClick="editcatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2" style="margin-right: 2px !important;"><i class="fa fa-pen fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_rcr" onClick="realizarcambioscatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-success btn-iconv2" style="margin-right: 2px !important; display: none; font-size: 0.7rem;"><i class="fa fa-edit fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_ccr" onClick="cancelarcambiocatrow(' + (indexi + 1) + ')" data-actived="0" class="btn btn-secondary btn-iconv2" style="margin-right: 2px !important; display: none;"><i class="fa fa-times fa-w-16 fa-1x"></i></button>';
                    rowsB += '<button type="button" id="row_kpisce_btn_source_' + (indexi + 1) + '_der" onClick="deletecatrow(' + (indexi + 1) + ')" class="btn btn-primary btn-iconv2"><i class="fa fa-trash fa-w-16 fa-1x"></i></button>';
                    rowsB += '</div>';
                    rowsB += '</td>';
                    rowsB += '</tr>';

                    $('#kpisce_filter_source').append($('<option>', { value: valueA["Id"], text: valueA["CategoryName"] }));

                });

                $('#kpisce_list_add_source').append(rowsA);
                $('#kpisce_list_edit_source').append(rowsB);

                $("#data_loading_source").css({ "display": "none", "margin": "auto" });
                $("#data_list_source").css({ "display": "block" });
                */
            }

        }
    });
    

}


function btn_kpisce_source_add_new() {

    $("#btn_kpisce_source_add_new").prop("disabled", true);
    $("#kpisce_source_add_new").prop("readonly", true);
    //$("#kpisce_scenario_en_add_new").prop("readonly", true);

    let source_name = encodeURIComponent($("#kpisce_source_name_add_new").val());
    
    $.ajax({
        beforeSend: function () {
            
            $("#btn_kpisce_source_add_new").html("Añadiendo...");
            //$('#area-data-table-' + id).css({ "height": "40px", "overflow": "auto", "border-style": "dashed", "color": "#31708f", "text-align": "center", "line-height": "40px" });

        },
        url: "/KPIScenario/SaveNewItem?source_name=" + source_name + "&type=source",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#btn_kpisce_source_add_new").html("Añadir");
            $("#btn_kpisce_source_add_new").prop("disabled", false);
            $("#kpisce_source_add_new").prop("readonly", false);

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            $("#kpisce_source_add_new").val("");
            refresh_source_list("source");

        }
    });

}

// modals edit and cancel

function edit_source_row(id_row) {
    $("#row_source_" + id_row + "_name").prop("disabled", false);

    $("#row_kpisce_btn_source_" + id_row + "_edr").css({ "display": "none" });
    $("#row_kpisce_btn_source_" + id_row + "_der").css({ "display": "none" });
    $("#row_kpisce_btn_source_" + id_row + "_rcr").css({ "display": "block" });
    $("#row_kpisce_btn_source_" + id_row + "_ccr").css({ "display": "block" });

    $("#row_kpisce_btn_source_" + id_row + "_rcr").data("actived", 1);
    $("#row_kpisce_btn_source_" + id_row + "_ccr").data("actived", 1);
}

function cancelar_cambios_source_row(id_row) {
    $("#row_source_" + id_row + "_name").prop("disabled", true);

    $("#row_kpisce_btn_source_" + id_row + "_rcr").css({ "display": "none" });
    $("#row_kpisce_btn_source_" + id_row + "_ccr").css({ "display": "none" });
    $("#row_kpisce_btn_source_" + id_row + "_edr").css({ "display": "block" });
    $("#row_kpisce_btn_source_" + id_row + "_der").css({ "display": "block" });

    $("#row_kpisce_btn_source_" + id_row + "_rcr").data("actived", 0);
    $("#row_kpisce_btn_source_" + id_row + "_ccr").data("actived", 0);
}

function realizar_cambios_source_row(id_row) {

    let rcr_actived = $("#row_kpisce_btn_source_" + id_row + "_rcr").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    var data_source = [];
    var obj = {};

    obj['Id'] = encodeURIComponent($("#row_source_" + id_row + "_id").data("value"));
    obj['Name'] = $("#row_source_" + id_row + "_name").val();
    obj['Type'] = "source";

    data_source.push(obj);

    $.ajax({
        beforeSend: function () {

            // deshabilitar entradas
            $("#row_source_" + id_row + "_name").prop("disabled", true);

            $("#row_kpisce_btn_source_" + id_row + "_edr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_ccr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_der").prop("disabled", false);
            
            $("#row_kpisce_btn_source_" + id_row + "_rcr").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');
        },
        data: { 'data': data_source },
        url: "/KPIScenario/SaveChangesSource",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_kpisce_btn_source_" + id_row + "_edr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_ccr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_der").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_source_row(id_row);
            refresh_source_list("source");

        }
    });

}

function delete_source_row(id_row) {

    let rcr_actived = $("#row_kpisce_btn_source_" + id_row + "_der").data("actived");

    if (rcr_actived == 0) {
        return;
    }

    let id = encodeURIComponent($("#row_source_" + id_row + "_id").data("value"));

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');

            // deshabilitar botones
            $("#row_kpisce_btn_source_" + id_row + "_edr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_ccr").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_der").prop("disabled", false);
            $("#row_kpisce_btn_source_" + id_row + "_der").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x" style="font-size: 0.9em;"></i>');
        },
        url: "/KPIScenario/DeleteSource?id=" + id + "&type=source",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            var result = resp;
            const message = JSON.parse(resp);

            $("#row_kpisce_btn_source_" + id_row + "_edr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_rcr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_ccr").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_der").prop("disabled", true);
            $("#row_kpisce_btn_source_" + id_row + "_der").html('<i class="fa fa-edit fa-w-16 fa-1x"></i>');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            cancelar_cambios_source_row(id_row);
            refresh_source_list("source");

        }
    });

}


$('#kpisce_add_new_row').click(function () {

    refresh_modal_select_list();

});

function refresh_modal_select_list() {

    $.ajax({
        beforeSend: function () {
            //$("#factkpisce_compatibility").attr('disabled', 'disabled');
            $("#data_loading_add_kpisce").css({ "display": "block", "margin": "auto" });
            $("#data_list_add_kpisce").css({ "display": "none" });

        },
        url: "/KPIScenario/RefreshSelectKPIList",
        type: "Post",
        contentType: "Html",
        success: function (resp) {
            var result = resp;
            const myList = JSON.parse(resp);

            $("#kpisce_select_modal_add_kpi").find('option').remove();
            $('#kpisce_select_modal_add_kpi').append($('<option>', { value: '-', text: 'Seleccionar' }));
            $("#kpisce_select_modal_add_source").find('option').remove();
            $('#kpisce_select_modal_add_source').append($('<option>', { value: '-', text: 'Seleccionar' }));

            $.each(myList.CollectionA, function (indexi, valueA) {
                
                $('#kpisce_select_modal_add_kpi').append($('<option>', { value: valueA["Id"], text: valueA["CategoryName"] + ': ' + (window.language_short == "es" ? valueA["DescriptionEs"] : valueA["DescriptionEn"]) }));

            });
            $.each(myList.CollectionB, function (indexi, valueB) {

                $('#kpisce_select_modal_add_source').append($('<option>', { value: valueB["Id"], text: valueB["SourceName"] }));

            });

            $("#data_loading_add_kpisce").css({ "display": "none", "margin": "auto" });
            $("#data_list_add_kpisce").css({ "display": "flex" });

        }
    });


}



function kpisce_btn_modal_add() {

    var attibutevalue = $("#Modal_add_KPI_Scenario").attr('aria-hidden');

    if (typeof attibutevalue !== 'undefined' && attibutevalue !== false) {
        return;
    }

    var datas_kpisce = [];
    var obj = {};

    if ($("#kpisce_select_modal_add_kpi").val() == '-') {
        toastr.error("Debe seleccionar un valor", "Error", { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
        return;
    }
    if ($("#kpisce_select_modal_add_source").val() == '-') {
        toastr.error("Debe seleccionar un valor", "Error", { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
        return;
    }
    
    obj['kpisce_kpi'] = encodeURIComponent($("#kpisce_select_modal_add_kpi").val());
    obj['kpisce_source'] = encodeURIComponent($("#kpisce_select_modal_add_source").val());
    obj['kpisce_table_name'] = $("#kpisce_input_modal_add_tablename").val();
    obj['kpisce_column_name_date'] = $("#kpisce_input_modal_add_colnamedate").val();
    obj['kpisce_column_name_shift'] = $("#kpisce_input_modal_add_colnameshift").val();
    obj['kpisce_column_name_value'] = $("#kpisce_input_modal_add_colnamevalue").val();
    obj['kpisce_filter_additional'] = $("#kpisce_input_modal_add_filteradd").val();
    obj['kpisce_parameters'] = $("#kpisce_input_modal_add_parameters").val();

    datas_kpisce.push(obj);

    $.ajax({
        beforeSend: function () {
            
            $("#kpisce_select_modal_add_kpi").prop("disabled", true);
            $("#kpisce_select_modal_add_source").prop("disabled", true);
            $("#kpisce_input_modal_add_tablename").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_add_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamevalue").prop("disabled", true);
            $("#kpisce_input_modal_add_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_add_parameters").prop("disabled", true);

            $("#kpisce_btn_modal_add").prop("disabled", true);
            $("#kpisce_btn_modal_add").html('<i class="fa fa-spinner fa-spin fa-w-16 fa-1x"></i>');

        },
        data: { 'NewKPIScenario': datas_kpisce },
        url: "/KPIScenario/SetNewKPIScenarios",
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const message = JSON.parse(resp);

            $("#kpisce_select_modal_add_kpi").prop("disabled", false);
            $("#kpisce_select_modal_add_source").prop("disabled", false);
            $("#kpisce_input_modal_add_tablename").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamedate").prop("disabled", true);
            $("#kpisce_input_modal_add_colnameshift").prop("disabled", true);
            $("#kpisce_input_modal_add_colnamevalue").prop("disabled", true);
            $("#kpisce_input_modal_add_filteradd").prop("disabled", true);
            $("#kpisce_input_modal_add_parameters").prop("disabled", true);

            $("#kpisce_btn_modal_add").prop("disabled", false);
            $("#kpisce_btn_modal_add").html('<i class="nav-link-icon pe-7s-diskette"> </i> Guardar');

            $("#kpisce_select_modal_add_kpi").val("-");
            $("#kpisce_select_modal_add_source").val("-");
            $("#kpisce_input_modal_add_tablename").val("");
            $("#kpisce_input_modal_add_colnamedate").val("");
            $("#kpisce_input_modal_add_colnameshift").val("");
            $("#kpisce_input_modal_add_colnamevalue").val("");
            $("#kpisce_input_modal_add_filteradd").val("");
            $("#kpisce_input_modal_add_parameters").val("");

            $("#Modal_add_KPI_Scenario > div > div > div.modal-footer > button").trigger('click');

            if (message.Error == true) {
                toastr.error(message.Message, 'Error', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            } else {
                toastr.success(message.Message, 'Success', { "timeOut": 3000, "positionClass": "toast-top-right", "closeButton": true });
            }

            refresh_kpisce_table();

        }
    });

}


