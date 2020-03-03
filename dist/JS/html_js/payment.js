// ���ø���֧����ʱʱ��
var spoonityTimeOutSecond = $.cookie('spoonity');
var alipayTimeOutSecond = $.cookie('alipay');
var cloverTimeOutSecond = $.cookie('clover');

$SecondCountDown = null;
$payStatus = null;

$(function(){
	$("#mydialog").load("dialogModel.html")
	autoCancelTrans(); // �Զ�ȡ������
	// ����ֱ�Ӷ�������div�ĸ߶�
	$("#hiddenDiv").css({
		"height":$(".payTypeDiv:eq(0)").height()+1+"px",
	})

	$scanType = 1 //1��ʾ��ǰ״̬����ɨ��
	$type=-1; // ��ʾ��ǰѡ�����ǵڼ���֧��ģ��,

	// ����ĳһ��֧��
	$(".payTypeDiv").click(function(index){
		if($scanType!=1)
		{
			return;
		}

		$type=$(".payTypeDiv").index($(this))
		if($type!=1)
		{
			$(".hiddenDivInnerDiv").hide();
			showScanAlarm($type,"Scan Barcode")
			if($type==0)
			{
				$("#second").html(spoonityTimeOutSecond);
			}
			else
			{
				$("#second").html(alipayTimeOutSecond);
			}
		}
		else
		{
			$("#CloverSecond").html(cloverTimeOutSecond);
		}

		// ����ѡ��clover֧�� ֱ��ִ��ajax
		if($type==1)
		{
			spoonityOrAlipayPay($barcode,"cloverPay",1);
			/*
			try
			{
				$.ajax({
					method:"post",
					url:"http://localhost:8080/kiosk/cloverPay",
					data:{data : 1},
					async:true,
					beforeSend: function () {
						$("#hiddenDiv").html("");
						$("#hiddenDiv").css({
							"top":$(".payTypeDiv:eq("+($type)+")").offset().top,
							"left":$(".payTypeDiv:eq("+($type)+")").offset().left,
							"height":$(".payTypeDiv:eq("+($type)+")").height()+"px",
						})


						$divWaitting =$("<div></div>")
						$divWaitting.css({
							"position":"relative",
							"height":$(".payTypeDiv:eq("+($type)+")").height()/3+"px",
							"line-height":$(".payTypeDiv:eq("+($type)+")").height()/3+"px"
						})
						$divWaitting.html("Waiting...")

						$divArrow =$("<div></div>")
						$divArrow.css({
							"position":"relative",
							"height":$(".payTypeDiv:eq("+($type)+")").height()/3*2+"px",
							"line-height":$(".payTypeDiv:eq("+($type)+")").height()/3*2+"px"
						})
						$divArrow.html("<span class='glyphicon glyphicon glyphicon-arrow-down' style='font-size:20vw'></span>")

						$("#hiddenDiv").append($divWaitting)
						$("#hiddenDiv").append($divArrow)
						$("#hiddenDiv").show()
					},
					success:function(data) {
						if(data.resultCode==0)
						{
							window.location.href="last.html"
						}
						else
						{
							showDialog("Pay failed please try again.")
						}
					},
					error:function (data) {

						showDialog("Pay failed please try again.")

					},
					complete:function (data) {
						callHostPost("reset", {"data":"1"} ) ;
						$("#hiddenDiv").hide()
					}
				})
			}
			catch
			{
				showDialog("Pay failed please try again.")
			}
			*/
			$barcode="";
		}
	})

	// �жϻس�������ִ��֧������Gift��֧��
	$barcode="";
	$(document).on("keypress",function(e){
		// ����û��ѡ���κ�֧��ɨ����Ч
		if($scanType==0)
			return;

		if(window.event)
		{
			if(e.keyCode!=13)
			{
				$barcode+=String.fromCharCode(e.keyCode);
			}
		}
		else if(e.which)
		{
			if(e.which!=13)
			{
				$barcode+=String.fromCharCode(e.keyCode);
			}
		}

		if(e.keyCode==13 && $type==0)
		{
			spoonityOrAlipayPay($barcode,"giftCard",0);
		}
		if(e.keyCode==13 && $type==2)
		{
			spoonityOrAlipayPay($barcode,"alipay",0);
		}
	})
	$('#cancelTrans').click(function(){
		try
		{
			var result =  JSON.parse(callHostGet("cancelTransaction"))
			if(result.result.result=="OK")
			{
				window.location.href="index.html"
			}
			else
			{
				showDialog("Cancel Transaction failed,please try again")
			}
		}
		catch(e)
		{
			showDialog("Cancel Transaction failed,please try again")
		}
	})
	// �ײ�������ť����
	$(".foot3").click(function(){
		callHostPost("resetKiosk", {"data":"1"} ) ;
		$index = $(".foot3").index($(this))
		if($index==0)
		{

		}
		else if($index==1)
		{
			window.location.href='menu.html'
		}
		else
		{
			history.back(-1)
		}
	})
})

