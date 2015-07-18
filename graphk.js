//그래프
GraphK.prototype 			= new Object();
GraphK.prototype.name		= "RectK";
GraphK.prototype.canvas 	= undefined;
GraphK.prototype.context	= undefined;

GraphK.prototype.endCanvas 	= undefined;  //마지막 차트그려진후 마지막상태.
GraphK.prototype.initData 	= undefined;  //초기 셋팅값  
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
GraphK.prototype.chartAxisXGuideSize	= 5; //수치눈꿈 사이즈
GraphK.prototype.chartAxisYCount 		= 15;
GraphK.prototype.chartAxisYGuideSize 	= 5;
GraphK.prototype.chartAxisXVisible 		= true;
GraphK.prototype.chartAxisYVisible 		= true;
GraphK.prototype.chartAxisXDataMinMarginPercent 	= 5;	
GraphK.prototype.chartAxisXDataMaxMarginPercent 	= 20;	
GraphK.prototype.chartAxisYDataMinMarginPercent 	= 5;	
GraphK.prototype.chartAxisYDataMaxMarginPercent 	= 20;	
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

GraphK.prototype.tChartPadding 	= 30;
GraphK.prototype.rChartPadding 	= 30;
GraphK.prototype.bChartPadding 	= 30;
GraphK.prototype.lChartPadding 	= 30;


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
//	var originCanvas = GraphKUtil.copyCanvas(this.canvas);
//	var context = this.context;
	var useThis = this;
	this.canvas.addEventListener("mousemove", function(event) {
	    event.preventDefault();
        var rect = event.target.getBoundingClientRect();
        var point = new PointK(event.clientX - rect.left ,event.clientY - rect.top);
//        console.log(point.x+"    "+point.y);
        useThis.context.clearRect(0,0,useThis.endCanvas.width, useThis.endCanvas.height);
        useThis.context.drawImage(useThis.endCanvas, 0, 0);
        
        useThis.context.fillStyle			= "#000000";
        useThis.context.beginPath(); 
        useThis.context.moveTo(point.x, 0);
        useThis.context.lineTo(point.x, useThis.endCanvas.height);
        useThis.context.moveTo(0, point.y);
        useThis.context.lineTo(useThis.endCanvas.width, point.y);
        useThis.context.stroke(); 
        useThis.context.fillText(point.x+"    "+point.y, point.x, point.y);
	  }, false);
}
GraphK.prototype.onDrag = function(){
	var useThis = this;
	var dragStartPoint	= undefined; // canvas의 절대좌표
	var dragEndPoint	= undefined;
	
	var dragChartDataStartPoint 	= undefined;	//ChartData 그래프데이터 그리는곳부터 상대좌표
	var dragChartDataEndPoint 		= undefined;
	
	var handleMouseEvent = function(event){
		//console.log("---"+event.type);
		var rect = event.target.getBoundingClientRect();
		var point = new PointK(event.clientX - rect.left ,event.clientY - rect.top);
		var chartDataPoint = new PointK(point.x - useThis.chartDataRect.getStartX(), point.y - useThis.chartDataRect.getStartY());
		
		
		if(event.type=="mousedown"){
			if(useThis.chartRect.isHit(point.x, point.y)){
				dragStartPoint = point;
				dragChartDataStartPoint =  chartDataPoint;
			}
		}else if(event.type=="mousemove"){
			if(useThis.chartRect.isHit(point.x, point.y) && dragStartPoint){
//				console.log("mousemove"+point.x+",    "+point.y+"     "+dragStartPoint);
				
				if(dragEndPoint){//우선지워라.
					useThis.context.clearRect(0,0,useThis.endCanvas.width, useThis.endCanvas.height);
			        useThis.context.drawImage(useThis.endCanvas, 0, 0);
				}
				dragEndPoint = point;
				dragChartDataEndPoint = chartDataPoint;
				
				useThis.context.fillStyle = "rgba(200, 200, 200, 0.3)";
				useThis.context.fillRect(dragStartPoint.x, dragStartPoint.y, point.x - dragStartPoint.x, point.y - dragStartPoint.y );
				useThis.context.fillStyle			= "#000000";
				var atStartData 	= useThis.getDrawChartData(dragChartDataStartPoint, useThis.data);
				var atEndData 		= useThis.getDrawChartData(dragChartDataEndPoint, useThis.data);
				useThis.context.fillText(atStartData.y+",  "+atStartData.x, dragStartPoint.x, dragStartPoint.y);
				useThis.context.fillText(atEndData.y+",  "+atEndData.x, dragEndPoint.x, dragEndPoint.y);
			}
		}else if(event.type=="mouseup"){
//			console.log("mouseup "+dragStartPoint);
			useThis.context.clearRect(0,0,useThis.endCanvas.width, useThis.endCanvas.height);
			useThis.context.drawImage(useThis.endCanvas, 0, 0);
			if(dragStartPoint && dragEndPoint && dragChartDataStartPoint && dragChartDataEndPoint){
				var atStartData 	= useThis.getDrawChartData(dragChartDataStartPoint, useThis.data);
				var atEndData 		= useThis.getDrawChartData(dragChartDataEndPoint, useThis.data);
				console.log(atStartData.x+"   "+atStartData.y+"   "+atEndData.x+","+atEndData.y);
				var graphDataKSet = useThis.data.getBetweenData(atStartData, atEndData);
//				console.log(graphDataKSet.length);
				if(graphDataKSet.length>0){
					useThis.setData(graphDataKSet); //다시그리기.
				}else{
					useThis.setData(useThis.initData); //다시그리기.
				}
				useThis.rendering();
			}
			dragStartPoint 			= undefined;
			dragChartDataStartPoint	= undefined;
			dragEndPoint 			= undefined;
			dragChartDataEndPoint 	= undefined;
		}else if(event.type=="mouseout"){
//			console.log("mouseout "+dragStartPoint);
		}else if(event.type=="mouseover"){
//			console.log("mouseover "+dragStartPoint);
		}
		
	}
	this.canvas.addEventListener("mousedown", handleMouseEvent, false);
	this.canvas.addEventListener("mousemove", handleMouseEvent, false);
	this.canvas.addEventListener("mouseup",   handleMouseEvent, false);
	this.canvas.addEventListener("mouseout",  handleMouseEvent, false);
	this.canvas.addEventListener("mouseover", handleMouseEvent, false);
}


