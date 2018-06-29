var squel = require("squel");
var select = squel.select({ separator: "\n" });


var table = {

    "rules":{
        "mainTable":{
            "tableName":"tablea",
            "alias":"a"
        },
        "subtables":[
            {
                "tableName":"tableb",
                "alias":"b",
                "relation":"inner join",
                "condition":"a.imsi = b.imsi",
                "otherRelations":[
                    {
                        "tableName":"tablec",
                        "alias":"c",
                        "condition":"b.imsi = c.imsi"
                    }
                ]
            },{
                "tableName":"tablec",
                "alias":"c",
                "relation":"left join",
                "condition":"a.imsi = c.imsi and c.imsi is null",
                "otherRelations":[
                    {
                        "tableName":"tableb",
                        "alias":"b",
                        "condition":"b.imsi = c.imsi"
                    }
                ]
            }

        ]

    }


}


var field = {

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
                            "operator":"<>",
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

var where = {
    "condition": "AND",
    "rules": [
        {
            "id": "name",
            "fieldName": "name",
            "type": "string",
            "operator": "=",
            "value": "fdsf",
            "hasFunction":false
        },
        {
            "condition": "OR",
            "rules": [
                {
                    "id": "name",
                    "fieldName": "name",
                    "type": "string",
                    "operator": "in",
                    "value": "123,567,789",
                    "hasFunction":false
                },{
                    "id": "score",
                    "fieldName": "score",
                    "type": "number",
                    "operator": "in",
                    "value": "123,567,789",
                    "hasFunction":true,
                    "func":{
                        "name":"sum",
                        "hasFormat":false
                    }
                },{
                    "id": "date",
                    "fieldName": "date",
                    "type": "date",
                    "operator": ">=",
                    "value": "2018-01-01 00:00:00",
                    "hasFunction":true,
                    "func":{
                        "name":"str_to_date",
                        "hasFormat":true,
                        "format":"%Y-%m-%d %H:%i:%s"
                    }
                },
                {
                    "id": "price",
                    "fieldName": "price",
                    "type": "number",
                    "operator": "<=",
                    "value": 111,
                    "hasFunction":true,
                    "func":{
                        "name":"sum",
                        "hasFormat":false
                    }
                },
                {
                    "condition": "AND",
                    "rules": [
                        {
                            "id": "name",
                            "fieldName": "name",
                            "type": "string",
                            "operator": "<>",
                            "value": "zxc",
                            "hasFunction":false

                        },
                        {
                            "id": "category",
                            "fieldName": "category",
                            "type": "number",
                            "operator": ">=",
                            "value": 1,
                            "hasFunction":false
                        },
                        {
                            "id": "date",
                            "fieldName": "date",
                            "type": "date",
                            "operator": ">=",
                            "value": "2018-01-01 00:00:00",
                            "hasFunction":true,
                            "func":{
                                "name":"str_to_date",
                                "hasFormat":true,
                                "format":"%Y-%m-%d %H:%i:%s"
                            }
                        },
                        {
                            "id": "productId",
                            "fieldName": "productId",
                            "type": "string",
                            "operator": ">=",
                            "value": "1000",
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
            ]
        }
    ],
    "valid": true
}


var group = {

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
                            "operator":"<>",
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

var order = {

    "fieldsName":[
        {
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





function _buildTableOperation(tableJson) {

    if(tableJson.rules ){
        var rules = tableJson.rules;

        var mainTable = rules.mainTable;

        select.from(mainTable.tableName,mainTable.alias);

        var subtables = rules.subtables;

        subtables.forEach(function (item,index,array) {

            var relation = item.relation;

            switch (relation.toLowerCase()){

                case 'left join':
                    select.left_join(item.tableName,item.alias,item.condition);

                    //如果存在不是与主表的关系，则需要拼接到where条件中
                    //正常情况下a,b,c三张表，a左联b on a.xx=b.xx，a左联c a.xx=c.xx，特殊情况下会有条件b.xx=c.xx，会出现otherRelations字段
                    if(item.otherRelations){
                        _buildOtherWhere(item.otherRelations);
                    }

                    break;

                case 'right join':

                    select.right_join(item.tableName,item.alias,item.condition);

                    //如果存在不是与主表的关系，则需要拼接到where条件中
                    //正常情况下a,b,c三张表，a左联b on a.xx=b.xx，a左联c a.xx=c.xx，特殊情况下会有条件b.xx=c.xx，会出现otherRelations字段
                    if(item.otherRelations){
                        _buildOtherWhere(item.otherRelations);
                    }

                    break;

                case 'full join':
                    //TODO 这个方法有问题，还得细研究

                    select

                        .left_join(item.tableName,item.alias,item.condition)
                        .union(squel.select().from(mainTable.tableName,mainTable.alias)
                            .right_join(item.tableName,item.alias,item.condition));

                    //如果存在不是与主表的关系，则需要拼接到where条件中
                    //正常情况下a,b,c三张表，a左联b on a.xx=b.xx，a左联c a.xx=c.xx，特殊情况下会有条件b.xx=c.xx，会出现otherRelations字段
                    if(item.otherRelations){
                        _buildOtherWhere(item.otherRelations);
                    }

                    break;

                default:
                    //默认值就是inner join
                    select.join(item.tableName,item.alias,item.condition);

                    //如果存在不是与主表的关系，则需要拼接到where条件中
                    //正常情况下a,b,c三张表，a左联b on a.xx=b.xx，a左联c a.xx=c.xx，特殊情况下会有条件b.xx=c.xx，会出现otherRelations字段
                    if(item.otherRelations){
                        _buildOtherWhere(item.otherRelations);
                    }


                    break;

            }


        });

    }

    return select;
}

function _buildOtherWhere(otherRelations) {

    otherRelations.forEach(function (value, index, array) {
        select.where(value.condition);
    });

    return select;
}

function buildTable(tableJson) {
    return _buildTableOperation(tableJson);
}



/**
 * 格式参考https://querybuilder.js.org/demo.html
 * @param json
 * @returns {squel.Expression}
 * @private
 */
function _buildWhereOperation(json) {
    if(json.rules && json.rules.length!=0){

        var array = json.rules;
        var operator = json.condition;

        var ope =  squel.expr();

        for(var i = 0;i<array.length;i++){

            var item = array[i];

            //说明还有子rule
            if(item.rules){
                //需要将本子节点传入，然后返回一个条件对象，然后拼接到上一个条件对象上
                var result = _buildWhereOperation(item)

                if(operator.toLowerCase() == 'or'){
                    ope.or(result)
                }else{
                    ope.and(result)
                }

            }else{
                //说明没有rule了

                //最后被拼接的字符串
                var resultStr = '';

                //拼接本字段要比较的对象值，如果不是in，则直接取value字段即可，如果有in条件，需要把value内容拿出来，处理成in的格式，然后去拼接
                var conditionValue = '';

                if(item.operator.toLowerCase() != 'in'){

                    conditionValue = "'"+item.value+"'";
                }else{
                    conditionValue= _generateInCondition(item.value);
                }

                if(!item.hasFunction){
                    //没有函数直接拼接就好
                    resultStr = item.fieldName +" "+ item.operator +" "+conditionValue;
                }else{
                    var func = item.func;

                    //如果有函数，并且没有格式要求的，condition是case when的条件，需要单独处理
                    if(!func.hasFormat && !func.condition){
                        resultStr = item.func.name+"("+item.fieldName +") "+ item.operator +" "+conditionValue;

                    }else if(func.hasFormat){
                        //如果有格式，需要把格式拼接
                        resultStr = func.name+"("+item.fieldName +",'"+func.format+"') "+ item.operator +" "+conditionValue;

                    }else if(func.condition){
                        //case when 条件

                        var defa = func.condition.default;

                        var rules = func.condition.rules;

                        var ca =  squel.case();

                        rules.forEach(function (value, index, array) {
                            //取出每个when条件，进行拼接
                            if(value.type.toLowerCase() == 'number'){
                                ca.when(item.fieldName +" "+value.operator +value.when).then(value.then);
                            }else{
                                ca.when(item.fieldName +" "+value.operator +"'"+value.when+"'").then(value.then);
                            }

                        });

                        //默认值
                        ca.else(defa);

                        resultStr = "("+ca.toString()+")"+item.operator+conditionValue;

                    }

                }

                if(operator.toLowerCase() == 'or'){
                    ope.or(resultStr);
                }else{
                    //操作符是and
                    ope.and(resultStr);
                }
            }

        }

        return ope;

    }else{
        //没有rule，应该不会存在这种情况
        console.log("====================")
        console.log(json)
    }
}

/**
 * 将传入的aaa,bbb,ccc这种条件转换成('aaa','bbb','ccc')
 */
function _generateInCondition(arrStr){
    var values = arrStr.split(",");

    var str = "(";
    values.forEach(function(value,index,array){
        str+="'"+value+"',";
    });
    str = str.substring(0,str.length-1);
    str+=")";

    return str;
}



//构建where整个句子，调用这个方法就好,返回select对象
function buildWhere(whereJson) {

    select.where(_buildWhereOperation(whereJson));

    return select;
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


buildTable(table);
buildField(field);
buildWhere(where);
buildGroupBy(group);
buildOrderBy(order);


console.log(select.toString())