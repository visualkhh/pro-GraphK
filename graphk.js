//그래프
GraphK.prototype 			= new Object();
GraphK.prototype.name		= "RectK";
GraphK.prototype.canvas 	= undefined;
GraphK.prototype.context	= undefined;

GraphK.prototype.endCanvas 	= undefined;  //마지막 차트그려진후 마지막상태.
//container > content > chart > item..

GraphK.prototype.contentFillStyle		= "#FFFFFF";
GraphK.prototype.contentStrokeStyle		= "#222222";
GraphK.prototype.contentTitle			= "TITLE";
GraphK.prototype.contentStrokeStyle		= "#222222";
GraphK.prototype.chartFillStyle			= "#FFFFFF";
GraphK.prototype.chartStrokeStyle 		= "#000000";
GraphK.prototype.chartContainerRectVisible = false;
GraphK.prototype.chartMarginRectVisible = false;
GraphK.prototype.chartPaddingRectVisible= false;
GraphK.prototype.chartCrossGrideVisible = true;
GraphK.prototype.chartCrossGrideXCount 	= 10;
GraphK.prototype.chartCrossGrideYCount 	= 10;
GraphK.prototype.chartAxisXCount 		= 15;
GraphK.prototype.chartAxisXGuideSize	= 5; //수치눈꿈 사이즈
GraphK.prototype.chartAxisYCount 		= 15;
GraphK.prototype.chartAxisYGuideSize 	= 5;
GraphK.prototype.chartAxisXVisible 		= true;
GraphK.prototype.chartAxisYVisible 		= true;
GraphK.prototype.chartAxisScaleVisible 	= true; //아래쪽에 보이는 스케일 표식 보일거냐?
GraphK.prototype.chartAxisXFnc 			= function(data){return data;}; //화면에 값뿌려줄때 어떻게 뿌려줄꺼냐
GraphK.prototype.chartAxisYFnc 			= function(data){return data;};
GraphK.prototype.chartDataVisible 		= true; //차트에 값표시할꺼냐
GraphK.prototype.chartAxisXDataMin      = undefined; //셋팅되지않으면 데이터값의 min max값으로처리	
GraphK.prototype.chartAxisXDataMax      = undefined;	
GraphK.prototype.chartAxisYDataMin      = undefined;	
GraphK.prototype.chartAxisYDataMax      = undefined;	
GraphK.prototype.chartAxisXDataMinMarginPercent 	= 10;	
GraphK.prototype.chartAxisXDataMaxMarginPercent 	= 10;	
GraphK.prototype.chartAxisYDataMinMarginPercent 	= 10;	
GraphK.prototype.chartAxisYDataMaxMarginPercent 	= 10;	
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

GraphK.prototype.tChartPadding 	= 10;
GraphK.prototype.rChartPadding 	= 10;
GraphK.prototype.bChartPadding 	= 10;
GraphK.prototype.lChartPadding 	= 10;

//transfer



GraphK.prototype.data;//	= new GraphDataKSet();  //extends Array     [GraphDataK,...]  데이타..
	
