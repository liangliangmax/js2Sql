var squel = require("squel");

var select = squel.select({ separator: "\n" });



/**
 * 拼接where条件，需要页面提供的格式如下，格式参考https://querybuilder.js.org/demo.html
 * var json3 = {
    "condition": "AND",
    "rules": [
        {
            "id": "name",
            "field": "name",
            "type": "string",
            "input": "text",
            "operator": "equal",
            "value": "fdsf"
        },
        {
            "condition": "OR",
            "rules": [
                {
                    "id": "name",
                    "field": "name",
                    "type": "string",
                    "input": "text",
                    "operator": "in",
                    "value": "123"
                },
                {
                    "id": "price",
                    "field": "price",
                    "type": "double",
                    "input": "number",
                    "operator": "equal",
                    "value": 111
                },
                {
                    "condition": "AND",
                    "rules": [
                        {
                            "id": "name",
                            "field": "name",
                            "type": "string",
                            "input": "text",
                            "operator": "equal",
                            "value": "zxc"
                        },
                        {
                            "id": "category",
                            "field": "category",
                            "type": "integer",
                            "input": "select",
                            "operator": "equal",
                            "value": 1
                        }
                    ]
                }
            ]
        }
    ],
    "valid": true
}

 SELECT
 WHERE (name equal fdsf AND (name in 123 OR price equal 111 OR (name equal zxc AND category equal 1)))
 * @param json
 * @returns {squel.Expression}
 */

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
                //TODO 还没判断是数值类型还是字符串，switch case 语句有问题
                if(operator.toLowerCase() == 'or'){
                    if(item.operator.toLowerCase() == 'in'){

                        var valuesStr = _generateInCondition(item.value);

                        ope.or(item.field +" "+ item.operator +" "+valuesStr);

                    }else{

                        ope.or(item.field +" "+ item.operator +" "+"'" +item.value+"'")
                    }

                }else{//操作符是and
                    if(item.operator.toLowerCase() == 'in'){

                        var valuesStr = _generateInCondition(item.value);

                        ope.and(item.field +" "+ item.operator +" "+valuesStr);

                    }else{

                        ope.and(item.field +" "+ item.operator +" "+"'" +item.value+"'")
                    }
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

    var str = '(';
    values.forEach(function(value,index,array){
        str+="'"+value+"',";
    });
    str = str.substring(0,str.length-1);
    str+=")";

    return str;
}

//构建where整个句子，调用这个方法就好
function buildWhere(whereJson) {
    return select.where(_buildWhereOperation(whereJson));
}


