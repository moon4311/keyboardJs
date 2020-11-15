$(document).ready(function(){
	
	var s = sessionStorage['onoff'];
	if(s){
		$("input[value="+s+"]").attr("checked","checked");
	}
	
	$("[name=switch]").on("change",function(){
		var onoff = $("[name=switch]:checked").val();
		sessionStorage['onoff']=onoff;
	});
});