function GraphK(targetCanvas){
	if(Object.prototype.toString.call(targetCanvas)=='[object String]'){
		this.canvas = document.querySelector(targetCanvas);
	}else{
		this.canvas = targetCanvas;
	}
	this.data = new GraphDataKSet();
	
//	 if (window.addEventListener) {   // all browsers except IE before version 9
//		 this.canvas.addEventListener ("resize", this.rendering.call, false);
//     } 
//     else {
//         if (window.attachEvent) {    // IE before version 9
//        	 window.attachEvent ("onresize", this.rendering);
//         }
//     }
}
GraphK.prototype.onMouseTraking = function(){
	var useThis = this;
	this.canvas.addEventListener("mousemove", function(event) {
		var yMin = useThis.chartAxisYDataMin;
		var yMax = useThis.chartAxisYDataMax;
		var xMin = useThis.chartAxisXDataMin;
		var xMax = useThis.chartAxisXDataMax;
	    event.preventDefault();
        var rect = event.target.getBoundingClientRect();
        var point = new PointK(event.clientX - rect.left ,event.clientY - rect.top);
		var chartDataPoint = new PointK(point.x - useThis.chartDataRect.getStartX(), point.y - useThis.chartDataRect.getStartY());
		
        useThis.context.clearRect(0,0,useThis.endCanvas.width, useThis.endCanvas.height);
        useThis.context.drawImage(useThis.endCanvas, 0, 0);
        
        useThis.context.fillStyle			= "#000000";
        useThis.context.strokeStyle			= "#000000";
        useThis.context.beginPath(); 
        useThis.context.moveTo(point.x, 0);
        useThis.context.lineTo(point.x, useThis.endCanvas.height);
        useThis.context.moveTo(0, point.y);
        useThis.context.lineTo(useThis.endCanvas.width, point.y);
        useThis.context.stroke(); 
        var atDataPoint = useThis.getDrawChartData(chartDataPoint, xMin, xMax, yMin, yMax);
        useThis.context.textAlign		= "end";
        useThis.context.textBaseline 	= "bottom";
//        useThis.context.fillText(atDataPoint.y+",  "+atDataPoint.x+" ", point.x, point.y);
        useThis.context.fillText(useThis.chartAxisYFnc(atDataPoint.y)+",  "+useThis.chartAxisXFnc(atDataPoint.x)+" ", point.x, point.y);
        useThis.context.textAlign		= "left";
        useThis.context.textBaseline 	= "top";
        useThis.context.fillText("     "+point.y+",  "+point.x, point.x, point.y);
	  }, false);
}
GraphK.prototype.setYLine = function(yVal){
	var useThis = this;
	useThis.context.clearRect(0,0,useThis.endCanvas.width, useThis.endCanvas.height);
	useThis.context.drawImage(useThis.endCanvas, 0, 0);
	var yMin = useThis.chartAxisYDataMin;
	var yMax = useThis.chartAxisYDataMax;
	var xMin = useThis.chartAxisXDataMin;
	var xMax = useThis.chartAxisXDataMax;
	var point = new PointK(xMin, yVal);
	//GraphK.prototype.getDrawChartPoint = function(point, xMin, xMax, yMin, yMax){
	var pxPoint = this.getDrawChartPoint(point, xMin, xMax, yMin, yMax)
	useThis.context.fillStyle			= "#000000";
	useThis.context.strokeStyle			= "#000000";
	useThis.context.beginPath(); 
	useThis.context.moveTo(0, pxPoint.y);
	useThis.context.lineTo(useThis.endCanvas.width, pxPoint.y);
	useThis.context.stroke(); 
}
GraphK.prototype.setXLine = function(xVal){
	var useThis = this;
	useThis.context.clearRect(0,0,useThis.endCanvas.width, useThis.endCanvas.height);
	useThis.context.drawImage(useThis.endCanvas, 0, 0);
	var yMin = useThis.chartAxisYDataMin;
	var yMax = useThis.chartAxisYDataMax;
	var xMin = useThis.chartAxisXDataMin;
	var xMax = useThis.chartAxisXDataMax;
	var point = new PointK(xVal, yMin);
	//GraphK.prototype.getDrawChartPoint = function(point, xMin, xMax, yMin, yMax){
	var pxPoint = this.getDrawChartPoint(point, xMin, xMax, yMin, yMax)
    useThis.context.fillStyle			= "#000000";
    useThis.context.strokeStyle			= "#000000";
    useThis.context.beginPath(); 
    useThis.context.moveTo(pxPoint.x, 0);
    useThis.context.lineTo(pxPoint.x, useThis.endCanvas.height);
	useThis.context.stroke(); 
}
GraphK.prototype.setXLines = function(xValArr){
	var useThis = this;
	useThis.context.clearRect(0,0,useThis.endCanvas.width, useThis.endCanvas.height);
	useThis.context.drawImage(useThis.endCanvas, 0, 0);
	var yMin = useThis.chartAxisYDataMin;
	var yMax = useThis.chartAxisYDataMax;
	var xMin = useThis.chartAxisXDataMin;
	var xMax = useThis.chartAxisXDataMax;
	
	for (var i = 0; i < xValArr.length; i++) {
		var xVal = xValArr[i]
		var point = new PointK(xVal, yMin);
		//GraphK.prototype.getDrawChartPoint = function(point, xMin, xMax, yMin, yMax){
		var pxPoint = this.getDrawChartPoint(point, xMin, xMax, yMin, yMax)
		useThis.context.fillStyle			= "#000000";
		useThis.context.strokeStyle			= "#000000";
		useThis.context.beginPath(); 
		useThis.context.moveTo(pxPoint.x, 0);
		useThis.context.lineTo(pxPoint.x, useThis.endCanvas.height);
		useThis.context.stroke(); 
	}
	
	
}
GraphK.prototype.onDrag = function(){
	var useThis = this;
	var dragStartPoint	= undefined; // canvas의 절대좌표
	var dragEndPoint	= undefined;
	
	var dragChartDataStartPoint 	= undefined;	//ChartData 그래프데이터 그리는곳부터 상대좌표
	var dragChartDataEndPoint 		= undefined;
	
	
	var handleMouseEvent = function(event){
		var yMin = useThis.chartAxisYDataMin;
		var yMax = useThis.chartAxisYDataMax;
		var xMin = useThis.chartAxisXDataMin;
		var xMax = useThis.chartAxisXDataMax;
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
				if(dragEndPoint){//우선지워라.
					useThis.context.clearRect(0,0,useThis.endCanvas.width, useThis.endCanvas.height);
			        useThis.context.drawImage(useThis.endCanvas, 0, 0);
				}
				dragEndPoint = point;
				dragChartDataEndPoint = chartDataPoint;
				
				useThis.context.fillStyle = "rgba(200, 200, 200, 0.3)";
				useThis.context.fillRect(dragStartPoint.x, dragStartPoint.y, point.x - dragStartPoint.x, point.y - dragStartPoint.y );
				useThis.context.fillStyle			= "#000000";
				var atStartData 	= useThis.getDrawChartData(dragChartDataStartPoint, xMin, xMax, yMin, yMax);
				var atEndData 		= useThis.getDrawChartData(dragChartDataEndPoint, xMin, xMax, yMin, yMax);
//				useThis.context.fillText(atStartData.y+",  "+atStartData.x, dragStartPoint.x, dragStartPoint.y);
//				useThis.context.fillText("    "+atEndData.y+",  "+atEndData.x, dragEndPoint.x, dragEndPoint.y);
				useThis.context.fillText(useThis.chartAxisYFnc(atStartData.y)+",  "+useThis.chartAxisXFnc(atStartData.x), dragStartPoint.x, dragStartPoint.y);
				useThis.context.fillText("    "+useThis.chartAxisYFnc(atEndData.y)+",  "+useThis.chartAxisXFnc(atEndData.x), dragEndPoint.x, dragEndPoint.y);
			}
		}else if(event.type=="mouseup"){
			useThis.context.clearRect(0,0,useThis.endCanvas.width, useThis.endCanvas.height);
			useThis.context.drawImage(useThis.endCanvas, 0, 0);
			if(dragStartPoint && dragEndPoint && dragChartDataStartPoint && dragChartDataEndPoint){
				var dragChartDataBetweenStartPoint = new PointK(Math.min(dragChartDataStartPoint.x, dragChartDataEndPoint.x), Math.min(dragChartDataStartPoint.y, dragChartDataEndPoint.y));
				var dragChartDataBetweenEndPoint   = new PointK(Math.max(dragChartDataStartPoint.x, dragChartDataEndPoint.x), Math.max(dragChartDataStartPoint.y, dragChartDataEndPoint.y));
				var atStartData 	= useThis.getDrawChartData(dragChartDataBetweenStartPoint, xMin, xMax, yMin, yMax);
				var atEndData 		= useThis.getDrawChartData(dragChartDataBetweenEndPoint, xMin, xMax, yMin, yMax);
				var graphDataKSet = useThis.data.getBetweenData(atStartData, atEndData);
				if(graphDataKSet.length>0){
					useThis.chartAxisYDataMin = Number(atEndData.y);
					useThis.chartAxisYDataMax = Number(atStartData.y);
					useThis.chartAxisXDataMin = Number(atStartData.x);
					useThis.chartAxisXDataMax = Number(atEndData.x);
				}else{
					useThis.chartAxisYDataMin = undefined;
					useThis.chartAxisYDataMax = undefined;
					useThis.chartAxisXDataMin = undefined;
					useThis.chartAxisXDataMax = undefined;
				}

				useThis.rendering();
			}
			dragStartPoint 			= undefined;
			dragChartDataStartPoint	= undefined;
			dragEndPoint 			= undefined;
			dragChartDataEndPoint 	= undefined;
		}else if(event.type=="mouseout"){
		}else if(event.type=="mouseover"){
		}
		
	}
	this.canvas.addEventListener("mousedown", handleMouseEvent, false);
	this.canvas.addEventListener("mousemove", handleMouseEvent, false);
	this.canvas.addEventListener("mouseup",   handleMouseEvent, false);
	this.canvas.addEventListener("mouseout",  handleMouseEvent, false);
	this.canvas.addEventListener("mouseover", handleMouseEvent, false);
}

