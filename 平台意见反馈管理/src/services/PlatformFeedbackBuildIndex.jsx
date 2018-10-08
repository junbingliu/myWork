//#import pigeon.js
//#import Util.js
//#import search.js
//#import $platformFeedbackServer:services/PlatformFeedbackService.jsx

(function () {
    if (typeof ids == "undefined") {
        return;//do nothing
    }

    var idArray = ids.split(",");//platformFeedbackServerObj_60008,platformFeedbackServerObj_60009
    var docs = [];
    for (var i = 0; i < idArray.length; i++) {
        var id = idArray[i];
        var jRecord = PlatformFeedbackService.getFeedback(id);
        if (jRecord) {
            var doc = {};
            doc.id = jRecord.id;//中国人
            doc.keyword_text = jRecord.title + "|" + jRecord.content + "|" + jRecord.contact +"|"+jRecord.id;
            doc.createTime = jRecord.createTime;
            doc.createUserId = jRecord.createUserId;
            doc.ot = "platformFeedbackServer";
            docs.push(doc);
        }
    }

    SearchService.index(docs, ids);

})();