var squel = require("squel");
var select = squel.select({ separator: "\n" });



var json = {

    "fields":[
        {
            "fieldName":"a.imsi",
            "alias":"aimsi",
            "hasFunction":false
        }, {
            "fieldName":"a.imsi",
            "alias":"aimsi",
            "hasFunction":true,
            "func":{
                "name":"sum",
                "hasFormat":false
            }
        },{
            "fieldName":"b.msisdn",
            "alias":"bmsisdn",
            "hasFunction":true,
            "func":{
                "name":"distinct",
                "hasFormat":false
            }
        },{
            "fieldName":"b.msisdn",
            "alias":"bmsisdn",
            "hasFunction":true,
            "func":{
                "name":"floor",
                "hasFormat":false
            }
        },{
            "fieldName":"c.time",
            "alias":"ctime",
            "hasFunction":true,
            "func":{
                "name":"str_to_date",
                "hasFormat":true,
                "format":"%Y-%m-%d %H:%i:%s"
            }
        },{
            "fieldName":"c.time",
            "alias":"ctime",
            "hasFunction":true,
            "func":{
                "name":"date_format",
                "hasFormat":true,
                "format":"%Y-%m-%d %H:%i:%s"
            }
        },{
            "fieldName":"c.time",
            "alias":"ctime",
            "hasFunction":true,
            "func":{
                "name":"FROM_UNIXTIME",
                "hasFormat":true,
                "format":"%Y-%m-%d %H:%i:%s"
            }
        },{
            "fieldName":"c.time",
            "alias":"ctime",
            "hasFunction":true,
            "func":{
                "name":"year",
                "hasFormat":false
            }
        },{
            "fieldName":"a.imsi",
            "alias":"aimsi",
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
                            "then":"1"
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

function _buildFieldOperation(fieldJson) {

    var fields = fieldJson.fields;

    fields.forEach(function (item,index,array) {

        if(!item.hasFunction){
            //不包含函数的直接拼接即可
            select.field(item.fieldName,item.alias);
        }else{
            //包含函数的

            var func = item.func;

            //如果有函数，并且没有格式要求的，condition是case when的条件，需要单独处理
            if(!func.hasFormat && !func.condition){
                //没有格式要求
                var funStr = func.name+"("+item.fieldName+")";
                select.field(funStr,item.alias);

            }else if(func.hasFormat){
                //有格式要求，比如to_date函数，可以格式化时间
                var funStr = func.name+"("+item.fieldName+",'"+func.format+"')";
                select.field(funStr,item.alias);

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

                select.field(ca,item.alias);

            }
        }

    });


    return select;
}


function buildField(fieldJson) {
    return _buildFieldOperation(fieldJson);
}

console.log(buildField(json).toString())