GraphK.prototype.rendering = function(){
	this.endCanvas = GraphKUtil.copyCanvas(this.canvas);
	this.canvas.height = this.canvas.clientHeight;
	this.canvas.width = this.canvas.clientWidth;
	this.endCanvas.height = this.endCanvas.clientHeight;
	this.endCanvas.width = this.endCanvas.clientWidth;
	
	this.context = this.canvas.getContext("2d");
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.clearRect(0, 0, this.context.width, this.context.height);
	this.context.lineWidth 		= 1;
	this.context.textAlign		= "center";
	this.context.textBaseline 	= "middle";
	

	
	
	
	//container
	this.containerRect = new RectK(0, 0, this.canvas.width, this.canvas.height);
	if(this.chartContainerRectVisible)
	this.containerRect.strokeRect(this.context);

	
	//content  margin set     (t,r,b,l)
	this.contentRect = this.containerRect.getPadding(this.tmargin, this.rmargin, this.bmargin, this.lmargin);
	this.contentRect.fillRect(this.context, this.contentFillStyle);
	if(this.chartMarginRectVisible)
	this.contentRect.strokeRect(this.context, this.contentStrokeStyle);
	
	
	//chart padding set  (t,r,b,l)
	this.chartRect = this.contentRect.getPadding(this.tpadding, this.rpadding, this.bpadding, this.lpadding);
	this.chartRect.fillRect(this.context, this.chartFillStyle);
	if(this.chartPaddingRectVisible)
	this.chartRect.strokeRect(this.context, this.chartStrokeStyle);
	
	this.chartDataRect = this.chartRect.getPadding(this.tChartPadding, this.rChartPadding, this.bChartPadding, this.lChartPadding);
//	this.chartDataRect.strokeRect(this.context, this.chartStrokeStyle);
	
	//title draw
    var metrix = this.context.measureText(this.contentTitle);
    var line_width  = metrix.width;
    this.context.textBaseline = "bottom";
    this.context.fillText(this.contentTitle, this.contentRect.getCentX(), this.contentRect.getStartY());
    //context.fillText(this.contentTitle, contentRect.getCentX()-(line_width/2), this.tmargin);
	//
	
	
    this.chartAxisXDataMin = (this.chartAxisXDataMin==undefined ? this.data.getDataXMin() : this.chartAxisXDataMin); 
    this.chartAxisYDataMin = (this.chartAxisYDataMin==undefined ? this.data.getDataYMin() : this.chartAxisYDataMin); 
    this.chartAxisXDataMax = (this.chartAxisXDataMax==undefined ? this.data.getDataXMax() : this.chartAxisXDataMax); 
    this.chartAxisYDataMax = (this.chartAxisYDataMax==undefined ? this.data.getDataYMax() : this.chartAxisYDataMax); 
	

	/////////chart  draw
    this.drawChartCosssGrid();
    this.drawChartData(this.data);
    this.drawChartAxisGuide(this.data);
    
    
	
	this.endCanvas = GraphKUtil.copyCanvas(this.canvas);
//	this.endCanvas.width = this.canvas.width;
//	this.endCanvas.height = this.canvas.height;
	
};


