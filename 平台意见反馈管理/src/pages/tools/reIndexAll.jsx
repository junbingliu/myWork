//#import Util.js
//#import login.js
//#import $platformFeedbackServer:services/PlatformFeedbackService.jsx

(function () {
    try {
        var loginUserId = LoginService.getBackEndLoginUserId();
        if (!loginUserId || loginUserId == "") {
            out.print("no privilege");
            return;
        }

        var total = 0;
        var recordList = PlatformFeedbackService.getAllFeedbackList(0, -1);
        for (var i = 0; i < recordList.length; i++) {
            var jRecord = recordList[i];

            if (!jRecord) {
                continue;
            }

            PlatformFeedbackService.buildIndex(jRecord.id);
            total++;
        }


        out.print("total=" + total);
    } catch (e) {
        out.print("e=" + e);
    }

})();




