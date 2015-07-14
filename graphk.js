//그래프
GraphK.prototype 		= new Object();
GraphK.prototype.name	= "RectK";
GraphK.prototype.canvas = undefined;

//container > content > chart > item..

GraphK.prototype.contentFillStyle		= "#FFFFFF";
GraphK.prototype.contentStrokeStyle		= "#222222";
GraphK.prototype.contentTitle			= "TITLE";
GraphK.prototype.contentStrokeStyle		= "#222222";
GraphK.prototype.chartFillStyle			= "#FFFFFF";
GraphK.prototype.chartStrokeStyle 		= "#333333";
GraphK.prototype.chartCrossGrideVisible = true;
GraphK.prototype.chartCrossGrideXCount 	= 10;
GraphK.prototype.chartCrossGrideYCount 	= 10;
GraphK.prototype.chartAxisXCount 		= 15;
GraphK.prototype.chartAxisYCount 		= 15;
GraphK.prototype.chartAxisXDataName 	= "x"; //GraphKData에 Data로들어갈 변수명
GraphK.prototype.chartAxisYDataName 	= "y";
GraphK.prototype.chartAxisXMinVisible 	= true;
GraphK.prototype.chartAxisYMinVisible 	= true;
GraphK.prototype.chartAxisXMaxVisible 	= false;
GraphK.prototype.chartAxisYMaxVisible 	= false;
GraphK.prototype.chartAxisXVisible 		= true;
GraphK.prototype.chartAxisYVisible 		= true;
GraphK.prototype.chartCrossStrokeStyle 	= "#EEEEEE";




GraphK.prototype.lpadding 	= 10;
GraphK.prototype.tpadding 	= 10;
GraphK.prototype.rpadding 	= 10;
GraphK.prototype.bpadding 	= 10;

GraphK.prototype.lmargin	= 10;
GraphK.prototype.tmargin	= 10;
GraphK.prototype.rmargin	= 10;
GraphK.prototype.bmargin	= 10;

GraphK.prototype.data	= new Array();  //[GraphDataK,...]
	
function GraphK(targetCanvas){
	if(Object.prototype.toString.call(targetCanvas)=='[object String]'){
		this.canvas = document.querySelector(targetCanvas);
	}else{
		this.canvas = targetCanvas;
	}
}
GraphK.prototype.onMouseTraking = function(){
	this.canvas.addEventListener("mousemove", function(event) {
	    event.preventDefault();
        var rect = event.target.getBoundingClientRect();
        var point = new PointK(event.clientX - rect.left ,event.clientY - rect.top);
        console.log(point.x+"    "+point.y);
	  }, false);

}