GraphK.prototype.rendering = function(){
	this.context = this.canvas.getContext("2d");
	this.context.clearRect(0, 0, this.context.width, this.context.height);
	this.context.lineWidth 		= 1;
	this.context.textAlign		= "center";
	this.context.textBaseline 	= "middle";
	//container
	this.containerRect = new RectK(0, 0, this.canvas.width, this.canvas.height);
	this.containerRect.strokeRect(this.context);
	
	//content  margin set     (t,r,b,l)
	this.contentRect = this.containerRect.getPadding(this.tmargin, this.rmargin, this.bmargin, this.lmargin);
	this.contentRect.fillRect(this.context, this.contentFillStyle);
	this.contentRect.strokeRect(this.context, this.contentStrokeStyle);
	
	
	//chart padding set  (t,r,b,l)
	this.chartRect = this.contentRect.getPadding(this.tpadding, this.rpadding, this.bpadding, this.lpadding);
	this.chartRect.fillRect(this.context, this.chartFillStyle);
	this.chartRect.strokeRect(this.context, this.chartStrokeStyle);
	
	this.chartDataRect = this.chartRect.getPadding(this.tChartPadding, this.rChartPadding, this.bChartPadding, this.lChartPadding);
	this.chartDataRect.strokeRect(this.context, this.chartStrokeStyle);
	//console.log("---"+this.chartRect.width+"  "+this.chartDataRect.width);
	//title draw
    var metrix = this.context.measureText(this.contentTitle);
    var line_width  = metrix.width;
    this.context.textBaseline = "bottom";
    this.context.fillText(this.contentTitle, this.contentRect.getCentX(), this.contentRect.getStartY());
    //context.fillText(this.contentTitle, contentRect.getCentX()-(line_width/2), this.tmargin);
	//
	
	
	
	/////////chart  draw
    this.drawChartCosssGrid();
    this.drawChartData(this.data);
    this.drawChartAxisGuide(this.data);
	//-----
	this.endCanvas = GraphKUtil.copyCanvas(this.canvas);
	
	if(!this.initData){
		this.initData = this.data;
	}
};


