var squel = require("squel");
var select = squel.select({ separator: "\n" });


var json = {

    "fieldsName":[{
            "fieldName":"a.imsi",
            "order":"asc"
        },{
            "fieldName":"b.msisdn",
            "order":"desc"
        },{
            "fieldName":"b.imsi"
        }
    ]

}

function _buildOrderByOperation(orderByJson) {
    if(orderByJson && orderByJson.fieldsName){


        var fields = orderByJson.fieldsName;

        for(var i = 0;i<fields.length;i++){

            var item = fields[i];

            if(item.order && item.order.toLowerCase() == 'desc'){
                select.order(item.fieldName,false);
            }else{
                select.order(item.fieldName,true);
            }
        }
        return select;
    }

}


function buildOrderBy(orderByJson) {
    return _buildOrderByOperation(orderByJson);
}

console.log(buildOrderBy(json).toString())