GraphK.prototype.rendering = function(){
	var context = this.canvas.getContext("2d"); 
	context.lineWidth =1;
	context.textAlign="center";
	context.textBaseline = "middle";
	//container
	var containerRect = new RectK(0, 0, this.canvas.width, this.canvas.height);
	containerRect.strokeRect(context);
	
	//content  margin set   //t,r,b,l
	var contentRect = containerRect.getPadding(this.tmargin, this.rmargin, this.bmargin, this.lmargin);
	contentRect.fillRect(context, this.contentFillStyle);
	contentRect.strokeRect(context, this.contentStrokeStyle);
	
	
	//chart padding set  //t,r,b,l
	var chartRect = contentRect.getPadding(this.tpadding, this.rpadding, this.bpadding, this.lpadding);
	chartRect.fillRect(context, this.chartFillStyle);
	chartRect.strokeRect(context, this.chartStrokeStyle);
	
	
	//
    var metrix = context.measureText(this.contentTitle);
    var line_width  = metrix.width;
    context.textBaseline = "bottom";
    context.fillText(this.contentTitle, contentRect.getCentX(), contentRect.getStartY());
    //context.fillText(this.contentTitle, contentRect.getCentX()-(line_width/2), this.tmargin);
	//
	
	
	
	/////////chart  cossGride
	var crossGrideXCount 	= this.chartCrossGrideXCount;
	var crossGrideYCount 	= this.chartCrossGrideYCount;
	var xcrossChar 			= chartRect.getEndX() - chartRect.getStartX() ;
	var xcrossCharP 		= xcrossChar/crossGrideXCount;
	var xcrossCharM 		= xcrossChar%crossGrideXCount;
	var ycrossChar 			= chartRect.getEndY() - chartRect.getStartY() ;
	var ycrossCharP 		= ycrossChar/crossGrideYCount;
	var ycrossCharM 		= ycrossChar%crossGrideYCount;
	context.strokeStyle		= this.chartCrossStrokeStyle;	
	for ( var i = 1; this.chartCrossGrideVisible && i < crossGrideXCount; i++) {
		context.beginPath(); 
		context.moveTo(chartRect.getStartX()+(xcrossCharP*i), chartRect.getStartY()); 
		context.lineTo(chartRect.getStartY()+(xcrossCharP*i), chartRect.getEndY()); 
		context.stroke(); 
	}
	for ( var i = 1; this.chartCrossGrideVisible && i < crossGrideYCount; i++) {
		context.beginPath(); 
		context.moveTo(chartRect.getStartX(), chartRect.getStartY()+(ycrossCharP*i)); 
		context.lineTo(chartRect.getEndX(), chartRect.getStartY()+(ycrossCharP*i)); 
		context.stroke(); 
	}
	
	//data Gride
	var xMin	= this.getDataXMin(); 
	var xMax	= this.getDataXMax();
	var xChar	= (xMax - xMin);
	var xP		= xChar / this.chartAxisXCount;
	var xGP		= xcrossChar / this.chartAxisXCount;
	var yMin	= this.getDataYMin();
	var yMax	= this.getDataYMax();
	var yChar	= (yMax - yMin);
	var yP		= yChar / this.chartAxisYCount;
	var yGP		= ycrossChar / this.chartAxisYCount;
	//console.log(xMin+", "+xMax+", "+xP+", "+xGP);
	//console.log(yMin+", "+yMax+", "+yP+", "+yGP);
	//>> X
	context.textAlign		= "left";
	context.textBaseline	= "top";
	if(this.chartAxisXMinVisible)
	context.fillText(xMin, chartRect.getStartX(), chartRect.getEndY());
	//context.textAlign		= "right";
	if(this.chartAxisXMaxVisible)
	context.fillText(xMax, chartRect.getEndX(), chartRect.getEndY());
	for ( var i = 1; this.chartAxisXVisible && i <= this.chartAxisXCount; i++) {
		context.fillText((xMin+(xP*i)).toFixed(1), chartRect.getStartX()+(xGP*i), chartRect.getEndY());
	}
	//>> Y
	context.textAlign		= "end";
	context.textBaseline	= "bottom";
	if(this.chartAxisYMinVisible)
	context.fillText(yMin, chartRect.getStartX(), chartRect.getEndY());
	if(this.chartAxisYMaxVisible)
	context.fillText(yMax, chartRect.getStartX(), chartRect.getStartY());
	for ( var i = 1; this.chartAxisYVisible && i <= this.chartAxisYCount; i++) {
		context.fillText((yMin+(yP*i)).toFixed(1), chartRect.getStartX(), chartRect.getEndY()-(yGP*i));
	}
	//-------------
	
	
	//chart grid Data
	var graphKData = this.getData();//[GraphKData,...]
	for ( var i = 0; i < graphKData.length; i++) {
		var atGraphKData = graphKData[i];
		context.strokeStyle = atGraphKData.strokeStyle||this.chartStrokeStyle; //스타일있으면 그걸로셋팅.
		console.log(context.strokeStyle);
		if(atGraphKData.type=="line"){	//차차 다른 타입도 만들어야겠다.. 
			context.beginPath(); 
			var dataArray = atGraphKData.data;  //[Object,....]
			for ( var y = 0; y < dataArray.length; y++) {
				var atData 	= dataArray[y];	//Object   ex: {x:1,y:1}
				var yData 	= atData[this.chartAxisYDataName];
				var xData 	= atData[this.chartAxisXDataName];
				var yWantChar 	= (yData - yMin); 			//ex) 10(원하는거) - 7(민) = 3(차)
				var yWantP		= (yWantChar/yChar)*100;	//13(전체차) 3(차) 몇%   23.076 %
				var xWantChar 	= (xData - xMin); 			
				var xWantP		= (xWantChar/xChar)*100;	
				
				var yWant		= ycrossChar*yWantP / 100;//전체값의 몇 퍼센트는 얼마? 계산법 공식 ;  전체값 X 퍼센트 ÷ 100
				var xWant		= xcrossChar*xWantP / 100;
				var ySet		= chartRect.getEndY() - yWant;
				var xSet		= chartRect.getStartX() + xWant;
				if(y==0){
					context.moveTo(xSet, ySet);
				}else{
					context.lineTo(xSet, ySet);
					context.textAlign		="center";
					context.textBaseline 	= "bottom";
					context.fillText(xData+","+yData, xSet, ySet);
				}
				//console.log(yData+", "+xData+"     "+xWantP+",  "+yWantP);
			}
			context.stroke(); 
		}else{
		}
		
		context.strokeStyle = this.chartStrokeStyle;
	}
	//-----
	
};