GraphK.prototype.drawChartData = function(graphDataKSet){
	this.context.textAlign		= "center";
	this.context.textBaseline 	= "bottom";
	
	var w = this.canvas.width;
	var h = this.canvas.height;
	this.context.save();
	this.context.rect(this.chartRect.getStartX(), this.chartRect.getStartY(),this.chartRect.width,this.chartRect.height);
//	this.context.fillStyle = "#aa0000";  this.context.fill();
	// 그래프 부분을 클리핑 
	this.context.clip();

	//chart grid Data
	for ( var i = 0; i < graphDataKSet.length; i++) {//GraphDataKSet :  [GraphDataK,.....]
		var atGraphKData = graphDataKSet[i]; // GraphKData
		//draw...
		if(atGraphKData.type=="line"){
			this.drawChartLineData(atGraphKData);
		}else if(atGraphKData.type=="linefill"){
			this.drawChartLineFillData(atGraphKData);
		}else if(atGraphKData.type=="linegroup"){
			this.drawChartLineGroupData(atGraphKData);
		}else if(atGraphKData.type=="dot"){
			this.drawChartDotData(atGraphKData);
		}else if(atGraphKData.type=="arc"){
			this.drawChartArcData(atGraphKData);
		}else if(atGraphKData.type=="stick"){
			this.drawChartStickData(atGraphKData);
		}else if(Object.prototype.toString.call(atGraphKData.type)=='[object Function]'){
			this.drawChartCustomData(atGraphKData);
		}else{
		}
	}
	this.context.restore()
	
} 
GraphK.prototype.drawChartLineData = function(graphKData){//GraphDataK
	
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
	this.context.beginPath(); 
	
	var pointArray = this.getDrawChartPoints(graphKData);
	for ( var i = 0; i < pointArray.length; i++) {
		var atPoint = pointArray[i];
		if(i==0){ //처음
			this.context.moveTo(atPoint.x, atPoint.y);
		}else{
			this.context.lineTo(atPoint.x, atPoint.y);
		}
		
	      
		if(this.chartDataVisible)
			this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
	}
	//this.context.fillStyle = '#8ED6FF';
	//this.context.fill();
//	this.context.closePath();
	this.context.stroke(); 
}
GraphK.prototype.drawChartLineFillData = function(graphKData){//GraphDataK
	
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
	this.context.beginPath(); 
	
	var pointArray = this.getDrawChartPoints(graphKData);
	for ( var i = 0; i < pointArray.length; i++) {
		var atPoint = pointArray[i];
		if(i==0){ //처음
			//this.context.moveTo(atPoint.x, atPoint.y);
			this.context.moveTo(atPoint.x, this.canvas.height);
			this.context.lineTo(atPoint.x, atPoint.y);
		}else{
			this.context.lineTo(atPoint.x, atPoint.y);
		}
		
		if((i+1)==pointArray.length){
			this.context.lineTo(atPoint.x, this.canvas.height);
			
		}
	      
		if(this.chartDataVisible)
			this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
	}
	//this.context.fillStyle = '#8ED6FF';
	this.context.fill();
	this.context.closePath();
	this.context.stroke(); 
}
GraphK.prototype.drawChartLineGroupData = function(graphKData){//GraphDataK
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
	this.context.beginPath(); 
	var width = graphKData.width;
	var pointArray = this.getDrawChartPoints(graphKData);
	for ( var i = 0; i < pointArray.length; i++) {
		var atPoint = pointArray[i];
		if(i%width==0){
			this.context.moveTo(atPoint.x, atPoint.y);
		}
		if(i==0){ //처음
			this.context.moveTo(atPoint.x, atPoint.y);
		}else{
			this.context.lineTo(atPoint.x, atPoint.y);
		}
		
		var widthH  = 10/2;
		var startX 	= atPoint.x - widthH;
		var startY 	= atPoint.y - widthH;
		this.context.fillRect(startX, startY, widthH, widthH );
	      
		if(this.chartDataVisible)
			this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
	}
	//this.context.fillStyle = '#8ED6FF';
	//this.context.fill();
//	this.context.closePath();
	this.context.stroke(); 
}
GraphK.prototype.drawChartDotData = function(graphKData){//GraphDataK
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
	this.context.textAlign 		= "center";
	this.context.textBaseline 	= "middle";
	
	
	var pointArray = this.getDrawChartPoints(graphKData);
	for ( var i = 0; i < pointArray.length; i++) {
		this.context.beginPath(); 
		var atPoint = pointArray[i];
		//console.log('atPoint : x:'+atPoint.x+"   y:"+atPoint.y);
		var widthH  = (graphKData.width/2);
		
		var startX 	= atPoint.x - widthH;
		var startY 	= atPoint.y - widthH;
		this.context.fillRect(startX, startY, graphKData.width,  graphKData.width );
		this.context.fillStyle 		= "#000000"; 
		if(this.chartDataVisible)
			this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
		this.context.fillStyle 		= graphKData.strokeStyle; 
		this.context.stroke(); 
	}
}
GraphK.prototype.drawChartArcData = function(graphKData){//GraphDataK
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
	this.context.textAlign 		= "center";
	this.context.textBaseline 	= "middle";
	
	var pointArray = this.getDrawChartPoints(graphKData);
	for ( var i = 0; i < pointArray.length; i++) {
		this.context.beginPath(); 
		var atPoint = pointArray[i];
		var widthH  = (graphKData.width/2);
		this.context.arc(atPoint.x, atPoint.y, graphKData.width, 0, Math.PI * 2, true); 
		this.context.fill();
		this.context.fillStyle 		= "#000000"; 
		if(this.chartDataVisible)
			this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
		this.context.fillStyle 		= graphKData.strokeStyle; 
		this.context.stroke(); 
	}
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
		if(this.chartDataVisible)
			this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
	}
	this.context.stroke(); 
}

