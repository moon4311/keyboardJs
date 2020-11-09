/**
 * TODO
 * 1. 연속 모음 입력처리
 * 2. 받침 입력 처리
 * 3. 기능키 처리 (shift, backspace, enter)
 * 
 */

var on = "on";

var startKeyList = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
var middleKeyList = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
var endKeyList = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

var sChar = "가".charCodeAt(0).toString(16); //ac00
var eChar = "힣".charCodeAt(0).toString(16); //d7ac

var trgt;
$(document).ready(function(){
	$(".case2").hide();
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
			if(startKeyList.indexOf(char)>-1){
				trgt.val(trgt.val()+char);
			}else{
				var rslt= toHanGul(
						startKeyList.indexOf(val),
						middleKeyList.indexOf(char)
						);
				var valLen = trgt.val().length;
				trgt.val(trgt.val().substr(0,valLen-1)+rslt);
			}

		//한글이 아닐 떄
		}else if(44032 > cVal || 55199 < cVal){
			trgt.val(trgt.val()+char);
			return;
	
		}else{		//한글일떄
			var t3 = (cVal - 44032) %28; //종성
			var t2 = (cVal - 44032 -t3)/28 % 21; //중성
			var t1 = (((cVal-44032 -t3)/28)-t2) / 21; //초성
			
			//받침 넣기
			if(t3==0 && endKeyList.indexOf(char)>-1){
				t3 = endKeyList.indexOf(char);
				cVal += t3;
				var rslt = String.fromCharCode(cVal);
				fnModHanGul(rslt);
			//다음 글자 입력
			}else if(startKeyList.indexOf(char)>-1){
				trgt.val(trgt.val()+char);
			//받침 뺴서 자음으로 넣기
			}else if(middleKeyList.indexOf(char)>-1){
				cVal -= t3;
				var rslt = String.fromCharCode(cVal);
				var startKey = endKeyList[t3];
				rslt += toHanGul(startKeyList.indexOf(startKey),middleKeyList.indexOf(char));
				fnModHanGul(rslt);
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

function fnModHanGul(rslt){
	var str = trgt.val();
	var len = str.length;
	trgt.val( str.substr(0,len-1)+rslt);
}

function fnkey(key){
	switch (key) {
	case "shift":
		if($("#shift").hasClass("on")){
			$("#shift").removeClass("on");
			$(".case2").hide();
			$(".case1").show();
		}else{
			$("#shift").addClass("on");
			$(".case1").hide();
			$(".case2").show();
		}
		break;
	case "backspace":
		var s = trgt.val();
		trgt.val(s.substr(0,s.length-1));
		trgt.focus();
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