//그래프
GraphKUtil.prototype 		= new Object();
function GraphKUtil (){};
GraphKUtil.prototype = new Object();
GraphKUtil.UNIQUEID=0;
GraphKUtil.getMinByObjectArray=function(objectArray, varName){
	var min = undefined;
	if(varName && objectArray && objectArray.length>0){
		min = objectArray[0][varName];
		for ( var i = 1; i < objectArray.length; i++) {
			min = Math.min(min,objectArray[i][varName]);
		}
	}
	return min;
};
GraphKUtil.getMaxByObjectArray=function(objectArray, varName){
	var max = undefined;
	if(varName && objectArray && objectArray.length>0){
		max = objectArray[0][varName];
		for ( var i = 1; i < objectArray.length; i++) {
			max = Math.max(max,objectArray[i][varName]);
		}
	}
	return max;
};
GraphKUtil.getSumByObjectArray=function(objectArray, varName){
	var sum = 0;
	if(varName && objectArray && objectArray.length>0){
		for ( var i = 0; i < objectArray.length; i++) {
			sum += objectArray[i][varName];
		}
	}
	return sum;
};
