//Point
PointK.prototype		= new Object();
PointK.prototype.x		= undefined;
PointK.prototype.y		= undefined;
PointK.prototype.value	= undefined;
function PointK(x, y, value){
	this.x = x;
	this.y = y;
	this.value = value;
}

//사각형
RectK.prototype				= new Object();
RectK.prototype.startPoint	= undefined;
RectK.prototype.endPoint	= undefined;
RectK.prototype.width		= undefined;
RectK.prototype.height		= undefined;
RectK.prototype.context		= undefined;
RectK.prototype.lpadding 	= 0;
RectK.prototype.tpadding 	= 0;
RectK.prototype.rpadding 	= 0;
RectK.prototype.bpadding 	= 0;
RectK.prototype.lmargin		= 0;
RectK.prototype.tmargin		= 0;
RectK.prototype.rmargin		= 0;
RectK.prototype.bmargin		= 0;

function RectK(startX, startY, width, height, context){
	this.startPoint = new PointK(startX,startY);
	this.endPoint 	= new PointK(startX + width, startY + height);
	this.width	= width;
	this.height	= height;
	this.context = context;
};
RectK.prototype.getStartX=function(){
	return this.startPoint.x;
};
RectK.prototype.getStartY=function(){
	return this.startPoint.y;
};
RectK.prototype.getEndX=function(){
	return this.endPoint.x;
};
RectK.prototype.getEndY=function(){
	return this.endPoint.y;
};
RectK.prototype.setPadding = function(tpadding, rpadding, bpadding, lpadding){
	this.tpadding = tpadding;
	this.rpadding = rpadding;
	this.bpadding = bpadding;
	this.lpadding = lpadding;
}

RectK.prototype.setMargin = function(tmargin, rmargin, bmargin, lmargin){
	this.tmargin = tmargin;
	this.rmargin = rmargin;
	this.bmargin = bmargin;
	this.lmargin = lmargin;
}
RectK.prototype.strokeRect=function(context, style){
	var target_context	= undefined;
	if(context)
		target_context = context;
	else if(this.context)
		target_context = this.context;
	
	
	if(target_context){
		var backup_style 	= target_context.strokeStyle;
		if(style)
			target_context.strokeStyle = style;
		
		target_context.strokeRect(this.getStartX(),this.getStartY(),this.width,this.height);
		target_context.strokeStyle = backup_style;
		//debug
		//target_context.fillText(this.getStartX()+","+this.getStartY(),this.getStartX(),this.getStartY());
		//target_context.fillText(this.getEndX()+","+this.getEndY(),this.getEndX(),this.getEndY());
	}
};
RectK.prototype.fillRect=function(context, style){
	var target_context	= undefined;
	if(context)
		target_context = context;
	else if(this.context)
		target_context = this.context;
	
	
	if(target_context){
		var backup_style 	= target_context.strokeStyle;
		if(style)
			target_context.fillStyle = style;
		
		target_context.fillRect(this.getStartX(),this.getStartY(),this.width,this.height);
		target_context.fillStyle = backup_style;
		//debug
		//target_context.fillText(this.getStartX()+","+this.getStartY(),this.getStartX(),this.getStartY());
		//target_context.fillText(this.getEndX()+","+this.getEndY(),this.getEndX(),this.getEndY());
	}
};
//t,r,b,l
RectK.prototype.getPadding = function(tpadding, rpadding, bpadding, lpadding){
	var startX = this.getStartX() + lpadding;
	var startY = this.getStartY() + tpadding;
	var endW = (this.getEndX() - startX) - rpadding;
	var endH = (this.getEndY() - startY) - bpadding;
	var rect = new RectK(startX, startY, endW, endH);
	rect.setPadding(tpadding, rpadding, bpadding, lpadding);
	return rect;
}
RectK.prototype.getMargin = function(tmargin, rmargin, bmargin, lmargin){
	var startX = this.getStartX() - lmargin;
	var startY = this.getStartY() - tmargin;
	var endW = (this.getEndX() + startX) + rmargin;
	var endH = (this.getEndY() + startY) + bmargin;
	var rect = new RectK(startX, startY, endW, endH);
	rect.setMargin(tmargin, rmargin, bmargin, lmargin);
	return rect;
}
RectK.prototype.getCentX = function(){
	return ((this.getEndX() - this.getStartX()) / 2) + this.getStartX()
}
RectK.prototype.getCentY = function(){
	return ((this.getEndY() - this.getStartY()) / 2) + this.getEndY();
}
RectK.prototype.isHit = function(x, y){
	return this.getStartX()<=x && this.getStartY()<=y && this.getEndX()>=x && this.getEndY()>=y;
}



