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
		if($("#result").text().length!=10)
		{
			$("#result").text($("#result").text()+$.trim($(this).text()));
		}

	})
		
	$("#cancel").click(function(){
		$("#result").text($("#result").text().substring(0,$("#result").text().length-1))
	})
	
	$("#goBack").click(function(){
		history.back(-1)
	})
	
	$("#enter").click(function(){
		$number = $("#result").text()
		try
		{
			var result = JSON.parse(callHostPost(getQueryString().func, {"data":$number})); 
			if(result.resultCode==0)
			{
				showDialog("Success.")
			}
			else
			{
				showDialog("Failed.")
			}
		}
		catch{
			showDialog("Failed.")
		}
	})
})
	
function getQueryString() {
	 //首先获取地址
	var url = url || window.location.href;
	//获取传值
	var arr = url.split("?");
	//判断是否有传值
	if(arr.length == 1){
		return null;
	}
	//获取get传值的个数
	var value_arr = arr[1].split("&");
	//循环生成返回的对象
	var obj = {};
	for(var i = 0; i < value_arr.length; i++){
		var key_val = value_arr[i].split("=");
		obj[key_val[0]]=key_val[1];
	}
	return obj;
}

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