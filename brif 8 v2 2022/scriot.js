

   
    var form_el = document.getElementsByTagName("form")[0];
    var form_inputs = document.getElementsByTagName("input");
    var title = document.getElementById("title");
    var author = document.getElementById("author");
    var email_author = document.getElementById("email_author");
    var price = document.getElementById("price");
    var pub = document.getElementById("pub");
    var lang = document.getElementById("lang");
    var type = document.getElementsByClassName("type");
    var type_par = document.getElementById("type_par");
    var max_length = 30;
    var is_checked = false;
    var table = document.getElementById("table");
    var message = document.getElementById("message");
    var print_div = document.getElementById("print_div");
    var book;

    class Books{
        constructor(title, author, email_author, price, pub_date, lang, type){
            this.title = title;
            this.author = author;
            this.email_author = email_author;
            this.price = price;
            this.pub_date = pub_date;
            this.lang = lang;
            this.type = type;
        }
        bookDetails(){
            return `L'ouvrage '${this.title}' est un '${this.type}' en langue '${this.lang}', écrit par '${this.author}' et publié le '${this.pub_date}'. Le prix de '${this.title}' est de '${this.price}' Dhs.`
        }
    }

    var list_local = [];
    var temp_list = "";
    temp_list = JSON.parse(localStorage.getItem("list"));
    if(temp_list!=null)
    {
        for(i=0;i<temp_list.length;i++){
            var backup_book = new Books(temp_list[i].title,temp_list[i].author,temp_list[i].email_author,temp_list[i].price,temp_list[i].pub_date,temp_list[i].lang,temp_list[i].type)
            list_local.push(backup_book);
        }
    }
    

    function fill_table(){
        for(var i=0;i<list_local.length;i++){
        var row = table.insertRow();
        row.insertCell(0).innerHTML = list_local[i].title;
        row.insertCell(1).innerHTML = list_local[i].author;
        row.insertCell(2).innerHTML = list_local[i].email_author;
        row.insertCell(3).innerHTML = list_local[i].price;
        row.insertCell(4).innerHTML = list_local[i].pub_date;
        row.insertCell(5).innerHTML = list_local[i].lang;
        row.insertCell(6).innerHTML = "<input class='edit_btn' onclick='edit_row(this)' type='button' value='Edit'>" +
            "<input class='dlt_btn' onclick='dlt_row(this)' type='button' value='Delete'>";
        
        //type
        row.insertCell(6).innerHTML = list_local[i].type;
    }
    }
    fill_table();

    function sort_table(){
        list_local.sort(function(a,b){
            if(a.title < b.title){
                return -1;
            }
        })
    }

    function validate(e) {
        e.preventDefault();
        var form_not_valid = 0;

        //basic check
        for (var i = 0; i < 4; i++) {
            if (form_inputs[i].value == "") {
                form_not_valid++;
                form_inputs[i].style.borderColor = "red";
                form_inputs[i].nextElementSibling.style.color = "red";
                form_inputs[i].nextElementSibling.innerHTML = "please fill this field";
            }
            else {
                form_inputs[i].style.borderColor = "green"
                form_inputs[i].nextElementSibling.style.color = "green";
                form_inputs[i].nextElementSibling.innerHTML = "ok!";
            }
        }

        //title check
        if (title.value.length > max_length) {
            form_not_valid++;
            title.style.borderColor = "red"
            title.nextElementSibling.innerHTML = "max " + max_length;
            title.nextElementSibling.style.color = "red";
        }

        //author check
        if (author.value.length > max_length) {
            form_not_valid++;
            author.style.borderColor = "red";
            author.nextElementSibling.innerHTML = "max " + max_length;
            author.nextElementSibling.style.color = "red";
        }

        //Email check
        var email_check = /\w+@gmail\.com/;
        var email_check2 = /\s/;
        if(!email_check.test(email_author.value) && email_author.value!=""){
            if(email_check2.test(email_author.value)){
                
            }
            form_not_valid++;
            email_author.style.borderColor = "red";
            email_author.nextElementSibling.innerHTML = "Invalid email format";
            email_author.nextElementSibling.style.color = "red";
        }
        else{
            email_author.style.borderColor = "green";
            email_author.nextElementSibling.style.color = "green";
            email_author.nextElementSibling.innerHTML = "ok!";
        }

        //price check
        var price_check1 = /[a-zA-Z]/;
        var price_check2 = /^[0-9]+\.[0-9]{2}$/;
        if (price_check1.test(price.value)) {
            form_not_valid++;
            price.style.borderColor = "red";
            price.nextElementSibling.innerHTML = "numbers only";
            price.nextElementSibling.style.color = "red";
        }
        else if (!price_check2.test(price.value)) {
            price.style.borderColor = "red";
            form_not_valid++;
            price.nextElementSibling.innerHTML = "invalid price format";
            price.nextElementSibling.style.color = "red";
        }

        //language check
        if (lang.value == "") {
            form_not_valid++;
            lang.style.borderColor = "red";
            lang.nextElementSibling.style.color = "red";
            lang.nextElementSibling.innerHTML = "please choose a language";
        }
        else {
            lang.style.borderColor = "green";
            lang.nextElementSibling.style.color = "green";
            lang.nextElementSibling.innerHTML = "ok!";
        }

        //type check
        for (var i = 0; i < type.length; i++) {
            if (type[i].checked) {
                is_checked = true;
                break;
            }
            else {
                is_checked = false;
            }
        }
        if (is_checked) {
            type_par.innerHTML = "ok!";
            type_par.style.color = "green";
        }
        else {
            form_not_valid++;
            type_par.innerHTML = "please select a type!";
            type_par.style.color = "red";
        }

        //insert row
        if (form_not_valid == 0) {

            var temp_cell = "";
            for (var i = 0; i < type.length; i++) {
                if (type[i].checked) {
                    temp_cell = type[i].value;
                }
            }
            
            var index = lang.selectedIndex;

            book = new Books(title.value, author.value, email_author.value, price.value, pub.value, lang.options[index].value, temp_cell);
            list_local.push(book);
            message.innerHTML = book.bookDetails();
            
            sort_table();
            localStorage.setItem("list", JSON.stringify(list_local));
            table.innerHTML = "";
            fill_table();
        }
    }
    
    

    // document.getElementById("table").addEventListener("click", function(e){
    //     var dlt = e.target;
    //     if(dlt.classList.contains("dlt_btn")){
    //         dlt.closest("tr").remove();
    //     }
    // });

    // Delete function;
    function dlt_row(r) {
        if(confirm("")){
            var i = r.parentNode.parentNode.rowIndex-1;
            list_local.splice(i,1);
            sort_table();
            localStorage.setItem("list", JSON.stringify(list_local));
            table.innerHTML = "";
            fill_table();
        }
    }

    // Edit function;
    function edit_row(r) {
        var i = r.parentNode.parentNode.rowIndex-1;
        var dlt_disable = r.nextElementSibling;
        var row = table.rows[i];
        if (r.value == "Edit") {
            // Type
            
            title.value = row.cells[0].innerHTML;
            author.value = row.cells[1].innerHTML;
            email_author.value = row.cells[2].innerHTML;
            price.value = row.cells[3].innerHTML;
            pub.value = row.cells[4].innerHTML;
            lang.value = row.cells[5].innerHTML;
            
            for (var i = 0; i < type.length; i++) {
                if (row.cells[6].innerHTML == type[i].value) {
                    type[i].checked = true;
                }
            }
            r.value = "Save";
            dlt_disable.setAttribute("disabled", "true");
            document.getElementById("submit_btn").setAttribute("disabled", "true");
        }
        else {
            list_local[i].title = title.value;
            list_local[i].author = author.value;
            list_local[i].email_author = email_author.value;
            list_local[i].price = price.value;
            list_local[i].pub_date = pub.value;
            list_local[i].lang = lang.value;
            for (var k = 0; k < type.length; k++) {
                if (type[k].checked) {
                    list_local[i].type = type[k].value;
                }
            }
            table.innerHTML = "";
            localStorage.setItem("list", JSON.stringify(list_local));
            fill_table();
            r.value = "Edit";
            dlt_disable.removeAttribute("disabled");
            document.getElementById("submit_btn").removeAttribute("disabled")
        }
    }

    function print_btn(){
        var temp_div = print_div.innerHTML;
        var temp_body = document.body.innerHTML;
        document.body.innerHTML = temp_div;
        window.print();
        document.body.innerHTML = temp_body;
    }

    form_el.addEventListener("submit", validate)
