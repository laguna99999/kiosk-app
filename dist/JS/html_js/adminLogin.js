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

	$isUsername=1; // 1��ʾ�����û�����0��ʾ��������
	$("#result").attr("realStr","")
	$(".number").mousedown(function(){
		$(this).css({
			"background":"#ccc"
		})
	}).mouseup(function(){
		$(this).css({
			"background":""
		})
		if($("#result").text().length!=10)
		{
			if($isUsername == 1)
			{
				$("#result").text($("#result").text()+$.trim($(this).text()));
			}
			else
			{
				$("#result").attr("realStr",$("#result").attr("realStr")+$.trim($(this).text()));
				$("#result").text($("#result").text()+"*");
			}
		}

	})

	$("#cancel").click(function(){
		$("#result").text($("#result").text().substring(0,$("#result").text().length-1))
	})

	$("#goBack").click(function(){
		history.back(-1)
	})
    $("#register").click(function(){
        window.location.href = 'adminRegister.html';
    })
	$employeeNumber =""; // Ա����
	$employeePassword =""; // Ա������
	$("#enter").click(function(){
		$isUsername=0;
		$employeeNumber = $("#result").text()
		if($employeeNumber.length!=0)
		{
			$("#titleText").text("ENTER PASSWORD")
			$("#enter").hide();
			$("#Login").show();
			$("#result").text("")
		}
	})

	$("#Login").click(function(){
		$isUsername=1;
		$employeePassword = $("#result").attr("realStr")
		// var result = callHostPost("employeeLogin", {"data": $employeeNumber,"password":$employeePassword});
		// console.log(result);
		// try
		// {
		// 	if(JSON.parse(result)["resultCode"]==0)
		// 	{
		// 		window.location.href="managerFunc.html";
		// 	}
		// 	else
		// 	{
		// 		$("#titleText").text("EMPLOYEE NUMBER")
		// 		$("#enter").show();
		// 		$("#Login").hide();
		// 		$("#result").text("")
		// 		$("#result").attr("realStr","")
		// 		showDialog("Login Failed");
		// 	}
		// }
		// catch(err)
		// {
		// 	$("#titleText").text("EMPLOYEE NUMBER")
		// 	$("#enter").show();
		// 	$("#Login").hide();
		// 	$("#result").text("")
		// 	$("#result").attr("realStr","")
		// 	// �쳣�����糬ʱ��
		// 	showDialog("System Error Please Try Again");
		// }
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