GraphK.prototype.addData = function(data){
	this.data.push(data);
}


//name		-> Axis var Name  (GraphKData.data.name)
GraphK.prototype.getDataXMin = function(name){
	var atData = this.getData(name);  //[GraphKData,...]
	return this.getDataMin(atData, this.chartAxisXDataName);
}
GraphK.prototype.getDataYMin = function(name){
	var atData = this.getData(name);  //[GraphKData,...]
	return this.getDataMin(atData, this.chartAxisYDataName);
}
GraphK.prototype.getDataXMax = function(name){
	var atData = this.getData(name);	//[GraphKData,...]
	return this.getDataMax(atData, this.chartAxisXDataName);
}
GraphK.prototype.getDataYMax = function(name){
	var atData = this.getData(name);	//[GraphKData,...]
	return this.getDataMax(atData, this.chartAxisYDataName);
}

//atData	-> [GraphKData,....]
//name		-> Axis var Name  (GraphKData.data.name)
GraphK.prototype.getDataMin = function(atData, name){
	var min = undefined;
	for ( var i = 0; i < atData.length; i++) {
		var atDataArry = atData[i].data; //[Object,..] 
		min = Math.min(min==undefined?atDataArry[0][name]:min, atDataArry[0][name]);
		for ( var y = 1; y < atDataArry.length; y++) {
			min = Math.min(min,atDataArry[y][name]);
		}
	}
	return min;
}
GraphK.prototype.getDataMax = function(atData, name){
	var max = undefined;
	for ( var i = 0; i < atData.length; i++) {
		var atDataArry = atData[i].data;
		max = Math.max(max==undefined?atDataArry[0][name]:max, atDataArry[0][name]);
		for ( var y = 1; y < atDataArry.length; y++) {
			max = Math.max(max,atDataArry[y][name]);
		}
	}
	return max;
}

//원하는 데이터Object를 가져온다.
GraphK.prototype.getData = function(name){//[GraphKData,...]
	var getData = new Array();
	if(name){
		for ( var int = 0; int < this.data.length; int++) {
			if(data[i].name == name)
				getData.push(data[i]);
		}
	}else{
		getData = this.data;
	}
	
	return getData;
}



GraphK.prototype.setContentFillStyle = function(contentFillStyle){
	this.contentFillStyle = contentFillStyle;
}
GraphK.prototype.setContentStrokeStyle = function(contentStrokeStyle){
	this.contentStrokeStyle = contentStrokeStyle;
}
GraphK.prototype.setChartFillStyle = function(chartFillStyle){
	this.chartFillStyle = chartFillStyle;
}
GraphK.prototype.setchartStrokeStyle = function(chartStrokeStyle){
	this.chartStrokeStyle = chartStrokeStyle;
}
GraphK.prototype.setPadding = function(tpadding, rpadding, bpadding, lpadding){
	this.tpadding = tpadding;
	this.rpadding = rpadding;
	this.bpadding = bpadding;
	this.lpadding = lpadding;
}

GraphK.prototype.setMargin = function(tmargin, rmargin, bmargin, lmargin){
	this.tmargin = tmargin;
	this.rmargin = rmargin;
	this.bmargin = bmargin;
	this.lmargin = lmargin;
}