var squel = require("squel");

var select = squel.select({ separator: "\n" });


var json = {
    "condition": "AND",
    "rules": [
        {
            "id": "name",
            "fieldName": "name",
            "type": "string",
            "input": "text",
            "operator": "=",
            "value": "333"
        },
        {
            "id": "name",
            "fieldName": "name",
            "type": "string",
            "input": "text",
            "operator": "=",
            "value": "222"
        },
        {
            "id": "name",
            "fieldName": "name",
            "type": "string",
            "input": "text",
            "operator": "<>",
            "value": "111"
        }
    ],
    "valid": true
}


var json2 = {
    "condition": "AND",
    "rules": [
        {
            "id": "name",
            "fieldName": "name",
            "type": "string",
            "input": "text",
            "operator": "=",
            "value": "333"
        }
    ],
    "valid": true
}

var json3 = {
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
                                            "operator":"==",
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

console.log(buildWhere(json3).toString());

