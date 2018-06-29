var squel = require("squel");
var select = squel.select({ separator: "\n" });


var json = {

    "fieldsName":[{
        "fieldName":"a.imsi"
    },{
        "fieldName":"b.msisdn"
    },{
        "fieldName":"sum(b.msisdn)"
    }
    ]

}

function _buildGroupByOperation(groupByJson) {
    if(groupByJson && groupByJson.fieldsName){


        var fields = groupByJson.fieldsName;

        for(var i = 0;i<fields.length;i++){

            var item = fields[i];

            select.group(item.fieldName);

        }

        return select;
    }

}


function buildGroupBy(groupByJson) {
    return _buildGroupByOperation(groupByJson);
}

console.log(buildGroupBy(json).toString())