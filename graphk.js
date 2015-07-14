//그래프
GraphK.prototype 			= new Object();
GraphK.prototype.name		= "RectK";
GraphK.prototype.canvas 	= undefined;
GraphK.prototype.context	= undefined;

//container > content > chart > item..

GraphK.prototype.contentFillStyle		= "#FFFFFF";
GraphK.prototype.contentStrokeStyle		= "#222222";
GraphK.prototype.contentTitle			= "TITLE";
GraphK.prototype.contentStrokeStyle		= "#222222";
GraphK.prototype.chartFillStyle			= "#FFFFFF";
GraphK.prototype.chartStrokeStyle 		= "#000000";
GraphK.prototype.chartCrossGrideVisible = true;
GraphK.prototype.chartCrossGrideXCount 	= 10;
GraphK.prototype.chartCrossGrideYCount 	= 10;
GraphK.prototype.chartAxisXCount 		= 15;
GraphK.prototype.chartAxisXGuideSize	= 3; //수치눈꿈 사이즈
GraphK.prototype.chartAxisYCount 		= 15;
GraphK.prototype.chartAxisYGuideSize 	= 3;
//GraphK.prototype.chartAxisXDataName 	= "x"; //GraphKData에 Data로들어갈 변수명
//GraphK.prototype.chartAxisYDataName 	= "y";
GraphK.prototype.chartAxisXMinVisible 	= true;
GraphK.prototype.chartAxisYMinVisible 	= true;
GraphK.prototype.chartAxisXMaxVisible 	= false;
GraphK.prototype.chartAxisYMaxVisible 	= false;
GraphK.prototype.chartAxisXVisible 		= true;
GraphK.prototype.chartAxisYVisible 		= true;
GraphK.prototype.chartCrossStrokeStyle 	= "#EEEEEE";


//container > content > chart > chartData
GraphK.prototype.containerRect			= undefined;	//그래프의 최상단 컨테이너 Rect
GraphK.prototype.contentRect			= undefined;	//그래프의 컨텐츠를 담는 Rect
GraphK.prototype.chartRect				= undefined;	//그래프의 차트를 담는 Rect
GraphK.prototype.chartDataRect			= undefined;	//실질적으로 그래프Data가 그려지는곳

GraphK.prototype.tpadding 	= 10;
GraphK.prototype.rpadding 	= 10;
GraphK.prototype.bpadding 	= 10;
GraphK.prototype.lpadding 	= 10;

GraphK.prototype.tmargin	= 10;
GraphK.prototype.rmargin	= 10;
GraphK.prototype.bmargin	= 10;
GraphK.prototype.lmargin	= 10;

GraphK.prototype.tChartPadding 	= 40;
GraphK.prototype.rChartPadding 	= 40;
GraphK.prototype.bChartPadding 	= 40;
GraphK.prototype.lChartPadding 	= 40;

GraphK.prototype.data;//	= new GraphDataKSet();  //extends Array     [GraphDataK,...]  데이타..
	
function GraphK(targetCanvas){
	if(Object.prototype.toString.call(targetCanvas)=='[object String]'){
		this.canvas = document.querySelector(targetCanvas);
	}else{
		this.canvas = targetCanvas;
	}
	this.data = new GraphDataKSet();
}
GraphK.prototype.onMouseTraking = function(){
	this.canvas.addEventListener("mousemove", function(event) {
	    event.preventDefault();
        var rect = event.target.getBoundingClientRect();
        var point = new PointK(event.clientX - rect.left ,event.clientY - rect.top);
        //console.log(point.x+"    "+point.y);
	  }, false);

}