//data...Object
GraphDataK.prototype 				= new Object();
GraphDataK.prototype.name			= undefined;
GraphDataK.prototype.strokeStyle	= undefined;
GraphDataK.prototype.fillStyle		= undefined;
GraphDataK.prototype.width			= undefined;
GraphDataK.prototype.type			= undefined; //line, stick, 
GraphDataK.prototype.data			= undefined;//[{x:1,y:1}, {x:2,y:2},Object,...] 
GraphDataK.prototype.xVarName 		= "x"; //GraphKData에 XData로들어갈 변수명
GraphDataK.prototype.yVarName 		= "y";
function GraphDataK(name,data){
	this.name = name;
	this.data = data;
}
GraphDataK.prototype.setXVarName = function(xVarName){
	this.xVarName = xVarName;
}
GraphDataK.prototype.setYVarName = function(yVarName){
	this.yVarName = yVarName;
}
GraphDataK.prototype.setStrokeStyle = function(strokeStyle){
	this.strokeStyle = strokeStyle;
}
GraphDataK.prototype.setFillStyle = function(fillStyle){
	this.fillStyle = fillStyle;
}
GraphDataK.prototype.setWidth = function(width){
	this.width = width;
}
GraphDataK.prototype.setType = function(type){
	this.type = type;
}

//[GraphDataK,.....]
GraphDataKSet.prototype 			= new  Array(); //Array Extends
function GraphDataKSet(){
}

GraphDataKSet.prototype.getDataXMax = function(name){
	var atData = this.getData(name);	//[GraphKData,...]
	var max = undefined;
	for ( var i = 0; i < atData.length; i++) {
		var atMax = GraphKUtil.getMaxByObjectArray(atData[i].data, atData[i].xVarName);
		max = Math.max(max==undefined?atMax:max, atMax);
	}
	return max;
}
GraphDataKSet.prototype.getDataXMin = function(name){
	var atData = this.getData(name);	//[GraphKData,...]
	var min = undefined;
	for ( var i = 0; i < atData.length; i++) {
		var atMin = GraphKUtil.getMinByObjectArray(atData[i].data, atData[i].xVarName); //[Object,..] -> min 
		min = Math.min(min==undefined?atMin:min,atMin);
	}
	return min;
}
GraphDataKSet.prototype.getDataYMax = function(name){
	var atData = this.getData(name);	//[GraphKData,...]
	var max = undefined;
	for ( var i = 0; i < atData.length; i++) {
		var atMax = GraphKUtil.getMaxByObjectArray(atData[i].data,atData[i].yVarName);
		max = Math.max(max==undefined?atMax:max, atMax);
	}
	return max;
}
GraphDataKSet.prototype.getDataYMin = function(name){
	var atData = this.getData(name);	//[GraphKData,...]
	var min = undefined;
	for ( var i = 0; i < atData.length; i++) {
		var atMin = GraphKUtil.getMinByObjectArray(atData[i].data, atData[i].yVarName); //[Object,..] -> min 
		min = Math.min(min==undefined?atMin:min,atMin);
	}
	return min;
}

//원하는 데이터Object를 가져온다. 이름없으면 전체가져옴
GraphDataKSet.prototype.getData = function(name){//[GraphKData,...]
	var getData = new GraphDataKSet();
	if(name){
		for ( var int = 0; int < this.length; int++) {
			if(data[i].name == name)
				getData.push(data[i]);
		}
	}else{
		getData = this;
	}
	return getData;
}
//min과 max의 사이의 길이.
GraphDataKSet.prototype.getDataXBetweenLength = function(name){//[GraphKData,...]
	return this.getDataXMax(name) - this.getDataXMin(name)
}
//min과 max의 사이의 길이.
GraphDataKSet.prototype.getDataYBetweenLength = function(name){//[GraphKData,...]
	return this.getDataYMax(name) - this.getDataYMin(name)
}
//PointK (data) ,PointK(data)
GraphDataKSet.prototype.getBetweenData = function(startData, endData, name){//[GraphKData,...]
	var newGraphDataKSet = new GraphDataKSet();  	//data
	var graphDataKSet = this.getData(name); 		// [GraphDataK,...]
	for ( var i = 0 ;i < graphDataKSet.length; i++) {
		var atGraphDataK	= graphDataKSet[i];		//GraphDataK
		var dataArray		= atGraphDataK.data; 	//[{x:1,y:1},...]
		var newDataArray	= new Array();
		for ( var y = 0; y < dataArray.length; y++) {
			var atData 		= dataArray[y];	//Object   ex: {x:1,y:1} 
			var startX 	= Math.min(startData.x, endData.x);
			var endX 	= Math.max(startData.x, endData.x);
			var startY 	= Math.min(startData.y, endData.y);
			var endY 	= Math.max(startData.y, endData.y);
			if(startX <= Number(atData[atGraphDataK.xVarName]) && startY <= Number(atData[atGraphDataK.yVarName]) &&
				endX >= Number(atData[atGraphDataK.xVarName]) && endY >= Number(atData[atGraphDataK.yVarName])){
				newDataArray.push(atData);
			}
		}
		
		if(newDataArray.length>0){ //나중에 복사하는거 손좀봐야됨 
			var newGraphDataK = new GraphDataK();
		    for (var property in atGraphDataK) {	//copy
		    	newGraphDataK[property] = atGraphDataK[property]; 
		    }
		    newGraphDataK.data = newDataArray;
		    newGraphDataKSet.push(newGraphDataK);
		}
	}
	return newGraphDataKSet;
}

