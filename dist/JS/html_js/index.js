$(function(){
	$.cookie('flag',1); // ��ʾû�л�ȡkioskParameter
	$("#mydialog").load("dialogModel.html")

	$("#toStart").click(function(){
		window.location.href="DineInOrToGo.html";
	})

	$("#addPoints").click(function(){
		window.location.href="uploadTrans.html";
	})

	try
	{
		if(getQueryString().cancel!=undefined)
		{
			JSON.parse(callHostGet("cancelTransaction"))
		}
	}catch{}

	if($.cookie('flag') == 1)
	{
		getParameter();
	}

	// ��������Ա����
	$LBtn = 0; // ��ʾ���ఴť�Ƿ񱻵���
	$RBtn = 0; // ��ʾ���ఴť�Ƿ񱻵���
	$(".managermentBtn").click(function(){
		$index = $(".managermentBtn").index($(this));
		if($index==0){
			$LBtn = Date.parse(new Date())/1000;
		}
		else{
			$RBtn = Date.parse(new Date())/1000;
		}
		if(Math.abs($LBtn-$RBtn) <=5){
			window.location.href="managerLogin.html";
		}
	});
	$(".adminBtn").click(function(){
		$index = $(".adminBtn").index($(this));
		if($index==0){
			$LBtn = Date.parse(new Date())/1000;
		}
		else{
			$RBtn = Date.parse(new Date())/1000;
		}
		if(Math.abs($LBtn-$RBtn) <=5){
			window.location.href="admin.html";
		}
	});
	let idx = 2;
	setInterval(function(){
		$('.background').attr('src', 'src/img/bg' + idx + '.jpg');
		if(idx < 3){
			idx ++;
		}else{
			idx = 1;
		}
	}, 10000)
})

// ����kiosk�Ĳ���
function getParameter()
{
	$.ajax({
		method:"post",
		url:"http://localhost:8080/kiosk/getMeetFreshParameter",
		data:{"data":""},
		async:true,
		beforeSend: function () {
			$(".foot_menu_div").hide();
		},
		success:function(data) {
			try
			{
				console.log(data)
				if(data.code==0)
				{
					var errorMessage ="";
					data.result.citcon.timeOut=60
					$.cookie('citcon',data.result.citcon.timeOut);
					$.cookie('clover',data.result.clover.timeOut);
					$.cookie('spoonity',data.result.spoonity.timeOut);
					if(!data.result.citcon.timeOut)
						errorMessage+="param citcon.timeOut is empty <br />";
					if(!data.result.clover.timeOut)
						errorMessage+="param clover.timeOut is empty <br />";
					if(!data.result.spoonity.timeOut)
						errorMessage+="param spoonity.timeOut is empty <br />";
					if(errorMessage!="")
					{
						showDialog(errorMessage);
					}
					else
					{
						$.cookie('flag',0)
						$(".foot_menu_div").show();
					}
				}
				else
				{
					showDialog("Get Parameter Failed failed.");
				}

			}
			catch
			{
				showDialog("Get Parameter Failed failed.");
			}
		},
		error:function (data) {

		},
		complete:function (data) {

		}
	})
}

// �õ�get��ֵ
function getQueryString() {
	 //���Ȼ�ȡ��ַ
			var url = url || window.location.href;
			//��ȡ��ֵ
			var arr = url.split("?");
			//�ж��Ƿ��д�ֵ
			if(arr.length == 1){
				return null;
			}
			//��ȡget��ֵ�ĸ���
			var value_arr = arr[1].split("&");
			//ѭ�����ɷ��صĶ���
			var obj = {};
			for(var i = 0; i < value_arr.length; i++){
				var key_val = value_arr[i].split("=");
				obj[key_val[0]]=key_val[1];
			}
			return obj;
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
