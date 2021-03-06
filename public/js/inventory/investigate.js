function update(index, items,qty) {
    //items is array of all the inventory_id's
    //index is the to index out of items which will be left/used
    $.ajax({
        method:'POST',
        url: "/api/invests_update",
        data:{
            index:index,
            items:items,
            qty:qty
        }
    }).done(function (data) {
        window.alert('success!');
    })
}
function combine(index, items, qty,remarks,newRemark) {
    //items is array of all the inventory_id's
    //index is the to index out of items which will be left/used
    $.ajax({
        method: 'POST',
        url: "/api/invests_combine",
        data: {
            index: index,
            items: items,
            qty: qty,
            remarks:remarks,
            newRemark:newRemark
        }
    }).done(function (data) {
        window.alert('success!');
    })
}
$(document).ready(function () {
    let list;
    let loadingSpinner = "<button id=\"spinner\" class=\"btn btn-primary\" type=\"button\" disabled>\n" +
        "  <span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\n" +
        "  Loading...\n" +
        "</button>";
    $('table').on('click', 'img', function (e) {
        e.preventDefault();
        if ($(e.target).is('img.img-thumbnail')) {
            let modalId = "#modal" + this.id.substr(3, this.id.length);
            $(modalId).modal('show');
        }
    }).on('click', '.qty', function (e) {
        e.preventDefault();
        if ($(e.target).is(".qty")) {
            let data = $(this).data(); //name, id, qty
            $("#qtyTitle").text("Add or remove quantity to item \"" + data.name + "\"");
            $("#qtyNumberCurrent").text(data.qty);
            $("#qtyId").text(data.id);
            $("#qtyModal").modal('show');
        }
    });
    $("#qtyButtonSubmit").click(function () {
        $.ajax({
            method: "POST",
            url: '/api/change_quantity',
            data: {
                sign: $("#inputIndicator").text(),
                value: $("#qtyInput").val(),
                id: $("#qtyId").text()
            },
        }).done(function (data) {
            $("#qtyModal").modal('hide');
        });
    })
    $("#qtyButtonAdd").click(function () {
        $(this).removeClass("btn-success");
        $(this).addClass("btn-outline-success");
        $("#qtyButtonRemove").removeClass("btn-outline-danger");
        $("#qtyButtonRemove").addClass("btn-danger");
        $("#inputIndicator").text("+");
        $("#qtyNumberNext").text(Number($("#qtyNumberCurrent").text()) + Number($("#qtyInput").val()));
    })
    $("#qtyButtonRemove").click(function () {
        $(this).removeClass("btn-danger");
        $(this).addClass("btn-outline-danger");
        $("#qtyButtonAdd").removeClass("btn-outline-success");
        $("#qtyButtonAdd").addClass("btn-success");
        $("#inputIndicator").text("-");
        let next = Number($("#qtyNumberCurrent").text()) - Number($("#qtyInput").val());
        if (next <= 0) {
            $("#qtyNumberNext").text("0");
        } else {
            $("#qtyNumberNext").text(next);
        }
    })
    $("#qtyInput").keyup(function () {
        let sign = $("#inputIndicator").text();
        if (sign === "+") {
            $("#qtyNumberNext").text(Number($("#qtyNumberCurrent").text()) + Number($("#qtyInput").val()));
        } else if (sign === "-") {
            let next = Number($("#qtyNumberCurrent").text()) - Number($("#qtyInput").val());
            if (next <= 0) {
                $("#qtyNumberNext").text("0");
            } else {
                $("#qtyNumberNext").text(next);
            }
        }

    })

    $.ajax({
        method: "GET",
        url: "/api/invest",
        beforeSend: function () {
            $("#loadingSection").append(loadingSpinner);
        }
    })
        .done(function (data) {
            list = data;
            $("#spinner").remove();
            if(data.data.length===0){
                //no data found or investigation found no issues
                $("#dynamicTbody").append("<tr>" +
                        "<td> No data found</td>"+
                        "<td> No data found</td>"+
                    "</tr>")
                $("#last").text("0");
                $("#current").text("0");
                $("#first").text("0");
            }else{
                //show very first data
                $("#last").text(data.data.length);
                $("#current").text("1");
                $("#first").text("1");
                drawItems(1);
                ///onclick functions (previous, next, last, first)
                $("#previous").click(function(){
                    let current = Number($("#current").text());
                    let newIndex = current-1;
                    if(current>1){
                        $("#current").text(newIndex);
                        drawItems(newIndex);
                    }
                });
                $("#next").click(function(){
                    let current = Number($("#current").text());
                    let newIndex = current+1;
                    let last = Number($("#last").text());
                    if(current<last){
                        $("#current").text(newIndex);
                        drawItems(newIndex);
                    }
                })
                $("#firstButton").click(function(){
                    let newIndex = Number($("#first").text());
                    $("#current").text(newIndex);
                    drawItems(newIndex);
                });
                $("#lastButton").click(function () {
                    let newIndex = Number($("#last").text());
                    $("#current").text(newIndex);
                    drawItems(newIndex);
                })
            }//test
        });//test
    function drawItems(i){
        $("#dynamicTbody tr").remove();
        let tr;
        i = i-1;
        list.data[i].forEach(
            function (item,index,meta) {
                let inventories ="";
                let qtyies = "";
                let remarks = "";
                let skipFirst = true;
                meta.forEach(function(meta_item){
                    if(!skipFirst){
                        inventories+="&";
                        qtyies+="&";
                        remarks+="&";
                    }
                    skipFirst = false;
                    inventories+=meta_item.inventory_id;
                    qtyies+=meta_item.quantity;
                    remarks+=meta_item.remarks;
                });
                tr += "<tr>";
                tr += "<td>";
                if (item.remarks === undefined) {
                    tr += "<a href='https://www.bricklink.com/inventory_detail.asp?pg=1&invID=" + item.inventory_id + "' target='_blank'  >geen remark</a>";
                } else {
                    tr += "<a href='https://www.bricklink.com/inventory_detail.asp?pg=1&invID=" + item.inventory_id + "' target='_blank'  >" + item.remarks + "</a>";
                }
                tr += '</br><button onclick="update('+String(index)+',\''+inventories+'\',\''+qtyies+'\')" type="button" class="btn btn-outline-primary">Add to '+item.remarks+'</button>  ';
                tr += '</br></hr><button onclick="combine('+String(index)+',\''+inventories+'\',\''+qtyies+'\',\''+remarks+'\',\''+item.remarks+'\')" type="button" class="btn btn-outline-info">Combine to '+item.remarks+'</button>';
                tr += "</td><td>";
                tr += "<a href='#qtyModalShow' class='qty' data-name='"+item.item.name+"' data-id='"+item.inventory_id+"' data-qty='"+item.quantity+"' >"+item.quantity+"</div>";
                tr += "</td><td>";
                tr += getPic(item);
                tr += "</td></tr>";
                setColor(item.color_name);
            }
        );
        $('#dynamicTbody').append(tr);
    }

    function getPic(row) {
        let id = row.color_id + row.item.no;
        let modal = "<div class=\"modal fade\" id=\"modal" + id + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modalTitle" + id + "\" aria-hidden=\"true\">\n" +
            "  <div class=\"modal-dialog modal-dialog-centered\" role=\"document\">\n" +
            "    <div class=\"modal-content\">\n" +
            "      <div class=\"modal-header\">\n" +
            "        <h5 class=\"modal-title\" id=\"modalTitel" + id + "\">Item no " + row.item.no + "</h5>\n" +
            "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "          <span aria-hidden=\"true\">&times;</span>\n" +
            "        </button>\n" +
            "      </div>\n" +
            "      <div class=\"modal-body\">\n" +
            "        " + row.item.name +
            "      </div>\n" +
            "      <div class=\"modal-footer\">\n" +
            "        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n" +
            "      </div>\n" +
            "    </div>\n" +
            "  </div>\n" +
            "</div>";
        let _type = row.item.type.substr(0, 1);

        switch (row.item.type) {
            case "SET":
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/S/" + row.item.no + ".jpg\"" + " alt=\"\"> ";
                break;
            case "MINIFIG":
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/MN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case "PART":
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/PN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'INSTRUCTION':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/IN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'BOOK':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/BN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'SET':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/SN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'GEAR':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/GN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'CATALOG':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/CN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            default:
                return "<i class=\"fas fa-image\"></i>";
        }

    }
    function setColor(color_name){
        $("#color").text(color_name);
        let css;
        switch (color_name) {
            case "transparent":
                css = {"background-color": "transparent"};
                break;
            case "Black":
                css = {"background-color": "#212121","color":"#FFF"};
                break;
            case "Blue":
                css = {"background-color": "#0057A6","color":"#FFF"};
                break;
            case "Bright Green":
                css = {"background-color": "#10CB31","color":"#000"};
                break;
            case "Bright Light Blue":
                css = {"background-color": "#9FC3E9","color":"#000"};
                break;
            case "Bright Light Orange":
                css = {"background-color": "#F7BA30","color":"#000"};
                break;
            case "Bright Light Yellow":
                css = {"background-color": "#F3E055","color":"#000"};
                break;
            case "Bright Pink":
                css = {"background-color": "#FFBBFF","color":"#000"};
                break;
            case "Brown":
                css = {"background-color": "#3399FF","color":"#FFF"};
                break;
            case "Dark Azure":
                css = {"background-color": "#3399FF","color":"#FFF"};
                break;
            case "Dark Blue":
                css = {"background-color": "#143044","color":"#FFF"};
                break;
            case "Dark Bluish Gray":
                css = {"background-color": "#595D60", "color": "#FFF"};
                break;
            case "Dark Gray":
                css = {"background-color": "#6B5A5A","color":"#FFF"};
                break;
            case "Dark Green":
                css = {"background-color": "#2E5543","color":"#FFF"};
                break;
            case "Dark Orange":
                css = {"background-color": "#B35408","color":"#FFF"};
                break;
            case "Dark Pink":
                css = {"background-color": "#C87080","color":"#FFF"};
                break;
            case "Dark Purple":
                css = {"background-color": "#5F2683","color":"#FFF"};
                break;
            case "Dark Red":
                css = {"background-color": "#6A0E15","color":"#FFF"};
                break;
            case "Dark Tan":
                css = {"background-color": "#907450","color":"#FFF"};
                break;
            case "Dark Turquoise":
                css = {"background-color": "#008A80","color":"#FFF"};
                break;
            case "Green":
                css = {"background-color": "#00642E","color":"#FFF"};
                break;
            case "Lavender":
                css = {"background-color": "#B18CBF","color":"#FFF"};
                break;
            case "Light Aqua":
                css = {"background-color": "#CCFFFF","color":"#000"};
                break;
            case "Light Blue":
                css = {"background-color": "#B4D2E3","color":"#000"};
                break;
            case "Light Bluish Gray":
                css = {"background-color": "#AFB5C7","color":"#000"};
                break;
            case "Light Gray":
                css = {"background-color": "#9C9C9C","color":"#000"};
                break;
            case "Light Lime":
                css = {"background-color": "#EBEE8F","color":"#000"};
                break;
            case "Light Nougat":
                css = {"background-color": "#FECCB0","color":"#000"};
                break;
            case "Light Pink":
                css = {"background-color": "#FFE1FF","color":"#000"};
                break;
            case "Light Purple":
                css = {"background-color": "#DA70D6","color":"#000"};
                break;
            case "Light Yellow":
                css = {"background-color": "#FFE383","color":"#000"};
                break;
            case "Lime":
                css = {"background-color": "#A6CA55","color":"#000"};
                break;
            case "Maersk Blue":
                css = {"background-color": "#6BADD6","color":"#000"};
                break;
            case "Magenta":
                css = {"background-color": "#B52952","color":"#FFF"};
                break;
            case "Medium Azure":
                css = {"background-color": "#42C0FB","color":"#000"};
                break;
            case "Medium Blue":
                css = {"background-color": "#61AFFF","color":"#000"};
                break;
            case "Medium Lavender":
                css = {"background-color": "#885E9E","color":"#FFF"};
                break;
            case "Medium Lime":
                css = {"background-color": "#BDC618","color":"#000"};
                break;
            case "Medium Nougat":
                css = {"background-color": "#E3A05B","color":"#000"};
                break;
            case "Medium Orange":
                css = {"background-color": "#FFA531","color":"#000"};
                break;
            case "Medium Violet":
                css = {"background-color": "#9391E4","color":"#000"};
                break;
            case "Nougat":
                css = {"background-color": "#FFAF7D","color":"#000"};
                break;
            case "Olive Green":
                css = {"background-color": "#7C9051","color":"#FFF"};
                break;
            case "Orange":
                css = {"background-color": "#FF7E14","color":"#FFF"};
                break;
            case "Pink":
                css = {"background-color": "#FFC0CB","color":"#000"};
                break;
            case "Purple":
                css = {"background-color": "#A5499C","color":"#FFF"};
                break;
            case "Red":
                css = {"background-color": "#B30006","color":"#FFF"};
                break;
            case "Reddish Brown":
                css = {"background-color": "#89351D","color":"#FFF"};
                break;
            case "Sand Blue":
                css = {"background-color": "#5A7184","color":"#FFF"};
                break;
            case "Sand Green":
                css = {"background-color": "#76A290","color":"#FFF"};
                break;
            case "Sand Red":
                css = {"background-color": "#8C6B6B","color":"#FFF"};
                break;
            case "Tan":
                css = {"background-color": "#DEC69C","color":"#000"};
                break;
            case "Very Light Orange":
                css = {"background-color": "#E6C05D","color":"#000"};
                break;
            case "White":
                css = {"background-color": "#FFFFFF","color":"#000"};
                break;
            case "Yellow":
                css = {"background-color": "#F7D117","color":"#000"};
                break;
            case "Yellowish Green":
                css = {"background-color": "#DFEEA5","color":"#000"};
                break;
            case "Trans-Clear":
                css = {"background-color": "#EEEEEE","color":"#000"};
                break;
            case "Trans-Dark Blue":
                css = {"background-color": "#00296B","color":"#FFF"};
                break;
            case "Trans-Light Blue":
                css = {"background-color": "#68BCC5","color":"#000"};
                break;
            case "Trans-Light Orange":
                css = {"background-color": "#E99A3A","color":"#000"};
                break;
            case "Trans-Neon Green":
                css = {"background-color": "#C0F500","color":"#000"};
                break;
            case "Trans-Neon Orange":
                css = {"background-color": "#FF4231","color":"#FFF"};
                break;
            case "Trans-Orange":
                css = {"background-color": "#D04010","color":"#FFF"};
                break;
            case "Trans-Yellow":
                css = {"background-color": "#EBF72D","color":"#000"};
                break;
            case "Chrome Gold":
                css = {"background-color": "#F1F2E1","color":"#000"};
                break;
            case "Chrome Silver":
                css = {"background-color": "#DCDCDC","color":"#000"};
                break;
            case "Pearl Light Gray":
                css = {"background-color": "#ACB7C0","color":"#000"};
                break;
            case "Metallic Gold":
                css = {"background-color": "#B8860B","color":"#FFF"};
                break;
            case "Milky White":
                css = {"background-color": "#D4D3DD","color":"#000"};
                break;
            case "Fabuland Brown":
                css = {"background-color": "#b06d55", "color": "#000"};
                break;

        }
        $("#color").css(css);
    }
});