//#import pigeon.js
//#import Util.js
//#import search.js
//#import $popupsManage:services/PopupsService.jsx

(function () {
    if (typeof ids == "undefined") {
        return;//do nothing
    }
    var idArray = ids.split(",");
    var docs = [];
    for (var i = 0; i < idArray.length; i++) {
        var id = idArray[i];
        var jRecord = PopupsService.getPopups(id);
        if (jRecord) {
            var doc = {};
            doc.id = jRecord.id;
            doc.keyword_text = jRecord.id + "|" + jRecord.type + "|" + jRecord.description;
            doc.ot = "popupsManage_popups";
            docs.push(doc);
        }
    }
    SearchService.index(docs, ids);
})();