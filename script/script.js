/**
 * CUSTOM JAVASCRIPT CODES,
 * @author kushaldeep kansabanik,
 * @version 0.0.1
 */
$(document).ready(function (){

    /* Form Toggle Registration */

    $("#signup").on("click",function(event){
        event.preventDefault();
        $("#login_form").css("display","none");
        $("#reg_form").css("display","block");
    });

    /* Form Toggle Login */

    $("#signin").on("click",function(event){
        event.preventDefault();
        $("#login_form").css("display","block");
        $("#reg_form").css("display","none");
    });
    
    /* Toggle the side bar  */
    /* Sidebar open */
    $(".btn-menu").on("click",function(event){
        event.preventDefault();
        console.log("Menu Button Clicked");
        event.target.style.display = "none";
        $(".side-pane").css("display","block");
    });

    /* Sidebar close  */
    $(".cross").on("click",function(event){
        event.preventDefault();
        $(".side-pane").css("display","none");
        $(".btn-menu").css("display","inline-block");
    });

    /* Search drop list */
    $("#claim_emp_id_search").on("keyup", function() {
        let value = $(this).val().toLowerCase();
        console.log(value);
        if(value === "")
        return;
        $("#empIdList li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });

    /* Claim form submit button trigger */
    $("#claim_submit").on("click",function(event){
        event.preventDefault();
        console.log("Claim submit clicked");
        claimFormValidate();
    });
    /* Claim Registration form submit button trigger */
    $("#reg_submit").on("click",function(event){
        event.preventDefault();
        empRegistrationValidate(event);

    });
    /* Login Form submit button trigger */
    $("#login-submit").on("click",function(event){
        event.preventDefault();
        let loginEmail = $("#login_email").val();
        let password  = $("#login_password").val();
        console.log("loginid: ",loginEmail);
        console.log("password: ".password);
        if(loginEmail === "employee@admin.com" && password === "employee@123"){
            console.log("Employee Login");
            window.location.assign("employee/issueclaim.html");
        }
        else if(loginEmail === "manager@admin.com" && password === "manager@123"){
            console.log("Manager Login");
            window.location.assign("projectmanager/issueclaim.html");
        }


    });
    /*********Tagging person from dropdown search list***************************/
    $(".person-add").on("click",function(event){
        event.preventDefault();
        console.log(event.target);
        console.log($(this).siblings()[0].innerHTML,$(this).siblings()[1].innerHTML);
        let employeeName = $(this).siblings()[0].innerHTML;
        let employeeId = $(this).siblings()[1].innerHTML;
        //console.log($(".tag-area").children());
        let tagAreaChildren = $(".tag-area").children();
        console.log(tagAreaChildren);
        for(let index = 0 ; index < tagAreaChildren.length ; index++){
            console.log(tagAreaChildren[index].children[1].innerText);
            if(tagAreaChildren[index].children[1].innerText === employeeId){
                console.log("Person Exists");
                return;
            }
        }
        let tagStringHtml = '<span class = "tag"><div class = "tag-emp-name">'+employeeName+'</div>-<div class = "tag-emp-id">'+employeeId+'</div><a class = "tag-cross" href = "#">x</a></span>';
        $(".tag-area").append(tagStringHtml);
    });

    /*************** Remove tags javascript codes(incomplete) *****************/
    $(".tag-cross").on("click",function(event){
        console.log("Clicked");
        event.preventDefault();
        $(event.Target).parent().remove();
    });
});
/* employee registration field data validation codes  */
function empRegistrationValidate(event){
    let empId = $("#reg_emp_id").val();
    let empFname = $("#reg_fname").val();
    let empLname = $("#reg_lname").val();
    let empEmail = $("#reg_email").val();
    let empDesignation =  $("#reg_designation").val();
    let empPassword = $("#reg_password").val();
    let emp_confirm_password = $("#reg_confirm_password").val();
    let token = 0;
    if(empId === ""){
        $("#reg_emp_id_message").html("Employee id is empty");
        token =1;
    }
    else{
        $("#reg_emp_id_message").html("");
        token = 0;
    }
    if(empFname === ""){
        $("#reg_fname_message").html("First name missing");
        token =1;
    }
    else{
        $("#reg_fname_message").html("");
        token = 0;
    }
    if(empLname === ""){
        $("#reg_lname_message").html("Last name missing");
        token =1;
    }else{
        $("#reg_lname_message").html("");
        token = 0;
    }
    if(empEmail == ""){
        $("#reg_email_message").html("Email is empty");
        token =1;
    }
    else if(validateEmail(empEmail) == false){
        $("#reg_email_message").html("Email is Not valid");
        token = 1;
    }
    else{
        $("#reg_email_message").html("");
        token = 0;
    }
    if(empDesignation === "" || empDesignation === "0"){
        $("#reg_designation_message").html("designation not selected");
        token =1;
    }
    else{
        $("#reg_designation_message").html("");
        token = 0;
    }
    if(empPassword === "" || emp_confirm_password === "" || empPassword === " " || emp_confirm_password === " "){

        (empPassword === "" || empPassword === " ")? $("#reg_password_message").html("Password Empty"):$("#reg_password_message").html("");
        (emp_confirm_password === "" || emp_confirm_password === " ")? $("#reg_confirm_password_message").html("Confirm Password Empty"):$("#reg_confirm_password_message").html("");
        token =1;
    }
    else if(empPassword != emp_confirm_password && empPassword != "" && emp_confirm_password != "" && empPassword != " " && emp_confirm_password != " "){
        $("#reg_password_message").html("");
        $("#reg_confirm_password_message").html("Password Not matched");
        token = 1;
    }
    else{
        $("#reg_confirm_password_message").html("");
        $("#reg_password_message").html("");
        token = 0;
    }
    if(token == 0)
    {
        $(event.target).html("submitting");
        $.ajax({
            //headers:{'content-type':'application/json'},
            contentType:'application/json',
            method: "POST",
            url: "http://localhost:3000/submit/record/",
            data:JSON.stringify({
                id: empId,
                f_name: empFname,
                l_name: empLname,
                email: empEmail,
                designation: empDesignation,
                password: empPassword
            }),
            success: function(result,status,xhr){
                console.log("Response status")
                console.log(result);
                if(result.status == 400){
                    setErrorMessage(result.data.errors);
                }
                $("#reg_emp_id").val("");
                $("#reg_fname").val("");
                $("#reg_lname").val("");
                $("#reg_email").val("");
                $("#reg_designation").val("");
                $("#reg_password").val("");
                $("#reg_confirm_password").val("");
                $(event.target).html("submit");
            },
            error: function(xhr,status,error){
                console.log(error);
            }
        });
        return true;
    }
    else{
        return false;
    }
}
/* Set error message codes */
function setErrorMessage(errors){
    for(let index = 0 ; index < errors.length ; index++){
        if(errors[index].param == "id"){
            $("#reg_emp_id_message").html(errors[index].msg);
        }
        else if(errors[index].param == "f_name"){
            $("#reg_fname_message").html(errors[index].msg);
        }
        else if(errors[index].param == "l_name"){
            $("#reg_lname_message").html(errors[index].msg);
        }
        else if(errors[index].param == "email"){
            $("#reg_email_message").html(errors[index].msg);
        }
        else if(errors[index].param == "designation"){
            $("#reg_designation_message").html(errors[index].msg);
        }
        else if(errors[index].param == "password"){
            $("#reg_password_message").html(errors[index].msg);
            $("#reg_confirm_password_message").html(errors[index].msg);
        }
    }
}
/* Email validation codes */
function validateEmail(email){
    let pattern = new RegExp(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    if(!pattern.test(email)){
        return false;
    }
    else{
        return true;
    }
}
/*Claim form validation code */

function claimFormValidate(){
    let claimEmpId = $("#claim_emp_id").val();
    let claimEmpName = $("#claim_emp_name").val();
    let claimManagerId = $("#claim_manager_id").val();
    let claimType = $("#claim_type").val();
    let claimDescription = $("#claim_description").val();
    let claimExtraPerson = $("#claim_extra_person").val();
    let claimAmount = $("#claim_amount").val();
    let claimDetailProof = $("#claim_detail_proof").val();
    if(claimEmpId === ""){
        $("#claim_emp_id_message").html("**employee id empty**");
    }
    else{
        $("#claim_emp_id_message").html("");
    }
    if(claimEmpName === ""){
        $("#claim_emp_name_message").html("**employee name empty**");
    }
    else{
        $("#claim_emp_name_message").html("");
    }
    if(claimManagerId === ""){
        $("#claim_manager_id_message").html("**manager id empty**");
    }
    else{
        $("#claim_manager_id_message").html("");
    }
    if(claimType === "0"){
        $("#claim_type_message").html("**Claim type not Selected**");
    }
    else{
        $("#claim_type_message").html("");
    }
    if(claimDescription === ""){
        $("#claim_description_message").html("**Description empty**");
    }
    else{
        $("#claim_description_message").html("");
    }
    if(claimAmount === ""){
        $("#claim_amount_message").html("** Amount empty**");
    }
    else{
        $("#claim_amount_message").html("");
    }
    if(claimDetailProof === ""){
        $("#claim_detail_proof_message").html("**Detail Proof not selected**");
    }
    else{
        $("#claim_detail_proof_message").html("");
    }
}