GraphK.prototype.rendering = function(){
	this.context = this.canvas.getContext("2d");
	this.context.lineWidth 		= 1;
	this.context.textAlign		= "center";
	this.context.textBaseline 	= "middle";
	//container
	this.containerRect = new RectK(0, 0, this.canvas.width, this.canvas.height);
	this.containerRect.strokeRect(this.context);
	
	//content  margin set   //t,r,b,l
	this.contentRect = this.containerRect.getPadding(this.tmargin, this.rmargin, this.bmargin, this.lmargin);
	this.contentRect.fillRect(this.context, this.contentFillStyle);
	this.contentRect.strokeRect(this.context, this.contentStrokeStyle);
	
	
	//chart padding set  //t,r,b,l
	this.chartRect = this.contentRect.getPadding(this.tpadding, this.rpadding, this.bpadding, this.lpadding);
	this.chartRect.fillRect(this.context, this.chartFillStyle);
	this.chartRect.strokeRect(this.context, this.chartStrokeStyle);
	
	this.chartDataRect = this.chartRect.getPadding(this.tChartPadding, this.rChartPadding, this.bChartPadding, this.lChartPadding);
	//this.chartDataRect.strokeRect(this.context, this.chartStrokeStyle);
	//console.log("---"+this.chartRect.width+"  "+this.chartDataRect.width);
	//title draw
    var metrix = this.context.measureText(this.contentTitle);
    var line_width  = metrix.width;
    this.context.textBaseline = "bottom";
    this.context.fillText(this.contentTitle, this.contentRect.getCentX(), this.contentRect.getStartY());
    //context.fillText(this.contentTitle, contentRect.getCentX()-(line_width/2), this.tmargin);
	//
	
	
	
	/////////chart  cossGride
    this.drawChartCosssGrid();
    this.drawChartData();
    this.drawChartAxisGuide();
	//-----
	
};

GraphK.prototype.drawChartData = function(){

	this.context.textAlign		="center";
	//this.context.textBaseline 	= "middle";
	this.context.textBaseline 	= "buttom";
	
	//chart grid Data
	for ( var i = 0; i < this.data.length; i++) {//GraphDataKSet :  [GraphDataK,.....]
		var atGraphKData = this.data[i]; // GraphKData

		//draw...
		if(atGraphKData.type=="line"){
			this.drawChartLineData(atGraphKData);
		}else if(atGraphKData.type=="stick"){
			this.drawChartStickData(atGraphKData);
		}else{
		}
		
	}
} 
GraphK.prototype.drawChartLineData = function(graphKData){//GraphDataK
	
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
	this.context.beginPath(); 
	
	var pointArray = this.getDrawChartPoints(graphKData);
	for ( var i = 0; i < pointArray.length; i++) {
		var atPoint = pointArray[i];
		if(i==0){
			this.context.moveTo(atPoint.x, atPoint.y);
		}else{
			this.context.lineTo(atPoint.x, atPoint.y);
		}
		this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
	}
	this.context.stroke(); 
} 
GraphK.prototype.drawChartStickData = function(graphKData){ //GraphDataK
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
	this.context.beginPath(); 
	
	var pointArray = this.getDrawChartPoints(graphKData);
	for ( var i = 0; i < pointArray.length; i++) {
		var atPoint = pointArray[i];
		var widthH  = (graphKData.width/2);
		
		var startX 	= atPoint.x - widthH;
		var startY 	= atPoint.y;
		this.context.fillRect(startX, startY, graphKData.width, this.chartRect.getEndY()-startY );
		this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
	}
	this.context.stroke(); 
}
GraphK.prototype.getDrawChartPoints = function(graphKData){
	var dataArray = graphKData.data;  //[Object,....]
	var pointArray = new Array();
	for ( var i = 0; i < dataArray.length; i++) {
		var atData 		= dataArray[i];	//Object   ex: {x:1,y:1}
		var yData 		= atData[graphKData.yVarName];
		var yWantChar 	= yData - this.data.getDataYMin(); 				//ex) 10(원하는거) - 7(민) = 3(차)
		var yWantP		= (yWantChar / (this.data.getDataYMax()-this.data.getDataYMin()) ) * 100;//13(전체차) 3(차) 몇%   23.076 % //전체값에서 일부값은 몇 퍼센트? 계산법 공식		일부값 ÷ 전체값 X 100
		
		var xData 		= atData[graphKData.xVarName];
		var xWantChar 	= xData - this.data.getDataXMin(); 			
		var xWantP		= (xWantChar / (this.data.getDataXMax()-this.data.getDataXMin()) ) * 100;	
		
		var yWant		= (this.chartDataRect.height * yWantP) / 100;//전체값의 몇 퍼센트는 얼마? 계산법 공식 ;  전체값 X 퍼센트 ÷ 100
		var xWant		= (this.chartDataRect.width  * xWantP) / 100;
		var ySet		= this.chartDataRect.getEndY()   - yWant;	//아래서부터Y 빼면서 그리기때문에..
		var xSet		= this.chartDataRect.getStartX() + xWant; //처음부터X 더하면서 그리기때문에..
		
		pointArray.push(new PointK(xSet,ySet, yData+", "+xData));
//		if(i==0){
//			this.context.moveTo(xSet, ySet);
//		}else{
//			this.context.lineTo(xSet, ySet);
//			this.context.fillText(xData+","+yData, xSet, ySet);
//		}
//		console.log("-------");
//		console.log(xData+",   "+xWantChar+",  "+xWantP+"      "+this.chartDataRect.width);
//		console.log(yData+",   "+yWantChar+",  "+yWantP+"      "+this.chartDataRect.height);
//		console.log("-------");
	}
	return pointArray;
}




