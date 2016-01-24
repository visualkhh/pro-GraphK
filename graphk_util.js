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
GraphKUtil.createCanvas=function(w, h){
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	return canvas;
};
GraphKUtil.copyCanvas=function(canvas){
	var newCanvas = document.createElement("canvas");
	newCanvas.width = canvas.width;
	newCanvas.height = canvas.height;
	context = newCanvas.getContext("2d");
	context.drawImage(canvas, 0, 0); 
	return newCanvas;
};
//end - start    끝과 시작의 사이길이를 취득한다.
GraphKUtil.getBetweenLength=function(start, end){
	return end - start;
};

//전체값에서 일부값은 몇 퍼센트? 계산법 공식    tot에서  data는 몇%인가.
GraphKUtil.getPercentByTot=function(tot, data){
	/*
	전체값에서 일부값은 몇 퍼센트? 계산법 공식
	일부값 ÷ 전체값 X 100
	예제) 300에서 105는 몇퍼센트?
	답: 35%
	*/
	return (data / tot) * 100;
};
//전체값의 몇 퍼센트는 얼마? 계산법 공식    tot에서  wantPercent는 몇인가?
GraphKUtil.getValueByTotInPercent=function(tot, wantPercent){
	/*
	전체값 X 퍼센트 ÷ 100
	예제) 300의 35퍼센트는 얼마?
	답) 105
	 */
	return (tot * wantPercent) / 100;
};
//숫자를 몇 퍼센트 증가시키는 공식    tot에서  wantPercent을 증가 시킨다
GraphKUtil.getValuePercentUp=function(tot, wantPercent){
	/*
	숫자를 몇 퍼센트 증가시키는 공식
	숫자 X (1 + 퍼센트 ÷ 100)
	예제) 1548을 66퍼센트 증가하면?
	답) 2569.68
	 */
	return tot * (1 + wantPercent / 100);
};
//숫자를 몇 퍼센트 감소하는 공식    tot에서  wantPercent을 증감 시킨다
GraphKUtil.getValuePercentDown=function(tot, wantPercent){
	/*
	숫자를 몇 퍼센트 감소하는 공식
	숫자 X (1 - 퍼센트 ÷ 100)
	예제) 1548을 66퍼센트 감소하면?
	답) 526.32
	 */
	return tot * (1 - wantPercent / 100);
};

GraphKUtil.getRandomColor=function(){
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
