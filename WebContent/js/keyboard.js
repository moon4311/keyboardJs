/**
 *  앞자 받침이 ㄱ,ㄴ,ㄹ,ㅂ 일 때 1,4,8,17
 *  ㄱ - ㅅ
 *  ㄴ - ㅈㅎ
 *  ㄹ - ㄱㅁㅂㅅㅍㅎ
 *  ㅂ - ㅅ
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
			
			//복함모음
			if(t3==0 && t2>0 && middleKeyList.indexOf(char)>-1){
				console.log("복합모음");
				switch (t2) {
				case 8: //ㅗ
					if(char=='ㅏ') cVal += 1*28;
					if(char=='ㅐ') cVal += 2*28;
					if(char=='ㅣ') cVal += 3*28;
					break;
				case 13: //ㅜ
					if(char=='ㅓ') cVal += 1*28;
					if(char=='ㅔ') cVal += 2*28;
					if(char=='ㅣ') cVal += 3*28;
					break;
				case 18: //ㅡ
					if(char=='ㅣ') cVal += 1*28;
					break;
				default:
					break;
				}
				fnModHanGul(String.fromCharCode(cVal));
				return;
			//받침 넣기
			}else if(t3==0 && endKeyList.indexOf(char)>-1){
				console.log("받침넣기");
				t3 = endKeyList.indexOf(char);
				cVal += t3;
				fnModHanGul(String.fromCharCode(cVal));
				return;
			//복합받침
			}else if(t3==1||t3==4||t3==8||t3==17){ //ㄱ,ㄴ,ㄹ,ㅂ
				console.log("복합받침");
				switch (t3) {
				case 1: //ㄱ
					if(char=='ㅅ') cVal += 2;
					else 
						return trgt.val(trgt.val()+char);
					break;
				case 4://ㄴ
					if(char=='ㅈ') cVal += 1;
					else if(char=='ㅎ') cVal += 2;
					else return trgt.val(trgt.val()+char);
					break;
				case 8: //ㄹ
					if(char=='ㄱ') cVal += 1;
					else if(char=='ㅁ') cVal += 2;
					else if(char=='ㅂ') cVal += 3;
					else if(char=='ㅅ') cVal += 4;
					else if(char=='ㅌ') cVal += 5;
					else if(char=='ㅍ') cVal += 6;
					else if(char=='ㅎ') cVal += 7;
					else return trgt.val(trgt.val()+char);
					break;
				case 17: //ㅂ
					if(char=='ㅅ') cVal += 1;
					else return trgt.val(trgt.val()+char);
					break;
				default:
					return trgt.val(trgt.val()+char);
					break;
				}
				fnModHanGul(String.fromCharCode(cVal));
			//다음 글자 입력
			}else if(startKeyList.indexOf(char)>-1){
				trgt.val(trgt.val()+char);
			//받침 뺴서 자음으로 넣기
			}else if(middleKeyList.indexOf(char)>-1){
				var minus = t3;
				var startKey = endKeyList[t3];
				
				switch (t3){
				case 3: //ㄳ
					minus=2;	startKey = "ㅅ";
					break;
				case 5: //ㄵ
					minus=1;	startKey = "ㅈ";
					break;
				case 6:	//ㄶ
					minus=2;	startKey = "ㅎ";
					break;
				case 9: //ㄺ
					minus=1;	startKey = "ㄱ";
					break;
				case 10: //ㄻ
					minus=2;	startKey = "ㅁ";
					break;
				case 11: //ㄼ
					minus=3;	startKey = "ㅂ";
					break;
				case 12: //ㄽ
					minus=4;	startKey = "ㅅ";
					break;
				case 13: //ㄾ
					minus=5;	startKey = "ㅌ";
					break;
				case 14: //ㄿ
					minus=6;	startKey = "ㅍ";
					break;
				case 15: //ㅀ
					minus=7;	startKey = "ㅎ";
					break;
				default: 
					break;
				}
				cVal -= minus;
				var rslt = String.fromCharCode(cVal);
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
	case "space":
		trgt.val(trgt.val()+" ");
		break;
	case "open":
		$(".wrap").show();
		break;
	case "close":
		$(".wrap").hide();
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