$(function(){
	autoCancelTrans();
	$("#mydialog").load("dialogModel.html")
	
	$(".col").css({
		"height":$(".col:first").width()/2,
		"line-height":$(".col:first").width()/2+"px",
		"font-size":"8vw",
		"text-align":"center"
	})
		
	$("#resultDiv").css({
		"line-height":$("#resultDiv").height()+"px"
	})
		
	$(".EnterOrLogin").css({
		"font-size":"3vw",
		"height":$(".col:first").width()/2,
		"text-align":"center",
		"line-height":$(".col:first").width()/2+"px"
	})
		
	$(".col").mousedown(function(){
		$(this).css({
			"background":"#ccc"
		})
	}).mouseup(function(){
		$(this).css({
			"background":""
		})
		if($("#result").text().length!=2)
		{
			$("#result").text($("#result").text()+$.trim($(this).text()));
		}

	})
		
	$("#cancel").click(function(){
		$("#result").text($("#result").text().substring(0,$("#result").text().length-1))
	})
	
	$("#enter").click(function(){
		var result = callHostPost("addPageNumber", {"data": $("#result").text()}); 
		console.log(result)
		try
		{
			if(JSON.parse(result)["resultCode"]==0)
			{
				window.location.href="menu.html";
			}
		}
		catch(err)
		{
			// 异常处理如超时等
			showDialog("System Error Please Try Again");
		}
	})
})
	
function callHostPost(command, parameters) {
		// Create the query string readimg the fields of the passed parameters object
		var qs = '';
		  if (parameters != null) {
			for(var key in parameters)
			  qs += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
		  }
		  // Remove last ampersand
		  if (qs.length > 0)
			qs = '?' + qs.substring(0, qs.length-1);

		  var request = new XMLHttpRequest();
		  // `false` makes the request synchronous
		  request.open('POST', 'http://localhost:8080/kiosk/'+command, false);
		  request.send(qs);

		  if (request.status === 200)
			return request.responseText;
		  else
			return '!error ' + request.status;
		}