////PointK, GraphDataKSet
//차트데이터 데이터값을주면  상대좌표를 픽셀을 돌려준다.  복합.
GraphK.prototype.getDrawChartPoints = function(graphKData){
	
	var dataArray = graphKData.data;  //[Object,....]
	var pointArray = new Array();
	for ( var i = 0; i < dataArray.length; i++) {
		var atData 	= dataArray[i];	//Object   ex: {x:1,y:1}
		//console.log('atData : x:'+atData.x+"   y:"+atData.y);
		var point 	= this.getDrawChartPoint(
				new PointK(atData[graphKData.xVarName], atData[graphKData.yVarName]),
				this.chartAxisXDataMin, this.chartAxisXDataMax,
				this.chartAxisYDataMin, this.chartAxisYDataMax
				);
		point.value=atData[graphKData.yVarName]+", "+atData[graphKData.xVarName];
		point.yvalue = atData[graphKData.yVarName];
		point.xvalue = atData[graphKData.xVarName];
		pointArray.push(point);
	}
	return pointArray;
}


GraphK.prototype.drawChartCustomData = function(graphKData){//GraphDataK
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
	this.context.textAlign 		= "center";
	this.context.textBaseline 	= "middle";
	
	
	var pointArray = this.getDrawChartPoints(graphKData);
	for ( var i = 0; i < pointArray.length; i++) {
		var atPoint = pointArray[i];
		graphKData.type(this.context, atPoint,graphKData);
	}
	
	this.context.strokeStyle 	= graphKData.strokeStyle;
	this.context.fillStyle 		= graphKData.strokeStyle; 
	this.context.stroke(); 
}





