/**
 * 
 */

var on = "on";

var startKeyList = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
var middleKeyList = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
var endKeyList = "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

var sChar = "가".charCodeAt(0).toString(16); //ac00
var eChar = "힣".charCodeAt(0).toString(16); //d7ac

var trgt;
$(document).ready(function(){
	
	$("input[type=text]").on("focus",function(){
		trgt = $(this);
	});
	$("#test").focus();

	//unicode를 문자로 변환하는 방법
	//String.fromCharCode(parseInt("문",16));
	//((초성 * 21) + 중성) * 28 + 종성 + 0xAC00
	
	
	$(".key").on("mousedown",function(e){
		e.defaultPrevent;
		
		
		//마지막 글자
		var val = trgt.val().substr(-1);
		var cVal = val.charCodeAt(0);
		
		//추가할 글자
		var char = $(this).text();
		var cChar = char.charCodeAt(0);
		
		if($(this).hasClass("fkey")){
			fnkey($(this).attr("id"));
			return;
		}
		$(this).addClass(on);
		
		//공백일 때, 추가할 문자가 한글이 아닐 떄
		if(val=="" || val==" " || (startKeyList.indexOf(char)==middleKeyList.indexOf(char))){
			trgt.val(trgt.val()+char);
		//자음만 있을 때
		}else if(startKeyList.indexOf(val)>-1){
			var rslt= toHanGul(
					startKeyList.indexOf(val),
					middleKeyList.indexOf(char)
					);
			var valLen = trgt.val().length;
			trgt.val(trgt.val().substr(0,valLen-1)+rslt);

		//한글이 아닐 떄
		}else if(44032 > cVal || 55199 < cVal){
			trgt.val(trgt.val()+char);
			return;
	
		}else{		//한글일떄
			console.log(cVal);
			//초성  (x - 44032)/ (21 * 28)
			var c1 = (cVal - 44032)/(21 * 28);
			//중성  (x - 44032 - (초성 * 21 * 28))/28
			var c2 = (cVal - 44032-(c1 * 21 * 28))/28;
			//종성  (x - 44032 - (초성 * 21 * 28) - (중성 * 28 ))
			var c3 = (cVal - 44032-(c1 * 21 * 28)-(c2 * 28));
			
			console.log(c1);
			console.log(c2);
			console.log(c3);
		
			
			//1.자음만 있는 상태
			var sKey = startKeyList.indexOf(val);
//			if( "ㄱ" <= hVal && hval <= "ㅎ"  ){
			if( startKeyList.indexOf(val) >-1){
				
			}
			
			//자음 모음 구분
			if(idx2>-1){
				var rslt = ((idx1*21)+idx2)*28+0+0xAC00;
				rslt = String.fromCharCode(rslt);
				trgt.val(rslt);
			}else{
				trgt.val(trgt.val()+s);
			}
			
		}
		
		return false;
	});
	
	$(".key").on("mouseup",function(e){
		e.defaultPrevent;
		if($(this).hasClass("fkey")){
			return false;
		}
		$(this).removeClass(on);
		var s = $(this).text();
		return false;
	});
});

function fnkey(key){
	switch (key) {
	case "shift":
		if($("#shift").hasClass("on")){
		}
		
		console.log("shift");
		break;
	case "backspace":
		console.log("backspace");
		break;
	case "enter":
		console.log("enter");
		break;

	default:
		break;
	}
}


function toHanGul(idx1,idx2,idx3){
	idx1 = idx1 || 0;
	idx2 = idx2 || 0;
	idx3 = idx3 || 0;
	
	var rslt = ((idx1*21)+idx2)*28+idx3+0xAC00;
	rslt = String.fromCharCode(rslt);
	return rslt;
}

// 문자열을 unicode로 변환하는 방법
function charToUnicode(str) {
  if (!str) return false; // Escaping if not exist
  var unicode = '';
  for (var i = 0, l = str.length; i < l; i++) {
    unicode += '\\' + str[i].charCodeAt(0).toString(16);
  };
  return unicode;
}