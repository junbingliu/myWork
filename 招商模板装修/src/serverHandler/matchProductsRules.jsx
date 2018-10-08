//#import Util.js
//#import favorite.js
//#import login.js
//#import json2.js

;
(function () {
    var selfApi = new JavaImporter(
        Packages.org.json,
        Packages.java.lang,
        Packages.java.util,
        Packages.net.xinshi.isone.modules,
        Packages.net.xinshi.isone.modules.businessrange,
        Packages.net.xinshi.isone.modules.businessruleEx,
        Packages.net.xinshi.isone.modules.businessruleEx.plan,
        Packages.net.xinshi.isone.modules.businessruleEx.plan.bean,
        Packages.net.xinshi.isone.modules.businessruleEx.rule.picene.impl
    );
    try {
        var ret = {
            state: false,
            data: {}
        }

        var userId = LoginService.getFrontendUserId();
        if (userId == "") {
            userId = "-1";
        }

        var jsonString = $.params.jsonString;
        var jsonParam = new selfApi.JSONObject(jsonString);

        var ruleLabelsMap = {};
        var productRulesMap = selfApi.IsoneBusinessRuleEngineEx.buyFlowPlanExecutor.getRulesForProducts(jsonParam, userId);
        var jsonData = $.java2Javascript(productRulesMap);
        if(jsonData){
            for(var key in jsonData){
                var rules = jsonData[key];
                if(rules.length > 0){
                    var ruleLabels = [];
                    for(var i=0;i<rules.length;i++){
                        var label = "";
                        if(rules[i].type == "pdf" || rules[i].type == "odf"){
                            label = "运费优惠"
                        }else if(rules[i].type == "php"){
                            //label = "送积分"
                        }else if(rules[i].type == "pds" || rules[i].type == "ods"){
                            label = "满减"
                        }else if(rules[i].type == "pgc" || rules[i].type == "OGC"){
                            label = "送券"
                        }else if(rules[i].type == "pnds"){
                            label = "第N件优惠"
                        }else if(rules[i].type == "OUC" || rules[i].type == "PUC"){
                            label = "用券"
                        }else if(rules[i].type == "ppr" || rules[i].type == "opr"){
                            label = "赠品"
                        }else if(rules[i].type == "plpbr" || rules[i].type == "olpbr"){
                            label = "换购"
                        }
                        if(ruleLabels.indexOf(label) > -1){
                            continue;
                        }
                        if(label == ""){
                            continue;
                        }
                        if(ruleLabels.length >= 3){
                            break;
                        }
                        ruleLabels.push(label);
                    }
                    ruleLabelsMap[key] = ruleLabels;
                }
            }
            ret.state = true;
            ret.data = ruleLabelsMap;
        }
        out.print(JSON.stringify(ret));
    } catch (e) {
        var ret = {
            state: false
        }
        out.print(JSON.stringify(ret));
        $.log(e);
    }
})();