//PointK, GraphDataKSet
//차트데이터 데이터값을주면  상대좌표를 픽셀을 돌려준다.
GraphK.prototype.getDrawChartPoint = function(point, xMin, xMax, yMin, yMax){
	xMin=Number(xMin); xMax=Number(xMax); yMin=Number(yMin); yMax=Number(yMax);
	var yData_BetweenLength 	= GraphKUtil.getBetweenLength(yMin, yMax); 
	var xData_BetweenLength		= GraphKUtil.getBetweenLength(xMin, xMax);
	
	var yMinMargin = GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMinMarginPercent);
	var yMaxMargin = GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMaxMarginPercent);
	var xMinMargin = GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMinMarginPercent);
	var xMaxMargin = GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMaxMarginPercent);
	
	if(yMinMargin==0){//2016027 크기가 하나로 다동일할떄 차이값이 0이 나와서 화면에 제대로 안그려진다 이떄 조치.
		yMinMargin = this.chartAxisYDataMinMarginPercent;
	}
	if(yMaxMargin==0){
		yMaxMargin = this.chartAxisYDataMaxMarginPercent;
	}
	if(xMinMargin==0){
		xMinMargin = this.chartAxisXDataMinMarginPercent;
	}
	if(xMaxMargin==0){
		xMaxMargin = this.chartAxisXDataMaxMarginPercent;
	}	
	
	//datamargin
	yMin = yMin - yMinMargin;
	yMax = yMax + yMaxMargin;
	xMin = xMin - xMinMargin;
	xMax = xMax + xMaxMargin;
	yData_BetweenLength = GraphKUtil.getBetweenLength(yMin, yMax);//yMinMargin; 
	xData_BetweenLength = GraphKUtil.getBetweenLength(xMin, xMax);//xMinMargin; 
	////////
	
	var yAtData_BetweenLength 	= GraphKUtil.getBetweenLength(yMin, point.y); //ex) 10(원하는거) - 7(민) = 3(차)
	var xAtData_BetweenLength	= GraphKUtil.getBetweenLength(xMin, point.x);			
	
	var yDataPercent			= GraphKUtil.getPercentByTot(yData_BetweenLength, yAtData_BetweenLength); // 전체차에서  원하는값의차는 몇%인가
	var xDataPercent			= GraphKUtil.getPercentByTot(xData_BetweenLength, xAtData_BetweenLength);	
	var yPoint					= GraphKUtil.getValueByTotInPercent(this.chartDataRect.height, yDataPercent);//전체값의 몇 퍼센트는 얼마? 계산법 공식 ;  전체값 X 퍼센트 ÷ 100
	var xPoint					= GraphKUtil.getValueByTotInPercent(this.chartDataRect.width,  xDataPercent);
	var ySet					= this.chartDataRect.getEndY()   - yPoint;
	var xSet					= this.chartDataRect.getStartX() + xPoint;
	
	if(ySet&&xSet){
		return new PointK(xSet.toFixed(2), ySet.toFixed(2));
	}else{
		return new PointK(this.containerRect.getEndX()/2, this.containerRect.getEndY()/2);
	}
}
//PointK, GraphDataKSet
//차트데이터 안쪽에서의 상대좌표를 픽셀을주면  이에따른   데이터 값을 돌려준다.
GraphK.prototype.getDrawChartData = function(point, xMin, xMax, yMin, yMax){
	xMin=Number(xMin); xMax=Number(xMax); yMin=Number(yMin); yMax=Number(yMax);
	var yData_BetweenLength = GraphKUtil.getBetweenLength(yMin, yMax); 
	var xData_BetweenLength	= GraphKUtil.getBetweenLength(xMin, xMax);
	var yMinMargin 			= GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMinMarginPercent);
	var yMaxMargin			= GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMaxMarginPercent);
	var xMinMargin 			= GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMinMarginPercent);
	var xMaxMargin 			= GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMaxMarginPercent);
	
	
	//datamargin
	yMin = yMin - yMinMargin;
	yMax = yMax + yMaxMargin;
	xMin = xMin - xMinMargin;
	xMax = xMax + xMaxMargin;
	yData_BetweenLength = GraphKUtil.getBetweenLength(yMin, yMax);//yMinMargin; 
	xData_BetweenLength = GraphKUtil.getBetweenLength(xMin, xMax);//xMinMargin; 
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
	for ( var i = 0; this.chartCrossGrideVisible && i <= this.chartCrossGrideXCount; i++) {
		this.context.moveTo(this.chartRect.getStartX()+(xcrossCharP*i), this.chartRect.getStartY()); 
		this.context.lineTo(this.chartRect.getStartX()+(xcrossCharP*i), this.chartRect.getEndY()); 
	}
	for ( var i = 0; this.chartCrossGrideVisible && i <= this.chartCrossGrideYCount; i++) {
		this.context.moveTo(this.chartRect.getStartX(), this.chartRect.getStartY()+(ycrossCharP*i)); 
		this.context.lineTo(this.chartRect.getEndX(), this.chartRect.getStartY()+(ycrossCharP*i)); 
	}
	this.context.stroke(); 
}

