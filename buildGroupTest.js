var squel = require("squel");
var select = squel.select({ separator: "\n" });


var json = {

    "fieldsName":[
        {
            "fieldName":"a.imsi",
            "hasFunction":false
        },{
            "fieldName":"b.msisdn",
            "hasFunction":true,
            "func":{
                "name":"str_to_date",
                "hasFormat":true,
                "format":"%Y-%m-%d %H:%i:%s"
            }

        },{
            "fieldName":"b.msisdn",
            "hasFunction":true,
            "func":{
                "name":"str_to_date",
                "hasFormat":false
            }
        },{
            "fieldName":"b.msisdn",
            "hasFunction":true,
            "func":{
                "name":"floor",
                "hasFormat":false
            }
        },{
            "fieldName":"b.msisdn",
            "hasFunction":true,
            "func":{
                "name":"case_when",
                "hasFormat":false,
                "condition":{
                    "rules":[
                        {
                            "operator":"!=",
                            "type":"number",
                            "when":'5',
                            "then":"a"
                        },{
                            "operator":"=",
                            "type":"string",
                            "when":'ceshi',
                            "then":"b"
                        },{
                            "operator":">=",
                            "type":"number",
                            "when":'3',
                            "then":"c"
                        }
                    ],
                    "default":"null"

                }
            }
        }
    ]

}

function _buildGroupByOperation(groupByJson) {
    if(groupByJson && groupByJson.fieldsName){

        var fields = groupByJson.fieldsName;

        for(var i = 0;i<fields.length;i++){

            var item = fields[i];


            if(!item.hasFunction){
                select.group(item.fieldName);

            }else {
                var func = item.func;

                //如果有函数，并且没有格式要求的，condition是case when的条件，需要单独处理
                if(!func.hasFormat && !func.condition){

                    select.group(item.func.name+"("+item.fieldName+")");

                }else if(func.hasFormat){

                    select.group(item.func.name+"("+item.fieldName+",'"+item.func.format+"')");

                }else if(func.condition){

                    //case when 条件

                    var defa = func.condition.default;

                    var rules = func.condition.rules;

                    var ca =  squel.case();

                    rules.forEach(function (value, index, array) {

                        if(value.type.toLowerCase() == 'number'){
                            ca.when(item.fieldName +" "+value.operator +value.when).then(value.then);
                        }else{
                            ca.when(item.fieldName +" "+value.operator +"'"+value.when+"'").then(value.then);
                        }

                    });

                    ca.else(defa);

                    select.group(ca);

                }

            }

        }

        return select;
    }

}


function buildGroupBy(groupByJson) {
    return _buildGroupByOperation(groupByJson);
}

console.log(buildGroupBy(json).toString())