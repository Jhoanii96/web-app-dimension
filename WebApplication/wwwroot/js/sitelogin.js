// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
let ua_verified = "";
// Write your JavaScript code.
$('#btn_go_login_basic').click(function () {

    $("#login_with_microsoft").css({ "display": "none" });
    $("#login_with_basic").css({ "display": "block" });

});

$('#btn_go_login_microsoft').click(function () {

    $("#login_with_basic").css({ "display": "none" });
    $("#login_with_microsoft").css({ "display": "block" });
    $('#login_with_microsoft').fadeIn();

    $("#section_login_email").css({ "display": "block" });
    $("#login_email_input").val("");
    $("#section_login_password").css({ "display": "none" });
    $("#login_password_input").val("");
    $("#section_login_new_password").css({ "display": "none" });
    $("#login_new_password").val("");
    $("#section_login_repeat_password").css({ "display": "none" });
    $("#login_repeat_new_password").val("");
    $("#login_error_message").css({ "display": "none" });
    $("#login_info_message").css({ "display": "none" });
    $("#login_error_message label").html("");
    $("#login_info_message label").html("");
    $("#section_keep_login").css({ "display": "none" });
    $("#login_keep_login").attr("checked", false)
    
    $("#btn_login_basic_account").prop("disabled", false);
    $("#btn_login_basic_account").html(window.login_basic_next);

    $("#btn_login_basic_account").data("steps", "1");
    $("#btn_login_basic_account").data("new-password", "0");

    $("#login_message_welcome").html("<div>" + window.login_basic_account_header_1 + "</div><span>" + window.login_basic_account_header_2 + "</span>");

});

$('#btn_login_basic_account').click(function () {

    let login_email = $("#login_email_input").val();
    let step_current = $("#btn_login_basic_account").data("steps");
    if (login_email == "") {
        return;
    }
    if (step_current != "1") {
        return;
    }

    $.ajax({
        beforeSend: function () {

            $("#btn_login_basic_account").prop("disabled", true);
            $("#btn_login_basic_account").html('<i class="fa fa-spinner fa-spin"></i>');
            
        },
        url: "/Login/VerifyAccount?acc=" + login_email,
        type: "Post",
        dataType: "json",
        success: function (resp) {
            const data_resp = JSON.parse(resp);

            if (data_resp.Error === undefined) {
                if (data_resp.CollectionA.length != 0) {
                    if (data_resp.CollectionA[0].NewPassword == true) {
                        $("#btn_login_basic_account").prop("disabled", false);
                        $("#login_error_message").css({ "display": "none" });
                        $("#btn_login_basic_account").html(window.login_basic_register_btn);
                        $("#btn_login_basic_account").data("steps", "2");
                        $("#btn_login_basic_account").data("new-password", "1");

                        $("#section_login_email").css({ "display": "none" });
                        $("#section_login_new_password").css({ "display": "block" });
                        $("#section_login_repeat_password").css({ "display": "block" });

                        $("#login_message_welcome").html("<div>" + window.login_basic_account_header_3 + "</div><span>" + window.login_basic_account_header_4 + "</span>");

                    } else {
                        $("#btn_login_basic_account").prop("disabled", false);
                        $("#login_error_message").css({ "display": "none" });
                        $("#btn_login_basic_account").html(window.login_basic_login_btn);
                        $("#btn_login_basic_account").data("steps", "2");
                        $("#btn_login_basic_account").data("new-password", "0");

                        $("#section_login_email").css({ "display": "none" });
                        $("#section_login_password").css({ "display": "block" });
                        $("#section_keep_login").css({ "display": "block" });
                    }

                    ua_verified = data_resp.CollectionA[0].UserPrincipalName;
                    
                } else {
                    $("#login_error_message").css({ "display": "block" });
                    $("#login_error_message label").html(window.login_basic_user_not_found);
                    $("#login_email_input").prop("disabled", false);
                    $("#btn_login_basic_account").prop("disabled", false);
                    $("#btn_login_basic_account").html(window.login_basic_next_btn);
                }
            } else {
                if (data_resp.Error == true) {
                    $("#login_error_message").css({ "display": "block" });
                    $("#login_error_message label").html(data_resp.Message);
                    $("#login_email_input").prop("disabled", false);
                    $("#btn_login_basic_account").prop("disabled", false);
                    $("#btn_login_basic_account").html(window.login_basic_next_btn);
                }
            }

        }
    });

});



$('#btn_login_basic_account').click(function () {

    let step_current = $("#btn_login_basic_account").data("steps");
    if (step_current != "2") {
        return;
    }
    let new_password = $("#btn_login_basic_account").data("new-password");

    if (new_password == "1") {

        let new_password_input = $("#login_new_password").val();
        let repeat_password_input = $("#login_repeat_new_password").val();

        if (new_password_input != repeat_password_input) {
            $("#login_error_message").css({ "display": "block" });
            $("#login_error_message label").html(window.login_basic_password_not_match);
        } else {
            $("#login_error_message").css({ "display": "none" });
        }

        $.ajax({
            beforeSend: function () {

                $("#login_new_password").prop("disabled", true);
                $("#login_repeat_new_password").prop("disabled", true);
                $("#btn_login_basic_account").prop("disabled", true);
                $("#btn_login_basic_account").html('<i class="fa fa-spinner fa-spin"></i>');

            },
            url: "/Login/RegisterPasswordAccount?acc=" + ua_verified + "&pass=" + new_password_input,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                const data_resp = JSON.parse(resp);

                if (data_resp.Error === undefined) {
                    $("#login_info_message").css({ "display": "block" });
                    $("#login_info_message label").html(window.login_basic_message_label);
                    setTimeout(function () {
                        window.location.replace(location.protocol + '//' + location.host + '/Login');
                    }, 3000);
                } else {
                    if (data_resp.Error == true) {
                        $("#login_new_password").prop("disabled", false);
                        $("#login_repeat_new_password").prop("disabled", false);

                        $("#login_error_message").css({ "display": "block" });
                        $("#login_error_message label").html(data_resp.Message);
                        $("#login_email_input").prop("disabled", false);
                        $("#btn_login_basic_account").prop("disabled", false);
                        $("#btn_login_basic_account").html(window.login_basic_register_btn);
                    }
                }

            }
        });
    } else {

        let password_input = $("#login_password_input").val();
        let keep_input = $("#login_keep_login").attr("checked") ? 1 : 0;

        if (password_input == "") {
            $("#login_error_message").css({ "display": "block" });
            $("#login_error_message label").html(window.login_basic_enter_password);
            return;
        } 

        $.ajax({
            beforeSend: function () {

                $("#btn_login_basic_account").prop("disabled", true);
                $("#btn_login_basic_account").html('<i class="fa fa-spinner fa-spin"></i>');

            },
            url: "/Login/LoginAcount?acc=" + ua_verified + "&pass=" + password_input + "&keep=" + keep_input,
            type: "Post",
            dataType: "json",
            success: function (resp) {
                const data_resp = JSON.parse(resp);

                if (data_resp.Error === undefined) {
                    window.location.replace(location.protocol + '//' + location.host + '/Home');
                } else {
                    if (data_resp.Error == true) {
                        $("#login_error_message").css({ "display": "block" });
                        $("#login_error_message label").html(data_resp.Message);
                        $("#login_email_input").prop("disabled", false);
                        $("#btn_login_basic_account").prop("disabled", false);
                        $("#btn_login_basic_account").html(window.login_basic_login_btn);
                    }
                }

            }
        });
    }

    

    

});