GraphK.prototype.drawChartData = function(graphDataKSet){
	this.context.textAlign		="center";
	//this.context.textBaseline 	= "middle";
	this.context.textBaseline 	= "buttom";
	
	//chart grid Data
	for ( var i = 0; i < graphDataKSet.length; i++) {//GraphDataKSet :  [GraphDataK,.....]
		var atGraphKData = graphDataKSet[i]; // GraphKData

		//draw...
		if(atGraphKData.type=="line"){
			this.drawChartLineData(atGraphKData);
		}else if(atGraphKData.type=="dot"){
			this.drawChartDotData(atGraphKData);
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
GraphK.prototype.drawChartDotData = function(graphKData){//GraphDataK
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
	this.context.beginPath(); 
	
	var pointArray = this.getDrawChartPoints(graphKData);
	for ( var i = 0; i < pointArray.length; i++) {
		var atPoint = pointArray[i];
		var widthH  = (graphKData.width/2);
		
		var startX 	= atPoint.x - widthH;
		var startY 	= atPoint.y;
		this.context.fillRect(startX, startY, graphKData.width,  graphKData.width );
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
		var atData 	= dataArray[i];	//Object   ex: {x:1,y:1}
		var point 	= this.getDrawChartPoint(new PointK(atData[graphKData.xVarName], atData[graphKData.yVarName]),
				this.data.getDataXMin(), this.data.getDataXMax(),
				this.data.getDataYMin(), this.data.getDataYMax()
				);
		point.value=atData[graphKData.yVarName]+", "+atData[graphKData.xVarName];
		pointArray.push(point);
	}
	return pointArray;
}

//PointK, GraphDataKSet
//차트데이터 데이터값을주면  상대좌표를 픽셀을 돌려준다.
GraphK.prototype.getDrawChartPoint = function(point, xMin, xMax, yMin, yMax){
	
	var yData_BetweenLength 	= GraphKUtil.getBetweenLength(yMin, yMax); 
	var xData_BetweenLength		= GraphKUtil.getBetweenLength(xMin, xMax);
	
	var yMinMargin = GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMinMarginPercent);
	var yMaxMargin = GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMaxMarginPercent);
	var xMinMargin = GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMinMarginPercent);
	var xMaxMargin = GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMaxMarginPercent);
//	console.log(yData_BetweenLength+" "+yMinMargin+" "+yMaxMargin+" "+"  // "+xData_BetweenLength+"   "+xMinMargin+" "+xMaxMargin);
//	//datamargin
//	yMin -= yMinMargin;
//	yMax += yMaxMargin;
//	xMin -= xMinMargin;
//	xMax += xMaxMargin;
//	yData_BetweenLength 	= GraphKUtil.getBetweenLength(yMin, yMax);  
//	xData_BetweenLength		= GraphKUtil.getBetweenLength(xMin, xMax);  
	//
	
	var yAtData_BetweenLength 	= GraphKUtil.getBetweenLength(yMin, point.y); //ex) 10(원하는거) - 7(민) = 3(차)
	var xAtData_BetweenLength	= GraphKUtil.getBetweenLength(xMin, point.x);			
	
	var yDataPercent			= GraphKUtil.getPercentByTot(yData_BetweenLength, yAtData_BetweenLength); // 전체차에서  원하는값의차는 몇%인가
	var xDataPercent			= GraphKUtil.getPercentByTot(xData_BetweenLength, xAtData_BetweenLength);	