GraphK.prototype.drawChartAxisGuide = function(){
	this.context.strokeStyle	= this.chartStrokeStyle;
	this.context.fillStyle		= this.chartStrokeStyle; //스타일있으면 그걸로셋팅.
	//data Gride
	var yMin	= this.chartAxisYDataMin;
	var yMax	= this.chartAxisYDataMax;
	var xMin	= this.chartAxisXDataMin; 
	var xMax	= this.chartAxisXDataMax;
	
	var yData_BetweenLength = GraphKUtil.getBetweenLength(yMin, yMax); 
	var xData_BetweenLength	= GraphKUtil.getBetweenLength(xMin, xMax);
	
	
	var yMinMargin 			= GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMinMarginPercent);
	var yMaxMargin			= GraphKUtil.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMaxMarginPercent);
	var xMinMargin 			= GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMinMarginPercent);
	var xMaxMargin 			= GraphKUtil.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMaxMarginPercent);

	//datamargin
	yMin = yMin - yMinMargin;
	yMax = yMax + yMaxMargin;
	xMin = xMin - xMinMargin;
	xMax = xMax + xMaxMargin;
	yData_BetweenLength = GraphKUtil.getBetweenLength(yMin, yMax);//yMinMargin; 
	xData_BetweenLength = GraphKUtil.getBetweenLength(xMin, xMax);//xMinMargin; 
	////////
	
	var xChar	= (xMax - xMin);
	var xP		= xChar / this.chartAxisXCount;
	var xGP		= this.chartDataRect.width / this.chartAxisXCount;  
	var yChar	= (yMax - yMin);
	var yP		= yChar / this.chartAxisYCount;
	var yGP		= this.chartDataRect.height / this.chartAxisYCount;
	//>> X
	this.context.textAlign		= "left";
