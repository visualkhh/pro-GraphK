//Point
PointK.prototype	= new Object();
PointK.prototype.x	= undefined;
PointK.prototype.y	= undefined;
function PointK(x,y){
	this.x = x;
	this.y = y;
}

//사각형
RectK.prototype				= new Object();
RectK.prototype.startPoint	= undefined;
RectK.prototype.endPoint	= undefined;
RectK.prototype.width		= undefined;
RectK.prototype.height		= undefined;
RectK.prototype.context		= undefined;
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
	return new RectK(startX, startY, endW, endH);
}
RectK.prototype.getMargin = function(tpadding, rpadding, bpadding, lpadding){
	var startX = this.getStartX() - lpadding;
	var startY = this.getStartY() - tpadding;
	var endW = (this.getEndX() + startX) + rpadding;
	var endH = (this.getEndY() + startY) + bpadding;
	return new RectK(startX, startY, endW, endH);
}
RectK.prototype.getCentX = function(){
	return ((this.getEndX() - this.getStartX()) / 2) + this.getStartX()
}
RectK.prototype.getCentY = function(){
	return ((this.getEndY() - this.getStartY()) / 2) + this.getEndY();
}


//data...Object
GraphDataK.prototype 				= new Object();
GraphDataK.prototype.name			= undefined;
GraphDataK.prototype.strokeStyle	= undefined;
GraphDataK.prototype.type			= undefined; //line, stick, 
GraphDataK.prototype.data			= undefined;//[{x:1,y:1}, {x:2,y:2},Object,...] 
function GraphDataK(name,data){
	this.name = name;
	this.data = data;
}
GraphDataK.prototype.setStrokeStyle = function(strokeStyle){
	this.strokeStyle = strokeStyle;
}
GraphDataK.prototype.setType = function(type){
	this.type = type;
}
