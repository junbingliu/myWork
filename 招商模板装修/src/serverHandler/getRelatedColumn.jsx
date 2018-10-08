//#import Util.js
//#import product.js
//#import search.js

;(function(){
    try{

        var productId = $.params.productId;
        var jProduct=ProductService.getProduct(productId);
        var searchArgs = {keyword:jProduct.name,fromPath:0,fetchCount:20,showState:"s",path:"c_10000"};
        var searchFactLevel=3+position.length-1;
        var column_facetColumn="column_facetColumn"+searchFactLevel;
        var column_facetColumn1="column_facetColumn"+(searchFactLevel+1);
        var column_facetColumn2="column_facetColumn"+(searchFactLevel+2);
        searchArgs.facetFields=["brandId",column_facetColumn,column_facetColumn1,column_facetColumn2];
        var searchArgsString = JSON.stringify(searchArgs);
        var javaArgs = ProductApi.ProductSearchArgs.getFromJsonString(searchArgsString);
        var results = ProductApi.IsoneFulltextSearchEngine.searchServices.search(javaArgs);

        //搜索出来的商品所属分类
        var allSearchColumnsValue=[];
        for(var i=0;i<3;i++){
            var searchColumnsValue=$.java2Javascript(results.getFacets().get("column_facetColumn"+(searchFactLevel+i)));
            for(var j=0;j<searchColumnsValue.length;j++){
                allSearchColumnsValue.push(searchColumnsValue[j]);
            }
        }


        var ret = {
            state:"ok",columnValue:allSearchColumnsValue

        }
        out.print(JSON.stringify(ret));
    }
    catch(e){
        var ret = {
            state:"err",
            msg:e
        }
        out.print(JSON.stringify(ret));
    }
})();