// spoonity��Alipay ��ʾscan��ʾ
function showScanAlarm(payIndex,scanAlarmStr)
{
	$("#hiddenDiv").css({
		"top":$(".payTypeDiv:eq("+payIndex+")").offset().top,
		"left":$(".payTypeDiv:eq("+payIndex+")").offset().left,
		"line-height":$(".payTypeDiv:eq(0)").height()+1+"px"
	})

	$("#hiddenDiv").show();
	$(".hiddenDivInnerDiv").hide();
	$("#forScan").html(scanAlarmStr);
	$("#forScan").show();
}

// spoonity����
function spoonityOrAlipayPay(barcode,funcName,isClover){
	$scanType=0; // ��ɨ����Ч
	clearInterval($SecondCountDown);
	clearInterval($payStatus);
	try
	{
		$.ajax({
			method:"post",
			url:"http://localhost:8080/kiosk/"+funcName,
			data:{data : $barcode},
			async:true,
			beforeSend: function () {
				// ������ʼǰ��ʼ����ʱ
				if(isClover!=1)
				{
					$(".hiddenDivInnerDiv").hide();
					$("#forspoonityAlipay").show();
					$SecondCountDown = setInterval(function(){
						$currentSecond = $("#second").html()*1-1;
						$currentSecond = $currentSecond <0?0:$currentSecond
						$("#second").html($currentSecond);
					}, 1000);
				}
				else
				{
					// ������clover��waitting��
					$("#hiddenDiv").css({
						"top":$(".payTypeDiv:eq(1)").offset().top,
						"left":$(".payTypeDiv:eq(1)").offset().left,
						"line-height":($(".payTypeDiv:eq(0)").height()+1)/2+"px"
					})

					$("#hiddenDiv").show();
					$(".hiddenDivInnerDiv").hide();
					$("#forClover").show();
					$SecondCountDown = setInterval(function(){
						$currentSecond = $("#CloverSecond").html()*1-1;
						$currentSecond = $currentSecond <0?0:$currentSecond
						$("#CloverSecond").html($currentSecond);
						if($currentSecond==0)
						{
							clearInterval($SecondCountDown);
							clearInterval($payStatus);
						}
					}, 1000);
				}
			},
			success:function(data) {
				console.log(data)
				if(data.resultCode==0)
				{
					if(isClover==1)
					{
						$getTimes=0;
						$payStatus = setInterval(function(){
							$getTimes++;
							console.log($getTimes)
							$maxTimes = cloverTimeOutSecond/2
							if($getTimes>=$maxTimes-2)
							{
								callHostPost("resetKiosk", {"data":"1"} ) ;
								$("#hiddenDiv").hide();
								clearInterval($SecondCountDown);
								clearInterval($payStatus);
								//$type=0; // ״̬��Ϊ0��������ɨ��
								showDialog("Pay Time Out");
								$scanType=1
							}
							else
							{
								try
								{
									var result = JSON.parse(callHostPost("getPayStatus", {"data": "1"}));
									console.log(result)
									if(result.resultCode==0)
									{
										$("#hiddenDiv").hide();
										clearInterval($SecondCountDown);
										clearInterval($payStatus);
										//$type=0; // ״̬��Ϊ0��������ɨ��
										window.location.href="last.html"
									}
									else if(result.resultCode==3)
									{
										$("#hiddenDiv").hide();
										clearInterval($SecondCountDown);
										clearInterval($payStatus);
										callHostPost("resetKiosk", {"data":"1"} ) ;
										//$type=0; // ״̬��Ϊ0��������ɨ��
										showDialog(result.message==""?"Pay Failed":result.message);
										$scanType=1
									}
								}
								catch
								{
									showDialog("Pay failed please try again.");
								}
							}
						}, 2000);
					}
					else
					{
						window.location.href="last.html"
					}
				}
				else
				{
					if(funcName=="giftCard")
					{
						showDialog(data.errorMessage)
					}
					else if(funcName=="alipay")
					{
						showDialog("Pay failed please try again.");
					}
					else
					{
						showDialog(data.message);
					}
					$("#hiddenDiv").hide();
					clearInterval($SecondCountDown);
					clearInterval($payStatus);
				}
			},
			error:function (data) {
				showDialog("Pay failed please try again.")
			},
			complete:function (data) {
				if(isClover!=1)
				{
					$("#hiddenDiv").hide();
					clearInterval($SecondCountDown);
					$scanType=1; // ״̬��Ϊ1��������ɨ��
					$barcode="";
				}
			}
		})
	}
	catch
	{
		console.log("123")
		showDialog("Pay failed please try again.")
	}
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

function callHostGet(command, parameters) {
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
	  request.open('GET', 'http://localhost:8080/kiosk/'+command, false);
	  request.send(qs);

	  if (request.status === 200)
		return request.responseText;
	  else
		return '!error ' + request.status;
	}