//	console.log(graphDataKSet.getDataYBetweenLength()+"   "+point.y+"  "+yDataPercent+"  //  "+graphDataKSet.getDataXBetweenLength()+"   "+point.x+"  "+xDataPercent);
	var yPoint					= GraphKUtil.getValueByTotInPercent(this.chartDataRect.height, yDataPercent);//전체값의 몇 퍼센트는 얼마? 계산법 공식 ;  전체값 X 퍼센트 ÷ 100
	var xPoint					= GraphKUtil.getValueByTotInPercent(this.chartDataRect.width,  xDataPercent);
//	console.log(this.chartDataRect.height+"    "+yDataPercent+"  "+yPoint+"  //  "+this.chartDataRect.width+"    "+xDataPercent+"  "+xPoint);
	var ySet					= this.chartDataRect.getEndY()   - yPoint;
	var xSet					= this.chartDataRect.getStartX() + xPoint;
	return new PointK(xSet.toFixed(2), ySet.toFixed(2));
}
//PointK, GraphDataKSet
//차트데이터 안쪽에서의 상대좌표를 픽셀을주면  이에따른   데이터 값을 돌려준다.
GraphK.prototype.getDrawChartData = function(point, graphDataKSet){
	var yData_BetweenLength 	= graphDataKSet.getDataYBetweenLength(); 
	var xData_BetweenLength		= graphDataKSet.getDataXBetweenLength();
	var yMinMargin = GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMinMarginPercent);
	var yMaxMargin = GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMaxMarginPercent);
	var xMinMargin = GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMinMarginPercent);
	var xMaxMargin = GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMaxMarginPercent);
	
	var yMin = graphDataKSet.getDataYMin();
	var yMax = graphDataKSet.getDataYMax();
	var xMin = graphDataKSet.getDataXMin();
	var xMax = graphDataKSet.getDataXMax();
	
	//datamargin
//	var yMin = yMin - yMinMargin;
//	var yMax = yMax + yMaxMargin;
//	var xMin = xMin - xMinMargin;
//	var xMax = xMax + xMaxMargin;
//	
//	yData_BetweenLength = GraphKUtil.getBetweenLength(yMin, yMax);//yMinMargin; 
//	xData_BetweenLength = GraphKUtil.getBetweenLength(xMin, xMax);//xMinMargin; 
	////////
	
	
	
	var yPointPercent	= GraphKUtil.getPercentByTot(this.chartDataRect.height, point.y); // 전체차에서  원하는값의차는 몇%인가
	var xPointPercent	= GraphKUtil.getPercentByTot(this.chartDataRect.width,  point.x);	
	
	var yData			= GraphKUtil.getValueByTotInPercent(yData_BetweenLength, yPointPercent);//전체값의 몇 퍼센트는 얼마? 계산법 공식 ;  전체값 X 퍼센트 ÷ 100
	var xData			= GraphKUtil.getValueByTotInPercent(xData_BetweenLength, xPointPercent);

	var ySet			= yMax - yData;
	var xSet			= xMin + xData;
	
	return new PointK(xSet.toFixed(2), ySet.toFixed(2));
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
		this.context.fillText(xMin, this.chartDataRect.getStartX(), this.chartRect.getEndY());
	if(this.chartAxisXMaxVisible)
		this.context.fillText(xMax, this.chartRect.getEndX(), this.chartRect.getEndY());
	
	this.context.beginPath();
	this.context.strokeStyle = this.chartStrokeStyle;
	for ( var i = 1; this.chartAxisXVisible && i <= this.chartAxisXCount; i++) {
		var setX = this.chartDataRect.getStartX()+(xGP*i);
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
		this.context.fillText(yMin, this.chartRect.getStartX(), this.chartDataRect.getEndY());
	if(this.chartAxisYMaxVisible)
		this.context.fillText(yMax, this.chartRect.getStartX(), this.chartRect.getStartY());
	for ( var i = 1; this.chartAxisYVisible && i <= this.chartAxisYCount; i++) {
		var setX = this.chartRect.getStartX();
		var setY = this.chartDataRect.getEndY()-(yGP*i);
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