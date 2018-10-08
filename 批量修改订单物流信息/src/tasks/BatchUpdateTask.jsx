//#import Util.js
//#import excel.js
//#import login.js
//#import user.js
//#import file.js
//#import log.js
//#import order.js
//#import delMerchant.js
//#import open-order.js

;
(function () {
    var logInfo;
    var total = 0;
    var totalSkip = 0;
    var totalError = 0;
    var totalSuccess = 0;
    var beginTime = (new Date()).getTime();
    var jLog = LogService.getNewInitLog(merchantId, userId, "batchUpdateOrderLogistics_Log");
    try {

        var jData = Excel.parse(filePath);
        if (!jData) {
            logInfo = "读取Excel文件失败";
            jLog = LogService.saveLog(jLog, logInfo);
            return;
        }

        logInfo = "导入文件地址：<a href='" + fullPath + "' target='_blank'>" + fullPath + "</a>";
        jLog = LogService.saveLog(jLog, logInfo);

        if (!jData.sheets || jData.sheets.length == 0) {
            logInfo = "Excel中的sheet为空";
            jLog = LogService.saveLog(jLog, logInfo);
            return;
        }
        var sheet = jData.sheets[0];
        var rows = sheet.rows;

        var delMerchantListCache = {};
        var delMerchantList = [];
        if (merchantId != "head_merchant") {
            delMerchantList = DelMerchantService.getDelMerchants(merchantId);
        }

        for (var j = 1; j < rows.length; j++) {
            try {
                total++;
                var row = rows[j];
                var cells = row.cells;
                var orderId = getCellValue(cells, 0);
                var logisticsName = getCellValue(cells, 1);
                var waybill = getCellValue(cells, 2);

                if ((!orderId || orderId == "") &&
                    (!logisticsName || logisticsName == "") &&
                    (!waybill || waybill == "")) {
                    logInfo = "第" + (j + 1) + " 行验证不通过，原因是：所有字段为空，已忽略";
                    jLog = LogService.saveLog(jLog, logInfo);
                    totalSkip++;
                    continue;
                }

                if (!orderId || orderId == "") {
                    logInfo = "第 " + (j + 1) + " 行验证不通过，原因是：订单编号为空";
                    jLog = LogService.saveLog(jLog, logInfo);
                    totalError++;
                    continue;
                }

                if (!logisticsName || logisticsName == "") {
                    logInfo = "第 " + (j + 1) + " 行验证不通过，原因是：配送商名称为空";
                    jLog = LogService.saveLog(jLog, logInfo);
                    totalError++;
                    continue;
                }

                if (!waybill || waybill == "") {
                    logInfo = "第 " + (j + 1) + " 行验证不通过，原因是：运单号为空";
                    jLog = LogService.saveLog(jLog, logInfo);
                    totalError++;
                    continue;
                }

                var jOrder;
                if (orderId.indexOf("o_") == -1) {
                    jOrder = OrderService.getOrderByAliasCode(orderId);
                } else {
                    jOrder = OrderService.getOrder(orderId);
                }
                if (!jOrder) {
                    logInfo = "第 " + (j + 1) + " 行验证不通过，原因是：订单编号为【" + orderId + "】的订单不存在";
                    jLog = LogService.saveLog(jLog, logInfo);
                    totalError++;
                    continue;
                }
                orderId = jOrder.id;
                var sellerId = jOrder.sellerInfo.merId;

                if (merchantId != "head_merchant" && sellerId != merchantId) {
                    logInfo = "第 " + (j + 1) + " 行验证不通过，原因是：当前账号无权操作订单编号为【" + orderId + "】的订单";
                    jLog = LogService.saveLog(jLog, logInfo);
                    totalError++;
                    continue;
                }

                if (merchantId == "head_merchant") {
                    delMerchantList = delMerchantListCache[sellerId];
                    if (!delMerchantList) {
                        delMerchantList = DelMerchantService.getDelMerchants(sellerId);
                        if (delMerchantList) {
                            delMerchantListCache[sellerId] = delMerchantList;
                        }
                    }
                }

                var jDelMerchant = getDelMerchantByName(delMerchantList, logisticsName);
                if (!jDelMerchant) {
                    logInfo = "第 " + (j + 1) + " 行验证不通过，原因是：ID为【" + sellerId + "】的商家不存在名称为【" + logisticsName + "】的配送商";
                    jLog = LogService.saveLog(jLog, logInfo);
                    totalError++;
                    continue;
                }

                var jParamInfo = {};
                jParamInfo.orderId = orderId;
                jParamInfo.logisticsId = jDelMerchant.id;
                jParamInfo.waybill = waybill;
                jParamInfo.force = "Y";

                var doResult = OpenOrderService.updateOrderLogisticsInfo(jParamInfo);
                if (doResult.code != "0") {
                    totalError++;
                    logInfo = "第 " + (j + 1) + " 行修改失败，原因是：" + doResult.msg;
                    jLog = LogService.saveLog(jLog, logInfo);
                } else {
                    logInfo = "第 " + (j + 1) + " 行修改成功";
                    jLog = LogService.saveLog(jLog, logInfo);
                    totalSuccess++;
                }

                if(modify_type=='1'){
                    var jConfig = {};
                    jConfig.description = "手机端商家后台修改订单为已出库";//这个是修改出库说明
                    jConfig.operatorUserId = userId;
                    jConfig.allowLogisticsNull = false;//是否允许物流信息为空

                    var result = OpenOrderService.shippedOrderEx(orderId, "", jDelMerchant.id, waybill, jConfig);
                    $.log("物流信息不允许为空------"+JSON.stringify(result))
                    if (result.code != "0") {
                        totalError++;
                        logInfo = "第 " + (j + 1) + " 行修改出库（物流信息不允许为空）失败，原因是：" + result.msg;
                        jLog = LogService.saveLog(jLog, logInfo);
                    } else {
                        logInfo = "第 " + (j + 1) + " 行修改出库（物流信息不允许为空）成功";
                        jLog = LogService.saveLog(jLog, logInfo);
                        totalSuccess++;
                    }
                }else if(modify_type=='2'){
                    var jConfig = {};
                    jConfig.description = "手机端商家后台修改订单为已出库";//这个是修改出库说明
                    jConfig.operatorUserId = userId;
                    jConfig.allowLogisticsNull = true;//是否允许物流信息为空

                    var result = OpenOrderService.shippedOrderEx(orderId, "", jDelMerchant.id, waybill, jConfig);
                    $.log("物流信息允许为空------"+JSON.stringify(result))
                    if (result.code != "0") {
                        totalError++;
                        logInfo = "第 " + (j + 1) + " 行修改出库（物流信息允许为空）失败，原因是：" + result.msg;
                        jLog = LogService.saveLog(jLog, logInfo);
                    } else {
                        logInfo = "第 " + (j + 1) + " 行修改出库（物流信息允许为空）成功";
                        jLog = LogService.saveLog(jLog, logInfo);
                        totalSuccess++;
                    }
                }
            }
            catch (e) {
                totalError++;
                logInfo = "第 " + j + " 行出现异常：" + e;
                jLog = LogService.saveLog(jLog, logInfo);
            }
        }
    } catch (e) {
        logInfo = "批量修改出现异常，异常信息为：" + e;
        jLog = LogService.saveLog(jLog, logInfo);
    } finally {
        var endTime = (new Date()).getTime();
        logInfo = "总耗时=" + (endTime - beginTime) + "毫秒";
        logInfo += "。总行数=" + total;
        logInfo += "，忽略行总数=" + totalSkip;
        logInfo += "，异常行总数=" + totalError;
        logInfo += "，共成功处理行数=" + totalSuccess;
        jLog = LogService.realSaveLog(jLog, logInfo);
    }
})();

function getCellValue(cells, index) {
    for (var i = 0; i < cells.length; i++) {
        var jCell = cells[i];
        if (jCell.columnIndex == index) {
            if (jCell.value) {
                return jCell.value;
            }
        }
    }
    return "";
}

function getDelMerchantByName(delMerchantList, logisticsName) {
    if (delMerchantList) {
        for (var i = 0; i < delMerchantList.length; i++) {
            var jDelMerchant = delMerchantList[i];
            var name = jDelMerchant["delMerchantName"];

            if (logisticsName === name) {
                return jDelMerchant;
            }
        }
    }
    return null;

}