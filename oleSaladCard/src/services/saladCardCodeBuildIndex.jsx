//#import pigeon.js
//#import Util.js
//#import search.js
//#import $oleSaladCard:services/saladCardCodeService.jsx

(function () {
    if (typeof ids == "undefined") {
        return;
    }

    var idArray = ids.split(",");
    var docs = [];
    for (var i = 0; i < idArray.length; i++) {
        var id = idArray[i];
        var jRecord = saladCardCodeService.getSaladCardCode(id);
        if (jRecord) {
            var doc = {};
            doc.id = jRecord.id;
            doc.keyword_text = jRecord.id;
            doc.createTime = jRecord.createTime;
            doc.createUserId = jRecord.createUserId;
            doc.ot = "oleSaladCard_redeemCode";
            docs.push(doc);
        }
    }

    SearchService.index(docs, ids);

})();