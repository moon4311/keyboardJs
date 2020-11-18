
var body = document.getElementsByTagName("body")[0];
/* keyboard key */
var row1 = [1,2,3,4,5,6,7,8,9,0];
var row2 = ["ㅂ","ㅈ","ㄷ","ㄱ","ㅅ","ㅛ","ㅕ","ㅑ","ㅐ","ㅔ","backspace"];
var row3 = ["ㅃ","ㅉ","ㄸ","ㄲ","ㅆ","ㅛ","ㅕ","ㅑ","ㅒ","ㅖ","backspace"];
var row4 = ["ㅁ","ㄴ","ㅇ","ㄹ","ㅎ","ㅗ","ㅓ","ㅏ","ㅣ","enter"];
var row5 = ["ㅋ","ㅌ","ㅊ","ㅍ","ㅠ","ㅜ","ㅡ",",",".","/"];
var row6 = [" ","close"];

var startKeyList = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
var middleKeyList = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
var endKeyList = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";
var sChar = "가".charCodeAt(0); //44032
var eChar = "힣".charCodeAt(0); //55203
var trgt;
var closeKeyboard = sessionStorage['closeKeyboard'];

function fnMakeRow(arr,rowClss){
	tag='<div class="row '+ rowClss +'">';
	arr.forEach(function(a,b){
		var keyclss="";
		if(a.length>1){
			keyclss = 'fkey';
		}
		if(typeof(a)=="number"){
			keyclss= 'num';
		}
		tag += '<div id="'+a+'" class="key '+ keyclss +'">'+a+'</div>';
	});
	tag+='</div>';
	return tag;
}

var keyboard='<div class="wrap" style="display:none;">'
	+ fnMakeRow(row1)
	+ fnMakeRow(row2,"case1")
	+ fnMakeRow(row3,"case2")
	+ fnMakeRow(row4)
	+ fnMakeRow(row5)
	+ fnMakeRow(row6)
	+ '</div>';

var el = document.createElement("div");
el.className="keyboard_jm";
el.innerHTML=keyboard;
body.append(el);

/**
 *  앞자 받침이 ㄱ,ㄴ,ㄹ,ㅂ 일 때 1,4,8,17
 *  ㄱ - ㅅ
 *  ㄴ - ㅈㅎ
 *  ㄹ - ㄱㅁㅂㅅㅍㅎ
 *  ㅂ - ㅅ
 */

var on = "on";

$(document).ready(function(){
	$(".case2").hide();
	$("input[type=text],input[type=search]").on("focus",function(){
		//console.log(closeKeyboard);
		if(!closeKeyboard){
			$(".wrap").show();
		}
		trgt = $(this);
	});

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
		}else if(sChar > cVal || eChar < cVal){
			fnAddChar(char);
			return;
	
		}else{		//한글일떄
			var cVal2 = cVal - sChar;
			var t3 = (cVal2) %28; //종성
			var t2 = (cVal2 - t3)/28 % 21; //중성
			var t1 = (((cVal2 - t3)/28)-t2) / 21; //초성
			
			//복함모음
			if(t3==0 && t2>0 && middleKeyList.indexOf(char)>-1){
				if(middleKeyList[t2]==char){
					fnAddChar(char);
					return;
				}
				switch (t2){
				case 8: //ㅗ
					if(char=='ㅏ') cVal += 1*28;
					else if(char=='ㅐ') cVal += 2*28;
					else if(char=='ㅣ') cVal += 3*28;
					else return fnAddChar(char);
					break;
				case 13: //ㅜ
					if(char=='ㅓ') cVal += 1*28;
					else if(char=='ㅔ') cVal += 2*28;
					else if(char=='ㅣ') cVal += 3*28;
					else return fnAddChar(char);
					break;
				case 18: //ㅡ
					if(char=='ㅣ') cVal += 1*28;
					else return fnAddChar(char);
					break;
				default:
					return fnAddChar(char);
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
		closeKeyboard = true;
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