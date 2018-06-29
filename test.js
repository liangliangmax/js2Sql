var squel = require("squel");

var select = squel.select({ separator: "\n" });

select.from("dwd_gsm_iogsmdba_cdr_gsm1","a");
select.left_join("dwd_gsm_iogsmdba_cdr_gsm3","b","a.imsi=b.imsi");

select.left_join("dwd_gsm_iogsmdba_cdr_gsm5","c","a.imsi=c.imsi");

select.field("a.imsi")
    .field("a.msisdn")

    .field("b.msisdn")
    .field("b.call_duration")
    .field("c.product_id")
    .field("sum(b.product_id)","product_id_sum")
    .field(
        squel.case("a.imsi")
            .when("1").then("aaaa")
            .when("2").then("bbb").else("0")
        ,"imsi"
    );


select.where(" 1=1 ");

select.where(
        squel.expr()
            .and("a.imsi=123")
            .and("b.imsi=123")
            .and(
                squel.expr()
                    .or("c.imsi=123")
                    .or("c.msisdn=456")
                    .or(
                        squel.expr()
                            .and("sum(a.product_id)='111'")
                            .and("a.prov_cd='222'")
                    )
            )
    );

select.group("a.imsi").group("b.msisdn");
select.order("a.imsi",true);


console.log( select.toString());


