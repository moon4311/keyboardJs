
var body = document.getElementsByTagName("body")[0];

var keyboardTag='<div class="wrap">'
	+'<div class="row">'
		+'<div class="key num">1</div>'
		+'<div class="key num">2</div>'
		+'<div class="key num">3</div>'
		+'<div class="key num">4</div>'
		+'<div class="key num">5</div>'
		+'<div class="key num">6</div>'
		+'<div class="key num">7</div>'
		+'<div class="key num">8</div>'
		+'<div class="key num">9</div>'
		+'<div class="key num">0</div>'
	+'</div>'
	+'<div class="row case1"> '
		+'<div class="key">ㅂ</div>'
		+'<div class="key">ㅈ</div>'
		+'<div class="key">ㄷ</div>'
		+'<div class="key">ㄱ</div>'
		+'<div class="key">ㅅ</div>'
		+'<div class="key">ㅛ</div>'
		+'<div class="key">ㅕ</div>'
		+'<div class="key">ㅑ</div>'
		+'<div class="key">ㅐ</div>'
		+'<div class="key">ㅔ</div>'
		+'<div class="key fkey" id="backspace">Backspace</div>'
	+'</div>'
	+'<div class="row case2"> '
		+'<div class="key">ㅃ</div>'
		+'<div class="key">ㅉ</div>'
		+'<div class="key">ㄸ</div>'
		+'<div class="key">ㄲ</div>'
		+'<div class="key">ㅆ</div>'
		+'<div class="key">ㅛ</div>'
		+'<div class="key">ㅕ</div>'
		+'<div class="key">ㅑ</div>'
		+'<div class="key">ㅒ</div>'
		+'<div class="key">ㅖ</div>'
		+'<div class="key fkey" id="backspace">Backspace</div>'
	+'</div>'
	+'<div class="row"> '
		+'<div class="key">ㅁ</div>'
		+'<div class="key">ㄴ</div>'
		+'<div class="key">ㅇ</div>'
		+'<div class="key">ㄹ</div>'
		+'<div class="key">ㅎ</div>'
		+'<div class="key">ㅗ</div>'
		+'<div class="key">ㅓ</div>'
		+'<div class="key">ㅏ</div>'
		+'<div class="key">ㅣ</div>'
		+'<div class="key fkey" id="enter">Enter</div>'
	+'</div>'
	+'<div class="row"> '
		+'<div class="key fkey" id="shift">Shift</div>'
		+'<div class="key">ㅋ</div>'
		+'<div class="key">ㅌ</div>'
		+'<div class="key">ㅊ</div>'
		+'<div class="key">ㅍ</div>'
		+'<div class="key">ㅠ</div>'
		+'<div class="key">ㅜ</div>'
		+'<div class="key">ㅡ</div>'
		+'<div class="key">,</div>'
		+'<div class="key">.</div>'
		+'<div class="key">/</div>'
		+'</div>'
		+'<div class="row"> '
		+'<div class="key fkey" id="space">&nbsp;&nbsp;&nbsp;</div>'
		+'<div class="key fkey" id="close">X</div>'
		+'</div>'
	+'</div>';

var el = document.createElement("div");
el.className="keyboard_jm";
el.innerHTML=keyboardTag;
body.append(el);

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
			fnAddChar(char);
		//자음만 있을 때
		}else if(startKeyList.indexOf(val)>-1){
			if(startKeyList.indexOf(char)>-1){
				fnAddChar(char);
			}else{
				var rslt= toHanGul(
						startKeyList.indexOf(val),
						middleKeyList.indexOf(char)
						);
				
				fnModHanGul(rslt);
			}

		//한글이 아닐 떄
		}else if(44032 > cVal || 55199 < cVal){
			fnAddChar(char);
			return;
	
		}else{		//한글일떄
			var cVal2 = cVal - 44032;
			var t3 = (cVal2) %28; //종성
			var t2 = (cVal2 - t3)/28 % 21; //중성
			var t1 = (((cVal2 - t3)/28)-t2) / 21; //초성
			
			//복함모음
			if(t3==0 && t2>0 && middleKeyList.indexOf(char)>-1){
				if(middleKeyList[t2]==char){
					fnAddChar(char);
					return;
				}
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
				t3 = endKeyList.indexOf(char);
				cVal += t3;
				fnModHanGul(String.fromCharCode(cVal));
				return;
			//복합받침
			}else if( (t3==1||t3==4||t3==8||t3==17) && startKeyList.indexOf(char)>-1){ //ㄱ,ㄴ,ㄹ,ㅂ
				switch (t3) {
				case 1: //ㄱ
					if(char=='ㅅ') cVal += 2;
					else 
						return fnAddChar(char);
					break;
				case 4://ㄴ
					if(char=='ㅈ') cVal += 1;
					else if(char=='ㅎ') cVal += 2;
					else return fnAddChar(char);
					break;
				case 8: //ㄹ
					if(char=='ㄱ') cVal += 1;
					else if(char=='ㅁ') cVal += 2;
					else if(char=='ㅂ') cVal += 3;
					else if(char=='ㅅ') cVal += 4;
					else if(char=='ㅌ') cVal += 5;
					else if(char=='ㅍ') cVal += 6;
					else if(char=='ㅎ') cVal += 7;
					else return fnAddChar(char);
					break;
				case 17: //ㅂ
					if(char=='ㅅ') cVal += 1;
					else return fnAddChar(char);
					break;
				default:
					return fnAddChar(char);
					break;
				}
				fnModHanGul(String.fromCharCode(cVal));
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
			//다음 글자 입력
			}else{
				fnAddChar(char);
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

function fnAddChar(char){
	trgt.val(trgt.val()+char);
}

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