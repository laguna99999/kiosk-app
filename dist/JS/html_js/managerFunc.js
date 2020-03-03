$hasPasswordShow=0;
$hasPairShow =0;
$hasSuccessShow =0;
var	SecondCountDown;
$(function(){
	autoCancelTrans();
	$("#mydialog").load("dialogModel.html")
	
	$('#mydialog').on('hidden.bs.modal', function (e) {
	  $(".modal-backdrop").hide()
	})
	
	// 点击reload
	$("#reloadBTN").click(function(){
		try
		{
			var result = JSON.parse(callHostPost("reload", {"data":"1"})); 
			if(result.resultCode==0)
			{
				showDialog("Reloaded.")
			}
			else
			{
				showDialog("Reload Failed.")
			
			}
		}
		catch
		{
			console.log("数据格式返回错误");
			showDialog("Reload Failed.")
		}
	})
	
	// 点击连接按钮
	$("#connectCloverBTN").click(function(){
		$hasPasswordShow=0;
		$hasPairShow =0;
		$hasSuccessShow =0;
		clearInterval(SecondCountDown);
		var checkConnect = getConnectStatues();
		if(checkConnect==2)
		{
			return;
		}
		try
		{
			var result = JSON.parse(callHostPost("connectClover", {"data":"1"})); 
			console.log(result)
			if(result.resultCode==1)
			{
				showDialog(result.message)
			}
			else
			{
				getConnectStatuesTimeOut();
			}
		}
		catch
		{
			console.log("数据格式返回错误");
			showDialog("Reload Failed.")
		}
	})

	$("#rePrint").click(function(){
		window.location.href="keyBoard.html?func=rePrint"
	})

	$("#printLast").click(function(){
		try
		{
			var result = JSON.parse(callHostPost("lastPrint", {"data":"1"})); 
			if(result.resultCode == 0)
			{
				showDialog("success")
			}
			else
			{
				showDialog("Reloaded.")
			}
		}
		catch
		{
			showDialog("Print Failed.")
		}
	})
	
	$("#refund").click(function(){
		window.location.href="keyBoard.html?func=refund"
	})

	// 点击返回按钮
	$("#backToIndex").click(function(){
		location.href="index.html"
	})
})

function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}

// 查询连接状态
function getConnectStatuesTimeOut()
{
	SecondCountDown = setInterval(function(){getConnectStatues()}, 2000);
}

function getConnectStatues()
{
	var returnCode = 0;
	try
	{
		var result = JSON.parse(callHostPost("getConnectType", {"data":"1"})); 
		console.log(result)
		
		if(result.hasReady=="0" && result.hasConnect=="1" && result.pairCode=="0")
		{
			if($hasPasswordShow==0)
			{
				console.log("aaa")
				$hasPasswordShow=1;
				$("#mydialog").modal('hide')
				$(".modal-backdrop").hide();
				sleep(300)
				showDialog("Enter Password in Clover");
				returnCode = 1 ; // 提示输入clover密码
			}
		}
		else if(result.pairCode!="0" && result.hasReady=="0")
		{
			if($hasPairShow==0)
			{
								console.log("bbb")
				$hasPairShow=1;
				$("#mydialog").modal('hide')
				sleep(300)
				showDialog("Pair code :"+result.pairCode);
				returnCode = result.pairCode; // 提示输入pair密码
			}
		}
		else if(result.hasReady!=0)
		{
			if($hasSuccessShow==0)
			{
				$hasSuccessShow=1;
				$("#mydialog").modal('hide');
								sleep(300)
				showDialog("Connect Success");
				returnCode = 2 ; // 表示连接成功
			}
		}
		else
		{
			returnCode = 3; // 未连接 
		}
	}
	catch
	{}
	return returnCode;
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