//	this.context.textBaseline	= "end";
	this.context.textBaseline	= "top";
	
	this.context.strokeStyle = this.chartStrokeStyle;
	for ( var i = 0; this.chartAxisXVisible && i <= this.chartAxisXCount; i++) {
		this.context.beginPath();
		var setX = this.chartDataRect.getStartX()+(xGP*i);
		var setY = this.chartRect.getEndY();
		var atData = (xMin+(xP*i)).toFixed(1);					//사용자가 정의한 트랜스퍼 함수있으면 그거태워라
		atData = this.chartAxisXFnc?this.chartAxisXFnc(atData,i):atData;
		this.context.fillText(atData, setX, setY);  //chart padding값..추가
		//눈꿈그리기
		this.context.moveTo(setX, setY); 
		this.context.lineTo(setX, setY-this.chartAxisXGuideSize); 
		this.context.stroke(); 
	}
	//>> Y
	this.context.textAlign		= "left";
	this.context.textBaseline	= "bottom";
	for ( var i = 0; this.chartAxisYVisible && i <= this.chartAxisYCount; i++) {
		this.context.beginPath();
		var setX = this.chartRect.getStartX();
		var setY = this.chartDataRect.getEndY()-(yGP*i);
		var atData = (yMin+(yP*i)).toFixed(1);					//사용자가 정의한 트랜스퍼 함수있으면 그거태워라
		atData = this.chartAxisYFnc?this.chartAxisYFnc(atData):atData;
		this.context.fillText(atData,setX , setY);  //chart padding값..추가
		//눈꿈그리기
		this.context.moveTo(setX, setY); 
		this.context.lineTo(setX+this.chartAxisYGuideSize, setY); 
		this.context.stroke(); 
	}
	
	
	if(this.chartAxisScaleVisible){
		
		this.context.fillStyle = "rgba(225, 225, 225, 0.5)";//"#EAEAEA"; 
		this.context.fillRect(this.chartDataRect.getStartX(), this.chartDataRect.getEndY(), this.chartDataRect.width, 10);
		this.context.fillRect(this.chartDataRect.getEndX(), this.chartDataRect.getStartY(), 10, this.chartDataRect.height);
		//xMin
		//xMax
		//yData_BetweenLength
		//xData_BetweenLength
		
		var xBetweenLength		= GraphKUtil.getBetweenLength(this.chartDataRect.getStartX(), this.chartDataRect.getEndX());
		var yBetweenLength		= GraphKUtil.getBetweenLength(this.chartDataRect.getStartY(), this.chartDataRect.getEndY());
	//	console.log("var xBetweenLength		= GraphKUtil.getBetweenLength(this.chartDataRect.getStartX(), this.chartDataRect.getEndX());");
	//	console.log(xBetweenLength +"  " +this.chartDataRect.getStartX()+"  "+this.chartDataRect.getEndX());
		var xDataBetweenLength 	= GraphKUtil.getBetweenLength(this.data.getDataXMin(), this.data.getDataXMax());
		var yDataBetweenLength 	= GraphKUtil.getBetweenLength(this.data.getDataYMin(), this.data.getDataYMax());
	//	console.log("var dataBetweenLength 	= GraphKUtil.getBetweenLength(this.data.getDataXMin(), this.data.getDataXMax());");
	//	console.log(dataBetweenLength +"  " +this.data.getDataXMin()+"  "+this.data.getDataXMax());
		var xMinBetweenLength 	= GraphKUtil.getBetweenLength(this.data.getDataXMin(), xMin);
		var yMinBetweenLength 	= GraphKUtil.getBetweenLength(this.data.getDataYMin(), yMin);
	//	console.log("var xMinBetweenLength 	= GraphKUtil.getBetweenLength(this.data.getDataXMin(), xMin);");
	//	console.log(xMinBetweenLength +"  " +this.data.getDataXMin()+"  "+xMin);
		var xMaxBetweenLength 	= GraphKUtil.getBetweenLength(this.data.getDataXMin(), xMax);
		var yMaxBetweenLength 	= GraphKUtil.getBetweenLength(this.data.getDataYMin(), yMax);
	//	console.log("var xMaxBetweenLength 	= GraphKUtil.getBetweenLength(this.data.getDataXMin(), xMax);");
	//	console.log(xMaxBetweenLength +"  " +this.data.getDataXMin()+"  "+xMax);
		
		var xMinPercent			= GraphKUtil.getPercentByTot(xDataBetweenLength, xMinBetweenLength);
		var yMinPercent			= GraphKUtil.getPercentByTot(yDataBetweenLength, yMinBetweenLength);
	//	console.log("var xMinPercent			= GraphKUtil.getPercentByTot(dataBetweenLength, xMinBetweenLength);");
	//	console.log(xMinPercent +"  " +dataBetweenLength+"  "+xMinBetweenLength);
		var xMaxPercent			= GraphKUtil.getPercentByTot(xDataBetweenLength, xMaxBetweenLength);
		var yMaxPercent			= GraphKUtil.getPercentByTot(yDataBetweenLength, yMaxBetweenLength);
	//	console.log("var xMaxPercent			= GraphKUtil.getPercentByTot(dataBetweenLength, xMaxBetweenLength);");
	//	console.log(xMaxPercent +"  " +dataBetweenLength+"  "+xMaxBetweenLength);
		
		var startX				= GraphKUtil.getValueByTotInPercent(xBetweenLength, xMinPercent);
		var startY				= GraphKUtil.getValueByTotInPercent(yBetweenLength, yMinPercent);
	//	console.log("var startX				= GraphKUtil.getValueByTotInPercent(xBetweenLength, xMinPercent);");
	//	console.log(startX +"  " +xBetweenLength+"  "+xMinPercent);
		var setWidth			= GraphKUtil.getValueByTotInPercent(this.chartDataRect.width, xMaxPercent);
		var setHeight			= GraphKUtil.getValueByTotInPercent(this.chartDataRect.height, yMaxPercent);
	//	console.log("var setWidth			= GraphKUtil.getValueByTotInPercent(this.chartDataRect.width, xMaxPercent);");
	//	console.log(setWidth +"  " +this.chartDataRect.width+"  "+xMaxPercent);
		if(startX<0){
			startX=0;
		}
		if(startY<0){
			startY=0;
		}
		if(setWidth>this.chartDataRect.width){
			setWidth = this.chartDataRect.width;
		}
		if(setHeight>this.chartDataRect.height){
			setHeight = this.chartDataRect.height;
		}
	//	console.log (
	//			" xMin                " + xMin               + 
	//			"\r\n xMax                " + xMax               + 
	//			"\r\n"+
	//			"\r\n this.data.getDataXMax() " + this.data.getDataXMax()               + 
	//			"\r\n this.data.getDataXMin() " + this.data.getDataXMin()               + 
	//			"\r\n"+
	//			"\r\n yData_BetweenLength " + yData_BetweenLength+ 
	//			"\r\n xData_BetweenLength " + xData_BetweenLength+ 
	//			"\r\n"+
	//			"\r\n xBetweenLength		 " + xBetweenLength		+
	//			"\r\n dataBetweenLength 	 " + dataBetweenLength 	+
	//			"\r\n"+
	//			"\r\n xMinBetweenLength 	 " + xMinBetweenLength 	+
	//			"\r\n xMaxBetweenLength 	 " + xMaxBetweenLength 	+
	//			"\r\n"+
	//			"\r\n xMinPercent		 " + xMinPercent		+	
	//			"\r\n xMaxPercent		 " + xMaxPercent		+	
	//			"\r\n"+
	//			"\r\n startX				 " + startX				+
	//			"\r\n setWidth			 " + setWidth			
	//	);
		this.context.fillStyle = "rgba(30, 30, 30, 0.5)";//"#EAEAEA"; 
		this.context.fillRect(this.chartDataRect.getStartX()+startX, this.chartDataRect.getEndY()+2, setWidth-startX,5);
		this.context.fillRect(this.chartDataRect.getEndX()+2, this.chartDataRect.getEndY()-startY, 5, -setHeight+startY);
		
	}
	
	
}




GraphK.prototype.addData = function(data){
	this.data.push(data);
}
GraphK.prototype.setData = function(data){
	this.chartAxisXDataMin      = undefined;
	this.chartAxisXDataMax      = undefined;
	this.chartAxisYDataMin      = undefined;
	this.chartAxisYDataMax      = undefined;
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