//Chart에 격자무늬그려라..
GraphK.prototype.drawChartCosssGrid = function(){
	var xcrossCharP 		= this.chartRect.width / this.chartCrossGrideXCount;
	var ycrossCharP 		= this.chartRect.height / this.chartCrossGrideYCount;
	
	this.context.strokeStyle= this.chartCrossStrokeStyle;	
	this.context.beginPath(); 
	for ( var i = 1; this.chartCrossGrideVisible && i < this.chartCrossGrideXCount; i++) {
		this.context.moveTo(this.chartRect.getStartX()+(xcrossCharP*i), this.chartRect.getStartY()); 
		this.context.lineTo(this.chartRect.getStartY()+(xcrossCharP*i), this.chartRect.getEndY()); 
	}
	for ( var i = 1; this.chartCrossGrideVisible && i < this.chartCrossGrideYCount; i++) {
		this.context.moveTo(this.chartRect.getStartX(), this.chartRect.getStartY()+(ycrossCharP*i)); 
		this.context.lineTo(this.chartRect.getEndX(), this.chartRect.getStartY()+(ycrossCharP*i)); 
	}
	this.context.stroke(); 
}

GraphK.prototype.drawChartAxisGuide = function(){
	this.context.strokeStyle	= this.chartStrokeStyle;
	this.context.fillStyle		= this.chartStrokeStyle; //스타일있으면 그걸로셋팅.
	//data Gride
	var xMin	= this.data.getDataXMin(); 
	var xMax	= this.data.getDataXMax();
	var xChar	= (xMax - xMin);
	var xP		= xChar / this.chartAxisXCount;
	var xGP		= this.chartDataRect.width / this.chartAxisXCount;  
	var yMin	= this.data.getDataYMin();
	var yMax	= this.data.getDataYMax();
	var yChar	= (yMax - yMin);
	var yP		= yChar / this.chartAxisYCount;
	var yGP		= this.chartDataRect.height / this.chartAxisYCount;
	//console.log(xMin+", "+xMax+", "+xP+", "+xGP);
	//console.log(yMin+", "+yMax+", "+yP+", "+yGP);
	//>> X
	this.context.textAlign		= "left";
	this.context.textBaseline	= "top";
	if(this.chartAxisXMinVisible)
		this.context.fillText(xMin, this.chartRect.getStartX()+this.lChartPadding, this.chartRect.getEndY());
	if(this.chartAxisXMaxVisible)
		this.context.fillText(xMax, this.chartRect.getEndX(), this.chartRect.getEndY());
	
	this.context.beginPath();
	this.context.strokeStyle = this.chartStrokeStyle;
	for ( var i = 1; this.chartAxisXVisible && i <= this.chartAxisXCount; i++) {
		var setX = this.chartRect.getStartX()+(xGP*i)+this.lChartPadding;
		var setY = this.chartRect.getEndY();
		this.context.fillText((xMin+(xP*i)).toFixed(1), setX, setY);  //chart padding값..추가
		//눈꿈그리기
		this.context.moveTo(setX, setY); 
		this.context.lineTo(setX, setY-this.chartAxisXGuideSize); 
	}
	//>> Y
	this.context.textAlign		= "end";
	this.context.textBaseline	= "bottom";
	if(this.chartAxisYMinVisible)
		this.context.fillText(yMin, this.chartRect.getStartX(), this.chartRect.getEndY() - this.bChartPadding);
	if(this.chartAxisYMaxVisible)
		this.context.fillText(yMax, this.chartRect.getStartX(), this.chartRect.getStartY());
	for ( var i = 1; this.chartAxisYVisible && i <= this.chartAxisYCount; i++) {
		var setX = this.chartRect.getStartX();
		var setY = this.chartRect.getEndY()-(yGP*i) - this.bChartPadding;
		this.context.fillText((yMin+(yP*i)).toFixed(1),setX , setY);  //chart padding값..추가
		//눈꿈그리기
		this.context.moveTo(setX, setY); 
		this.context.lineTo(setX+this.chartAxisYGuideSize, setY); 
	}
	this.context.stroke(); 
	//-------------
}




GraphK.prototype.addData = function(data){
	this.data.push(data);
}
GraphK.prototype.setData = function(data){
	this.data = data;
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