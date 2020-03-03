function myMarquee($dom){
	$position=$dom.scrollLeft();
	$position++
	$dom.scrollLeft($position)
	if($dom.scrollLeft()!=$position)
	{
		window.setTimeout(function(){},10000)
		$dom.scrollLeft(0);
	}

}

function marqueeTimeOut($dom)
{
	var t=window.setInterval(function(){ myMarquee($dom)},100);
}

function autoCancelTrans()
{
	$('.countdown').remove();
	let countdown = $('<div class="countdown"></div>').css({
	    'position': 'absolute',
	    'width': '200px',
	    'height': '200px',
	    'left': 'calc(50% - 100px)',
	    'top': 'calc(50%)',
	    'border-radius': '50%',
	    'font-size': '100px',
	    'font-weight': '800',
		'display': 'none',
		'text-align': 'center',
		'background': '#faa',
		'line-height': '190px',
		'z-index': '10',
		'opacity': '1'
	});
	let layout = $('<div class="layout"></div>').css({
		'position': 'absolute',
		'width': '100%',
		'height': '100%',
		'background': 'rgba(0, 0, 0, 0.7)',
		'top': '0',
		'display': 'none'
	});
	let alertDiv = $('<div class="alertDiv">Are you still there?</div>').css({
		'position': 'absolute',
		'width': '80%',
		'height': '40%',
		'top': '0',
		'background': 'white',
		'border-radius': '40px',
		'top': '30%',
		'left': '10%',
		'text-align': 'center',
		'font-size': '80px',
		'padding-top': '100px',
		'display': 'none'
	})
	$('body').append(countdown);
	$('body').append(layout);
	$('body').append(alertDiv);
	let timeleft = 60 * 2; // 3 mins idle
	$(document).idleDetection({
	  onIdle: function() {
		  if((timeleft <= 10) && (timeleft > 0)){
			  $('.countdown').text(timeleft);
			  countdown.css({'display': 'block'});
			  layout.css({'display': 'block'});
			  alertDiv.css({'display': 'block'});
		  }else if(timeleft == 0){
			  window.location.href="index.html?cancel=1"
		  }else{

		  }
		  timeleft --;
	  },
	  onHide: function() {
		  //console.log('Hide');
	  },
	  onActive: function() {
		  //console.log('Active');
		  countdown.css({'display': 'none'});
		  layout.css({'display': 'none'});
		  alertDiv.css({'display': 'none'});
		  timeleft = 60 * 2;
	  },
	  onShow: function() {
		  //console.log('Show');
	  },
	  idleCheckPeriod: 1000
	});
}

function showDialog($message)
{
	$("#messsageDiv").html($message);
	$("#mydialog").modal()
}
