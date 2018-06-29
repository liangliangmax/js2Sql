var squel = require("squel");
var select = squel.select({ separator: "\n" });


var json = {

    "rules": {
        "mainTable":{
            "tableName":"tablea",
            "alias":"a"
        },
        "subtables":[
            {
                "tableName":"tableb",
                "alias":"b",
                "relation":"left join",
                "condition":"a.imsi = b.imsi"
            }
        ]

    }

}

var json2 = {

    "rules":{
        "mainTable":{
            "tableName":"tablea",
            "alias":"a"
        },
        "subtables":[
            {
                "tableName":"tableb",
                "alias":"b",
                "relation":"left join",
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
                "relation":"right join",
                "condition":"a.imsi = c.imsi",
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


var json3 = {

    "rules":{
        "mainTable":{
            "tableName":"tablea",
            "alias":"a"
        },
        "subtables":[
            {
                "tableName":"tableb",
                "alias":"b",
                "relation":"full join",
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
                "relation":"full join",
                "condition":"a.imsi = c.imsi",
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


var json4 = {

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

console.log(buildTable(json3).toString())