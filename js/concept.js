	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

	var conceptMap = {};
	var 
		maxNodes = 11,
		spc = 360 / maxNodes,
		deg2rad = Math.PI / 180,
		i = 0
		nodes = [], angle = 0, 
		CX = 500, 
		CY = 250, 
		cWidth = 400,
		cHeight = 400,
		innerRadius = 150,
		textOffset = 10,
		curNodeRadius = 30,
		nodeRadius = 15;
	
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var svgNS = svg.namespaceURI;
	var nodeObj = {};
	var curNodeObj = {};
	var subjects = {};

	
	conceptMap.init = function(_nodeObj) {
		nodeObj = _nodeObj;
		curNodeObj = _nodeObj['MAT.ALG.100'];
		
		svg.setAttribute('width', 1000);
		svg.setAttribute('height', 800);
		document.body.appendChild(svg);
		
		/*Create Angles*/
		for(i=0; i < maxNodes; i++) {
			nodes.push(angle);
			angle += spc;
		}
		this.createConcept();
	}
	
	conceptMap.createConcept = function() {
		var g = this.generateGroup();
		svg.append(g);
		g.append(this.generateParentNode());
		for(var i=0; i<nodes.length; i++) {
			g.append(this.generateChildNodes(nodes[i], curNodeObj[i].EID));
			g.append(this.generateLines(nodes[i], curNodeObj[i].EID));
			g.append(this.generateText(nodes[i],  curNodeObj[i].EID));
			
		}
	}
	conceptMap.generateGroup = function() {
		var g = document.createElementNS(svgNS, "g");
		g.setAttribute("width", cWidth); 
		g.setAttribute("height", cWidth); 
		g.setAttribute("class", "node-group"); 
		g.setAttribute("id", "node-group"); 
		g.setAttribute("prev", "node-group"); 
		return g;
	}
	
	conceptMap.generateParentNode = function() {
		var curNode = document.createElementNS(svgNS, "circle");
		curNode.setAttribute("cx", CX);
		curNode.setAttribute("cy", CY);
		curNode.setAttribute("r",  curNodeRadius);
		curNode.setAttribute("fill", "#a6e445"); 
		curNode.setAttribute("stroke", "#4ec2f6"); 
		curNode.setAttribute("class", "cur-node");
		curNode.addEventListener('click', function() {
			conceptMap.removeGroup(this);
		});
		svg.setAttribute('height', (CY+innerRadius+100));
		$('html, body').animate({
			scrollTop: (CY+innerRadius+50)
		}, 100);
		return curNode;
	}
	
	conceptMap.extentParentNodeLine = function(_node) {
		var moveCircle = _node;
		var line = $(moveCircle).next()[0]
		var angle = moveCircle.getAttribute('angle');
		var lineEX = CX + ((innerRadius*3)-nodeRadius) * Math.cos(angle * deg2rad);
		var lineEY = CY + ((innerRadius*3)-nodeRadius) * Math.sin(angle * deg2rad);
		line.setAttribute('x2', lineEX);
		line.setAttribute('y2', lineEY);
		line.setAttribute("stroke", "#4ec2f6")
	}
	
	conceptMap.moveParentNode = function(_node) {
		var moveCircle = _node;
		var curGroup = $(_node).parent('g');
		if($(curGroup).attr('disabled') == 'true') return;
		this.extentParentNodeLine(_node);
		CX = CX + (innerRadius*3) * Math.cos(moveCircle.getAttribute('angle') * deg2rad);
		CY = CY + (innerRadius*3) * Math.sin(moveCircle.getAttribute('angle') * deg2rad);
		$(curGroup).attr({"disabled":true})
		moveCircle.setAttribute("cx", CX);
		moveCircle.setAttribute("cy", CY);
		moveCircle.setAttribute("r",  curNodeRadius);
		moveCircle.setAttribute("class",  'node node-center');
		this.createConcept();
	}
	
	conceptMap.generateChildNodes = function(angle, _label) {
		nodeX = CX + innerRadius * Math.cos(angle * deg2rad);
		nodeY = CY + innerRadius * Math.sin(angle * deg2rad);
		var circle = document.createElementNS(svgNS, "circle");
		circle.setAttribute("cx", nodeX);
		circle.setAttribute("cy", nodeY);
		circle.setAttribute("r",  nodeRadius);
		circle.setAttribute("angle",  angle);
		circle.setAttribute("label",  _label);
		circle.setAttribute("fill", "#a6e445"); 
		circle.setAttribute("stroke", "#4ec2f6"); 
		circle.setAttribute("class", "node");
		circle.addEventListener('click', function() {
			curNodeObj = nodeObj[this.getAttribute('label')]
			conceptMap.moveParentNode(this);
		})
		return circle;
	}
	
	conceptMap.generateLines = function(angle) {
		lineSX = CX + curNodeRadius * Math.cos(angle * deg2rad);
		lineSY = CY + curNodeRadius * Math.sin(angle * deg2rad);
		lineEX = CX + (innerRadius-nodeRadius) * Math.cos(angle * deg2rad);
		lineEY = CY + (innerRadius-nodeRadius) * Math.sin(angle * deg2rad);
		var line = document.createElementNS(svgNS,'line');
		line.setAttribute('x1', lineSX);
		line.setAttribute('y1', lineSY);
		line.setAttribute('x2', lineEX);
		line.setAttribute('y2', lineEY);
		line.setAttribute("stroke", "#d7d7d7")
		return line;
	}
	
	conceptMap.generateText = function(angle, _label) {
		var textX = CX + (200) * Math.cos(angle * deg2rad);
		var textY = CY + (200) * Math.sin(angle * deg2rad);
		var text = document.createElementNS(svgNS, "text");
		text.setAttribute("x", textX);
		text.setAttribute("y", textY);
		text.setAttribute("font-size", 9);
		text.setAttribute("width", 50);
		text.setAttribute("text-anchor", 'middle');
		text.setAttribute("alignment-baseline", 'central');
		var textNode = document.createTextNode(subjects[_label].name);
		text.appendChild(textNode);
		return text;
	}
	
	conceptMap.removeGroup = function(_curGroup) {
		var curG = $(_curGroup).parent()[0];
		if($(curG).attr('disabled') == 'true') return;
		
		var prevGroup = $(_curGroup).parent().prev()[0];
		$(prevGroup).attr({'disabled': false})
		if(!prevGroup) return;
		$(_curGroup).parent().get()[0].remove();
		
		var moveCircle = $(prevGroup).find('.node-center')[0];
		var line = $(moveCircle).next()[0]
		
		var angle = moveCircle.getAttribute('angle');
		CX = CX - (innerRadius*3) * Math.cos(angle * deg2rad);
		CY = CY - (innerRadius*3) * Math.sin(angle * deg2rad);
		
		nodeX = CX + innerRadius * Math.cos(angle * deg2rad);
		nodeY = CY + innerRadius * Math.sin(angle * deg2rad);

		moveCircle.setAttribute("cx", nodeX);
		moveCircle.setAttribute("cy", nodeY);
		moveCircle.setAttribute("r",  nodeRadius);

		line.setAttribute('x2', nodeX);
		line.setAttribute('y2', nodeY);
		line.setAttribute("stroke", "#d7d7d7")
	}
	
