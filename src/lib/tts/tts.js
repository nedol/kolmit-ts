var ttsLIMIT = 500;
var synth = window.speechSynthesis;
var mailer_path = "";
var mailer_type =   "asp"; // htm
var EXP = 365; //will expire in 365 days
var dmn = "//"+location.host; 
var FReady=0;
var fIE    = (window.showModalDialog ? true : false);
var fNS4   = !(GEBI);
var TheVolume=10;
var newText = "";
var FirstLoop = 0;
var EVENT = null;
var theSID = "";
var theUL = "";
var DetLangCode="";
var DetLangName="";
var RXlang="";
var TEMPLANGS = "";
var GLOB_EVENT = "";
var RANGE_START = 0;
var RANGE_END = 0;

var PAIRLIST = ["Afrikaans","Albanian","Amharic","Arabic","Armenian","Azerbaijani","Basque","Belarusian","Bengali","Bosnian","Bulgarian","Catalan","Cebuano","Chichewa","Chinese Simp","Chinese Trad","Corsican","Croatian","Czech","Danish","Dutch","English","Esperanto","Estonian","Filipino","Finnish","French","Frisian","Galician","Georgian","German","Greek","Gujarati","Haitian Creole","Hausa","Hawaiian","Hebrew","Hindi","Hmong","Hungarian","Icelandic","Igbo","Indonesian","Irish","Italian","Japanese","Javanese","Kannada","Kazakh","Khmer","Korean","Kurdish","Kyrgyz","Lao","Latin","Latvian","Lithuanian","Luxembourgish","Macedonian","Malagasy","Malay","Malayalam","Maltese","Maori","Marathi","Mongolian","Myanmar","Nepali","Norwegian","Pashto","Persian","Polish","Portuguese","Punjabi","Romanian","Russian","Samoan","Scots Gaelic","Serbian","Sesotho","Shona","Sindhi","Sinhala","Slovak","Slovenian","Somali","Spanish","Sudanese","Swahili","Swedish","Tajik","Tamil","Telugu","Thai","Turkish","Ukrainian","Urdu","Uzbek","Vietnamese","Welsh","Xhosa","Yiddish","Yoruba","Zulu"];
var ids = ["af","sq","am","ar","hy","az","eu","be","bn","bs","bg","ca","ceb","ny","zh","zt","co","hr","cs","da","nl","en","eo","et","tl","fi","fr","fy","gl","ka","de","el","gu","ht","ha","haw","iw","hi","hmn","hu","is","ig","id","ga","it","ja","jw","kn","kk","km","ko","ku","ky","lo","la","lv","lt","lb","mk","mg","ms","ml","mt","mi","mr","mn","my","ne","no","ps","fa","pl","pt","pa","ro","ru","sm","gd","sr","st","sn","sd","si","sk","sl","so","es","su","sw","sv","tg","ta","te","th","tr","uk","ur","uz","vi","cy","xh","yi","yo","zu"];

var LOCALTTS_V = "en,es,ru,de,pt,fr,it,ko,ja,zh-CN,zh-TW";             
var GTTS_V = "ar,cs,da,nl,fi,el,hi,hu,no,pl,sk,sv,th,tr,la,bn,id,km,uk,vi";
    ALLTTS_V = GTTS_V+","+LOCALTTS_V;

var WorkingLangs = "en,es,fr,it,de,hi,id,nl,ru,pt,ko,zh,ja,pl";

 var cyrillicPattern = /[\u0400-\u04FF]|[0-9]/;
 var englishPattern = /[a-zA-Z]|[0-9]/;
 var koreanPattern = /[\u3130-\u318F\uAC00-\uD7AF]|[0-9]/;
 var japanesePattern = /[ぁ-ゔ]|[ァ-ヴー]|[ａ-ｚＡ-Ｚ０-９]|[々〆〤]|[0-9]/;
 var chinesePattern = /[\u4E00-\u9FFF\u3400-\u4DFF]|[0-9]/;
 var westernPattern = /[\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]/;


        var BR = "";
	var OS = "";
	var AN = "";
	var FL = "";


if(synth)synth.cancel();







function Browser () {
   var userAgent = navigator.userAgent.toLowerCase ();
   this.major    = parseInt (navigator.appVersion);
   this.version  = parseFloat (navigator.appVersion);
	if (userAgent.indexOf ("safari") >= 0) {
      this.sfr    = true;
   }
   else if (userAgent.indexOf ("opera") >= 0) {
      this.opera = true;
   }
   else if (userAgent.indexOf ("msie") >= 0) {
      this.ie    = true;
   }
   else if (userAgent.indexOf ("mozilla") >= 0) {
      this.ns    = true;
      this.ns4   = (this.version >= 4 && this.version < 5);
   }
   this.win      = (userAgent.indexOf ("win") >= 0);
   this.mac      = (userAgent.indexOf ("mac") >= 0);
   this.unix     = (userAgent.indexOf ("x11") >= 0);
   this.lineSep  = (this.mac ? '\r' : '\n');
   this.ie6SP2   = (userAgent.indexOf("sv1") != -1)
   
}

var browser = new Browser ();




window.addEventListener("load",function(event){
	if(GEBI('TTSText').value!="") speechClose();
	EVENT = event;	
},!1);


(function(){document.addEventListener("paste",function(){
	setTimeout(function(){  
		RangeTextNow();
	}, 300);
},!1);} )();


(function(){document.addEventListener("mousedown",function(){
   GLOB_EVENT = event;
   var id = event.target.id;
   if(GEBI("myRange")){
	if(getCookie("volume")==null || getCookie("volume")=="undefined" || getCookie("volume")=="") setCookie("volume","5");
	else setCookie("volume",GEBI("myRange").value);
	if(GEBI("myRange").value==0) GEBI("volume").className="novolume";
	else GEBI("volume").className="volume";
	TheVolume = GEBI("myRange").value;
   }	


   if(id == "TTSText" || id=="TTSLangs" || id=="spd" || id == "ttsgo"){
	speechClose();
/*
        if(window.frames['speech']){
		var a = speech.document.getElementById("PAGE").contentDocument.getElementsByTagName('audio');
		for(j=0; j<a.length; j++){
		    a[j].pause();
		}
	}
*/
   }	

/*
   if(id == "textarea" || id == "ttsgo" || id == "justmsg"){
	if(GEBI("textarea")) GEBI('TTSText').value = GEBI("textarea").value;
   }	
*/
   if(id == "textarea" || id == "ttsgo" || id == "justmsg"){
	if(GEBI("textarea")) GEBI('TTSText').value = GEBI("textarea").value;
	getCaretText(event);
   }	
   if(id == "controls"){
	FirstLoop = 0;
	PlayPause("controls", event);
   }	

   if(id == "volume"){
	GEBI("myRange").value = 10;
	GEBI("volume").className="volume";
   }	


},!1);} )();


(function(){document.addEventListener("mouseup",function(){
   var id = event.target.id;
   if(id == "textarea"){
//	GEBI("textarea").focus();
	if(synth)synth.cancel();
	openMe();
   }	
},!1);} )();






setCookie("advr",0);

function GEBI(id){return document.getElementById(id);}

function setCookie(name, value, expires, path, domain, secure)
{
    document.cookie= name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

function getCookie(name)
{

    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1)
    {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
    {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}

function deleteCookie(name, path, domain)
{
    if (getCookie(name))
    {
        document.cookie = name + "=" + 
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}



function Baner300x250(){}



function TTS_OnOff(dir){
var DRS = dir.split("/");
var ob = new Array();
ob[0]='tts_source';
ob[1]='tts_target';
 for (var i=0; i<2; i++){
  if(DRS[i] == "zh" || DRS[i] == "en" || DRS[i] == "enf" || DRS[i] == "fr" || DRS[i] == "de" || DRS[i] == "it" || DRS[i] == "ja" || DRS[i] == "ko" || DRS[i] == "pt" || DRS[i] == "ru" || DRS[i] == "es")	
	GEBI(ob[i]).style.display='block';
  else  GEBI(ob[i]).style.display='none';
 }
}


function getNewSubmitForm(){
 var submitForm = document.createElement("FORM");
 document.body.appendChild(submitForm);
 submitForm.method = "POST";
 return submitForm;
}

function createNewFormElement(inputForm, elementName, elementValue){

try{
var newElement = document.createElement("<input name='"+elementName+"' type='hidden'>");
}catch(err){   
var newElement = document.createElement('input');
newElement.setAttribute('type','hidden');
newElement.setAttribute('name',elementName);

}
 
 inputForm.appendChild(newElement);
 newElement.value = elementValue;
 return newElement;
}

function DivAlert(){
	GEBI('divalert').style.display='none';
	GEBI('fog').style.display = 'none'; 
	return false;
}

function OkAlert(){
	GEBI('divalert').style.display='none';
	GEBI('fog').style.display = 'none'; 
	if(GEBI('divalert').outerHTML.indexOf('able to speak')!=-1){
		GEBI("TTSText").value=GEBI("TTSText").value.substring(0,ttsLIMIT);
		ForceTTS();
		setTimeout(function(){  
			DoubleClickBlock();
		}, 300);
	}
	return false;
}

function CustomOkAlert(){
	GEBI('divalert').style.display='none';
	GEBI('fog').style.display = 'none'; 
	GEBI("TTSLangs").value=GetProperCode(RXlang);
	TTStodo('/',SID);
	DoubleClickBlock();
	return false;
}

function CustomOkAlert2(){
	GEBI('divalert').style.display='none';
	GEBI('fog').style.display = 'none'; 
	//DoubleClickBlock();

	if(RXlang == "" && DetLangCode!="") RXlang = DetLangCode;

	GEBI("TTSLangs").value=GetProperCode(RXlang);
	setTimeout(function(){  
		ForceTTS();
	}, 300);
	return false;
}


function GetProperCode(code){   
        var out=code;
	switch(code){
	 	case "hi": out = "g_hi-IN_f"; break;
 		case "id": out = "g_id-ID_f"; break;
	 	case "hl": out = "g_nl-NL_f"; break;
	 	case "pl": out = "g_pl-PL_f"; break;
	}   
	return out;
}

function speechClose(){
 GEBI("justmsg").style.display="block";
 if(document.getElementById('speech')){
  var frame = document.getElementById('speech');
  if(frame)	frame.parentNode.removeChild(frame);
  GEBI("closer").style.display="none";
 }else{
  GEBI("closer").style.display="none";  
 }
 if(synth)synth.cancel();
}




function setCookie2(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}



function speechBuilder(ul,ID,TTSlang,fl){
 var btnState=GEBI("ttsgo").innerHTML;
 if(btnState != "Loading"){
	 DetLangCode="";
	 DetLangName="";
	 var msg="";
	 GEBI('fog').style.display='none';
	 var NEWspeechText = GEBI('TTSText').value; 
	 if (NEWspeechText == "" || NEWspeechText == " " || NEWspeechText == "  " || NEWspeechText == "   " || NEWspeechText == "   " || NEWspeechText == "    "){
		GetCustomAlert("Please enter text: I will read it.<br>",4);	
	 
	 }else{
		var st = TTS_DETECT();
		if(st == "true"){
			DoTTS(ul,ID,TTSlang,fl);
		}
	 }
  }
}


function DoTTS(ul,ID,TTSlang,fl){
  theSID = ID;
  theUL = ul;
	var br=GetBr();
      	//speechClose();
	var speechText="";
	speechText = GEBI('TTSText').value; 
        var p = CheckCursorPos();
	if(p.start==0) {
		RangeTextNow();
	}
	if(br=="firefox" || br=="safari") { NO_SUPPORT_ALERT(br); return false;}

	speed = GEBI('spd').value;
	if(TTSlang != "en" && TTSlang != "zh" && TTSlang != "enf" && TTSlang != "ja" && TTSlang != "ko" && TTSlang != "fr" && TTSlang != "de" && TTSlang != "it" && TTSlang != "pt"  && TTSlang != "ru" && TTSlang != "es"){
	  if(br == "chrome"){
		GEBI("ttsinfo").style.display='none';
		//GEBI("facefake").style.display='none';
		if(speechText==""){
			speechText = GEBI('TTSText').value; 
		}
	     	if(speechText!=""){
			FirstLoop = 0;
	        	GOOGLE_TTS();
			GEBI("controls").className="pause";
	     	}else 	GEBI("ttsgo").innerHTML="Say It";
	  } else NO_SUPPORT_ALERT(br)
	  return false;
	}
	
	

	var speechText="";
	var font='15px';
	var getfont=font;
	speechText = GEBI('TTSText').value; 
	speed = GEBI('spd').value;

	if(getfont != "") font=getfont;

	switch(TTSlang){
	 case 'zh': face = "MiaHead"; voice="VW Lily"; break;
	 case 'en': face = "PeterHead"; voice="VW Paul"; break;
	 case 'enf': face = "AnnaHead"; voice="VW Kate"; break;
	 case 'es': face = "Jason"; voice="Jorge"; break;
	// case 'ru': face = "VoyagerHead"; voice="ScanSoft Katerina_Telecom"; break;
	 case 'ru': face = "VoyagerHead"; voice="Olga"; break;
	 case 'fr': face = "Jessi"; voice="Florence"; break;
	 case 'de': face = "James"; voice="Stefan"; break;
	 case 'it': face = "TonyHead"; voice="Matteo"; break;
	 case 'pt': face = "Jenny"; voice="Gabriela"; break;
	 case 'ja': face = "MiaHead"; voice="VW Misaki"; break;
	 case 'ko': face = "MiaHead"; voice="VW Yumi"; break;
	 default  : face = "PeterHead"; voice="VW Paul"; break;
	}

	//alert(voice);
	var NEWspeechText;
	NEWspeechText=speechText;
	for(var i=0; i<NEWspeechText.length; i++) {
	     if (NEWspeechText.indexOf(".\n")!=-1)           NEWspeechText = NEWspeechText.replace(".\n",". ");
	     if (NEWspeechText.indexOf("\n")!=-1)            NEWspeechText = NEWspeechText.replace("\n"," ");
	}
	
	GEBI('TTSLangs').value=TTSlang;

	GEBI("tURL").style.display="block";

	if(!GEBI("speech")){
	 GEBI("ttsinfo").style.display='none';

	if(NEWspeechText == "" && speechText == ""){
	 GEBI("facefake").style.display="block";
	 GEBI('faceBTN').actName=getCookie("faceName");
	}
	//else GEBI("facefake").style.display="none";


	//setCookie("globalTTStext", unescape(NEWspeechText));



	window.frames['speechbox'].document.getElementById('text').value = "~@~";

	if(newText!="") NEWspeechText=newText.substring(0, ttsLIMIT);



	var submitForm = getNewSubmitForm();
 	createNewFormElement(submitForm, "text", NEWspeechText);
 	submitForm.action= dmn+"/sockets/box.asp";
 	submitForm.target= "speechbox";
 	submitForm.submit();

        var hasMedia=0

    	var frame2 = GEBI('speech');
    	if(frame2)	frame2.parentNode.removeChild(frame2);

    	var die = document.createElement("iframe");
    	die.src = dmn+"/sockets/tts.asp?speed="+speed+"&url="+ul+"&dir="+TTSlang+"&B=1&ID="+ID+"&chr="+face+"&vc="+voice+"&FA="+hasMedia;

    	die.name = "speech";
    	die.id="speech";
    	die.width="460px";
    	die.height="100px";


    	die.frameBorder="0";
    	die.scrolling="no";

    	var obTTS = GEBI('TTSText');
	GEBI('closer').style.display='block';
	GEBI('speech_container').innerHTML="<div align='center' style='width:99%;margin-top:40px;'><b style='color:black'>LOADING, PLEASE WAIT ...</b></div>";
    	obTTS.value = speechText;
	setTimeout(function(){  
		GEBI('speech_container').innerText="";
    		GEBI('speech_container').appendChild(die);
    		GEBI('closer').style.display='block';
		//GLOB_EVENT.preventDefault();
	}, 300);

    	}
//	GEBI("Borders").style.height='540px';
    	change_fontTTS2();
}




function doMailEx(type, frame, el, color, loc)
{

	if(window.kbdShowHide) {
		kbdShowHide (false);
	}

	var query = "?type=" + type;
	if(typeof(mail_title)!='undefined')
		query += "&subj=" + mail_title;
	if(typeof(m_clientName)!='undefined')
		query += "&clientname=" + m_clientName;
		
	if(type == "email") {
		if( m_curFrame != "" ) 
			query +="&ctrl=" + frame + "/"+ el.name;
		else
			query +="&ctrl=" + el.name;
	}
	var url = dmn+"/mailer.asp" 

	if(mailer_type == "htm") {
		url = type + "_form.html"
		if(typeof(RES_LN)!='undefined') {
			url = expandFilebyLang(url, RES_LN);
		}
	}
	else if(mailer_type == "asp") {
	  query += "&do=";
	  	}

	url = mailer_path + url + query;
	var height = 291;
	switch(type)
	{
		case "email":
			height  = 662;
			break;
		case "feedback":
			height  = 690;
			break;
		case "tellafriend":
			height  = 686;
			break;
	}
	url = url + '&sh=' + color+ '&loc=' + loc;
	if(fIE) {
	    var features = "dialogWidth:438px; dialogHeight:" + height +"px;scroll:no;help:no;status:no;";
		var args = { opener: this };
//		dialog = window.showModalDialog (url, args, features);
		dialog = showDialog (url, args, features);

	}
	else {
		dialog = window.open (url, "SendMail", "width=438,height="+height+",toolbar=no,status=no,menubar=no,directories=no,resizable=yes");
	}
	return true;
}


function showDialog (url, args, features) {
   var href = "", ref = url, query = "", arr = url.split ("?");
   if (arr.length > 1) {
      ref = arr [0];
      query = arr [1];
   }
   var sep = ref.lastIndexOf ("/");
   if (sep >= 0) {
      href = ref.substr (0, sep + 1);
      ref = ref.substr (sep + 1);
   }
   args = { opener: this, query : "ref=" + ref + (query ? "&" : "") + query};
   href += "dlgframe.asp" + "?ref=" + ref + (query ? "&" : "") + query;
   //return window.showModalDialog (href, args, features);
try {
   return window.showModalDialog (href, args, features);
		  }
	  catch (err){
	    if(browser.ie6SP2){
	      alert(TEXT_MSG_POPUP);
		  }
		}

}


function doBookmark()
{
if(browser.ie)	window.external.AddFavorite(location.href, document.title);
else alert("Please use 'Ctrl' + 'D' buttons to add this web-site to your favorites");
}

function sleep(){
GEBI('getcode').style.display='block';
GEBI('webmaster').style.display='block';

  var frame2 = GEBI('web_master');
  if(frame2)	frame2.parentNode.removeChild(frame2);

    if(!GEBI("web_master")){
    var die = document.createElement("iframe");
    die.src = dmn+"/webmasters.asp"
    die.name = "web_master";
    die.id="web_master";
    die.width="98%";
    die.height="440px";
    die.frameBorder="0";
    GEBI('webmasterBuilder').appendChild(die);
    }

}

function doCommandTTS (cmd) 
{
  var el = GEBI('TTSText'); 
  return doCommandTTSEx(cmd, el);
}

function doCommandTTSEx(cmd, el)
{
if(!el)	return;
   var textCtrl =  el; // form.text;
    if (browser.ie) {
      textCtrl.createTextRange ().execCommand (cmd);
   }
   else {
      switch (cmd) {
         case "Copy":  copyPasteMsg(); m_clipboard = textCtrl.value; break;
//         case "Paste": copyPasteMsg(); textCtrl.focus (); if(m_clipboard) textCtrl.value = m_clipboard; break;
         case "Delete":textCtrl.focus (); textCtrl.value = " "; newText = ""; break;
//         case "Cut":   copyPasteMsg(); textCtrl.focus (); m_clipboard = textCtrl.value; textCtrl.value = " "; break;
      }
   }
	return true;
}

function copyPasteMsg(){
	if(navigator.userAgent.indexOf("MSIE") == -1) {
		GEBI('divalert').style.display = "block";
		GEBI('fog').style.display = "block";
	}	
}

function change_fontTTS(){
 if (current_font_source == "small"){
	current_font_source = "large";
	GEBI('TTSText').style.fontSize = "20px";
	GEBI('font').src = dmn+"/images/btns/font-s.png";
 }else{
	current_font_source="small";
	GEBI('TTSText').style.fontSize = "15px";
	GEBI('font').src = dmn+"/images/btns/font-b.png";
 }
}

function change_fontTTS2(){
 if (current_font_source == "large"){
	GEBI('TTSText').style.fontSize = "20px";
	GEBI('font').src = dmn+"/images/btns/font-s.png";
 }else{
	GEBI('TTSText').style.fontSize = "15px";
	GEBI('font').src = dmn+"/images/btns/font-b.png";
 }
}



function PUB(url,w,h){
	var openprint;
	openprint=eval("window.open( url ,'', 'toolbar=1,scrollbars=1,statusbar=yes,width='+ w + ',height=' + h + ',resizable=1');" );
	if(!openprint)	alert(TEXT_MSG_POPUP);
}


var myTimer= 0;

function DoubleClickBlock() {
var ob=GEBI('ttsgo');
 ob.disabled=true;
 ob.innerHTML="Loading";
 myTimer = setTimeout('rel();',2000);
}
function rel(){
 var ob=GEBI('ttsgo');
 ob.disabled=false;
 ob.innerHTML="Say It";
 clearTimeout(myTimer);
}

function SlideUp(pix){
 if(GEBI('adv').style.display!='block' && getCookie('advr')!=1){
  setTimeout('adv()',50);
  for (i=0;i<pix;i++) setTimeout('moveme('+(pix+25-i)+')',i);
  setTimeout('moveme('+(pix+25-i)+')',i);
  setTimeout('moveme2(700)',1000);
 }
}

function moveme2(pos){
 GEBI('framer').style.width=(pos+10)+'px';
 GEBI('adv').style.width=pos+'px';
 GEBI('adv').style.background='#fbe7ef';
 GEBI('adv').style.height='27px';
}
function moveme(pos){
 GEBI('adv').style.marginTop=pos+'px';
 GEBI('adv').style.width=(600-pos)+'px';
}

function adv(){
// if(getCookie("adv")!="yes"){
   GEBI('adv').innerHTML='<div align=center><table width="100%"><tr><td width="98%" align="center"><a href="http://imtranslator.net/translate-and-speak/"><div style="font-size:14px;color:#0E75B3;font-weight:600;">We\'ve just launched a new Translate and Speak site. <span style="font-size:14px;color:#BE3B34;font-weight:600;">Check out the new features >></span></div></a></td><td width="2%" align="center"><img style="cursor:pointer;" onClick="var ob=GEBI(\'adv\'); ob.style.display=\'none\';ob.style.background=\'white\';setCookie(\'advr\',1);return false;" src="images/close.gif" alt="Close" title="Close" border=0></td></tr></table></div>';
   GEBI('adv').style.display='block';
//   setCookie("adv","yes");
// }
}

//MOVER----------------
var ie=document.all;
var nn6=GEBI&&!document.all;

var isdrag=false;
var x,y;
var dobj;

function movemouse(e)
{
  if (isdrag)
  {
    dobj.style.left = nn6 ? tx + e.clientX - x : tx + event.clientX - x;
    dobj.style.top  = nn6 ? ty + e.clientY - y : ty + event.clientY - y;
    return false;
  }
}

function selectmouse(e) {
 try{
  var fobj       = nn6 ? e.target : event.srcElement;
  var topelement = nn6 ? "HTML" : "BODY";

  while (fobj.tagName != topelement && fobj.className != "dragme" && fobj.className != "dragme2")  {
    fobj = nn6 ? fobj.parentNode : fobj.parentElement;
  }

  if (fobj.className=="dragme" || fobj.className=="dragme2")  {
    isdrag = true;
    dobj = fobj;
    tx = parseInt(dobj.style.left+1);
    ty = parseInt(dobj.style.top+1);
    x = nn6 ? e.clientX : event.clientX;
    y = nn6 ? e.clientY : event.clientY;
    document.onmousemove=movemouse;
    return false;
  }
 } catch (ex){}
}




document.onmousedown=selectmouse;
document.onmouseup=new Function("isdrag=false");


//MOVER----------------

function INITKBD(){
GEBI('tURL').style.display='none';
if(GEBI("TTSText").value==""){
 GEBI("closer").style.display='none';
}
(function(){
 GEBI("TTSText").addEventListener("input",function(){
 	getTheText();
 },!1);
} )();

if(browser.ie)setTimeout('kbdShowHide(false)',10);
else kbdShowHide(false);
GEBI('dragme').style.display='none';
GEBI('dragme').style.marginTop='-28px';
GEBI('dragme').style.marginLeft='627px';
}


function INITMAILER(tp){
  var frame = GEBI('mailer');
  if(frame)	frame.parentNode.removeChild(frame);
   if(!GEBI('mailer')){
    if(tp=="feedback") var h=335;
    if(tp=="tellafriend") var h=370;
    var die = document.createElement("iframe");

    die.src = dmn+"/mailer.asp?type="+tp;
    die.name = "mailer";
    die.id="mailer";
    die.width="305px";
    die.height=h+"px"; 
    die.frameBorder="0";
    die.scrolling="no";
    GEBI('dragme2').appendChild(die);
    GEBI('dragme2').style.height=(23+h)+"px";
    }
 GEBI('dragme').style.display='none';
 GEBI('dragme2').style.display='block';
 GEBI('dragme2').style.marginTop='-190px';
 GEBI('dragme2').style.marginLeft='622px';
}



function GetBr(){
 var b = "undefined"
 if(navigator.appVersion.indexOf("Edge")==-1){
  if(navigator.userAgent.toLowerCase().indexOf("firefox")!=-1) b="firefox";
  if(navigator.userAgent.toLowerCase().indexOf("chrome")!=-1 && navigator.userAgent.toLowerCase().indexOf("opr")==-1 && navigator.userAgent.toLowerCase().indexOf("yabrowser")==-1  && navigator.userAgent.toLowerCase().indexOf("vivaldi")==-1) b="chrome";
  if(navigator.userAgent.toLowerCase().indexOf("opr")!=-1) b="opera";
  if(navigator.userAgent.toLowerCase().indexOf("yabrowser")!=-1) b="yandex";
  if(navigator.userAgent.toLowerCase().indexOf("vivaldi")!=-1) b="vivaldi";
  var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match('CriOS');
  if(isSafari == true) b="safari";
  if(navigator.userAgent.toLowerCase().indexOf("trident")!=-1) b="ms";
 } else b="edge";
 return b;
}



function NO_SUPPORT_ALERT(br){
        MSG = MSG_CREATOR(br);
	GetCustomAlert (MSG,4);              
}

function MSG_CREATOR(br){
	br = GetBr();
	var MSG = "";
	var T = "The voice function is available only through ImTranslator extension";
	var menu = T + "s:<br><br><img onclick='window.open(\"https://addons.mozilla.org/en-US/firefox/addon/imtranslator/\");' style='cursor:pointer;' title='Download ImTranslator for Firefox' alt='Download ImTranslator for Firefox' src='"+dmn+"/images/Ext-add-to-firefox.png'> &nbsp; <img onclick='window.open(\"https://chrome.google.com/webstore/detail/imtranslator-google-trans/noaijdpnepcgjemiklgfkcfbkokogabh?hl=en/\");' style='cursor:pointer;' title='Download ImTranslator for Chrome' alt='Download ImTranslator for Chrome' src='"+dmn+"/images/Ext-add-to-chrome.png'> &nbsp; <img onclick='window.open(\"https://addons.opera.com/en/extensions/details/imtranslator-translator-dictionary-tts/?display=en\");' style='cursor:pointer;' title='Download ImTranslator for Opera' alt='Download ImTranslator for Opera' src='"+dmn+"/images/Ext-add-to-opera.png'> &nbsp; <img onclick='window.open(\"https://addons.opera.com/en/extensions/details/imtranslator-translator-dictionary-tts/\");' style='cursor:pointer;' title='Download ImTranslator for Yandex' alt='Download ImTranslator for Yandex' src='"+dmn+"/images/Ext-add-to-yandex.png'> &nbsp; <img onclick='window.open(\"https://imtranslator.net/ImTranslator-For-MS-Edge.asp\");' style='cursor:pointer;' title='Download ImTranslator for MS Edge' alt='Download ImTranslator for MS Edge' src='"+dmn+"/images/Ext-add-to-Edge.png'><br><br>";
	switch(br){
	 case "firefox": var MSG = T + " for Firefox.<br><br>Download ImTranslator for Firefox <br><br><img onclick='window.open(\"https://addons.mozilla.org/en-US/firefox/addon/imtranslator/\");' style='cursor:pointer;' title='Download ImTranslator for Firefox' alt='Download ImTranslator for Firefox' src='"+dmn+"/images/Ext-add-to-firefox.png'><br><br>"; break;
	 case "ms":
	 case "edge":	 
	 case "vivaldi":
		 var MSG = menu; break;
	 case "yandex": var MSG = T + " for Yandex.<br><br>Download ImTranslator for Yandex <br><br><img onclick='window.open(\"https://addons.opera.com/en/extensions/details/imtranslator-translator-dictionary-tts/\");' style='cursor:pointer;' title='Download ImTranslator for Yandex' alt='Download ImTranslator for Yandex' src='"+dmn+"/images/Ext-add-to-yandex.png'><br><br>"; break;
	 case "opera": var MSG = T + " for Opera.<br><br>Download ImTranslator for Opera <br><br><img onclick='window.open(\"https://addons.opera.com/en/extensions/details/imtranslator-translator-dictionary-tts/\");' style='cursor:pointer;' title='Download ImTranslator for Opera' alt='Download ImTranslator for Opera' src='"+dmn+"/images/Ext-add-to-opera.png'><br><br>"; break;
	 case "chrome": var MSG = T + " for Chrome.<br><br>Download ImTranslator for Chrome <br><br><img onclick='window.open(\"https://chrome.google.com/webstore/detail/imtranslator-translator-d/noaijdpnepcgjemiklgfkcfbkokogabh\");' style='cursor:pointer;' title='Download ImTranslator for Chrome' alt='Download ImTranslator for Chrome' src='"+dmn+"/images/Ext-add-to-chrome.png'><br><br>"; break;
  	 default:
		 var MSG = menu; break;
	}
	return MSG;
}

function GetMyAlert(text){
	GEBI('fog').style.display='block';
	//speechClose();
        GEBI('divalertcontent').innerHTML=text;
	GEBI('divalertcontent').style.display='block';
	GEBI('divalertcontent').style.fontSize='14px';
	GEBI('divalert').style.display='block';
	if(GEBI('divAlertButton'))GEBI('divAlertButton').style.display='none';
        //GEBI('divAlertButton').style.display='block';
}

function GetCustomAlert(text,st){
	GetMyAlert(text);
	GEBI("customBTNS").innerHTML = "";
	GEBI("xclose").onclick= function(){
		DivAlert();
	}
//	GEBI("closer").style.display="none";
	GEBI("tURL").style.display="none";

	if(st==4){                                                                                   
        	GEBI("customBTNS").innerHTML = "<input type='button' class=setOK value='Ok' onclick='OkAlert(); return false;'>";	
        	return false;
	}

	if(st==3){                                                                                   
        	GEBI("customBTNS").innerHTML = "<input type='button' class=setOK value='Ok' onclick='OkAlert(); return false;'>";	
	        GEBI("customBTNS").innerHTML = GEBI("customBTNS").innerHTML + " &nbsp; <input type='button' class=setOK value='Close' onclick='DivAlert(); return false;'>";	
	} else {
		if(RXlang.indexOf(",")==-1) st=1;
		if(st==1){
	        	GEBI("customBTNS").innerHTML = "<input type='button' class=setOK value='Ok' onclick='CustomOkAlert(); return false;'>";	
		        GEBI("customBTNS").innerHTML = GEBI("customBTNS").innerHTML + " &nbsp; <input type='button' class=setOK value='Close' onclick='ForceTTS(); return false;'>";
			GEBI("xclose").onclick= function(){
				ForceTTS(); return false;
			}
		}else   GEBI("customBTNS").innerHTML = "<input type='button' class=setOK value='Close' onclick='DivAlert(); return false;'>";	
	}
}

function ForceTTS(){
	DivAlert();
	var fl = 0;
	var TTSlang = GEBI("TTSLangs").value;
	if(getCookie("tryfl")!=null) fl = getCookie("tryfl")
	var BR = GetBr();
	if(BR != "chrome" && TTSlang.indexOf("g_") !=-1){
		NO_SUPPORT_ALERT(BR);
	}else 	DoTTS(theUL,theSID,GEBI('TTSLangs').value,fl);	
}


function TTStodo(URL,SESS){
		speechBuilder(URL,SESS,GEBI('TTSLangs').value); 
		//GEBI('tURL').style.display='block';
		Baner300x250();
		/*SlideUp(700);*/
}

function TTStodo2(){
	speechClose();
        //GEBI("tURL").style.display="none";
	if(synth)synth.cancel();
	if(GEBI('TTSText')){
//		GEBI('TTSText').focus(); 
//		GEBI('facefake').style.display='none';
		//speechClose();
		//GEBI('closer').style.display='none';
		RangeTextNow();
	}
}

//VIRK strart

var VIRK_LAYOUT = "";
var VIRK_PATH = dmn+"vk-new/";

var VIRK_NOKBD = /*VIRK_NOKBD*/false/*VIRK_NOKBD*/;
if (!window.VIRK_PATH)   window.VIRK_PATH = dmn+"vk-new/";

var VIRK_SIZE = [/*VIRK_SIZE*/400,150/*VIRK_SIZE*/];
var theVirk = null;

ctrlAttachEvent (window, "load", function () { theVirk = new Virk () });
ctrlAttachEvent (window, "unload", function () { kbdShowHide (false) });




function kbdShowHide (fShow) {
   if (theVirk)
      fShow ? theVirk.show () : theVirk.hide ();
}

function Virk () {

   this.elem = GEBI ("virk");
   if (this.elem && this.elem.tagName == "IFRAME") {
      this.wnd = window.frames ["virk"];
      this.show = virkFrameShow;//virkDialogShow; // removed by Igor  - virkFrameShow;
      this.hide = virkFrameHide;
      if (this.elem.style.visibility != "hidden" && this.elem.style.display != "none")
         this.show ();
   }
   else {
      this.show = virkDialogShow;
      this.hide = virkDialogHide;
   }
   
   this.attachOnFocus ();
   if (VIRK_NOKBD) {
      this.blockKbd ();
      this.show ();
   }
}

function virkDialogShow (color) {
   if (this.wnd && !this.wnd.closed) this.wnd.close();
//      return;
   

   var href = window.VIRK_PATH + "virk.asp";
   href = href + '?sh=' + color;
   if (VIRK_LAYOUT)
      href += "&layout=" + VIRK_LAYOUT;

   if (window.showModelessDialog) {
      var features = "dialogWidth:" + (VIRK_SIZE [0] + 1) + "px;dialogHeight:" + (VIRK_SIZE [1] + 1) + "px"
                   + ";scroll:no;help:no;status=no;";
      
   this.wnd = window.showModelessDialog (href, window, features);

   }
   else {   
      var features = "dependent=yes,width=" + VIRK_SIZE [0] + ",height=" + VIRK_SIZE [1]
                   + ",scroll=no,help=no,status=no,directories=no,menubar=no,resizable=no";
      if (navigator.platform.indexOf ("Mac") < 0)
         features += ",dialog=yes";

      this.wnd = window.open (href, "Virk", features);
   }
}


function virkDialogHide () {
   if (this.wnd && !this.wnd.closed)
      this.wnd.close ();
   this.wnd = null;
}

function virkFrameShow () {
   this.elem.style.visibility = "visible";
   if (this.wnd && this.wnd.virkCtrl) {
      if (VIRK_LAYOUT) {
         this.wnd.virkCtrl.setLayout (VIRK_LAYOUT);
         VIRK_LAYOUT = "";
      }
      this.wnd.virkCtrl.attach (window);
   }

}

function virkFrameHide () {
   this.elem.style.visibility = "hidden";
   if (this.wnd && this.wnd.virkCtrl)
      this.wnd.virkCtrl.detach ();
}

Virk.prototype.blockKbd = function () {
   for (var i = 0; i < document.forms.length; ++i) {
      var ctrls = document.forms [i].elements;

      for (var j = 0; j < ctrls.length; ++j) {
         if (isEditable (ctrls [j])) {
            ctrls [j].onkeypress = function () { return false; }
            ctrls [j].onclick = function () { theVirk.show (); }
         }
      }
   }
}

Virk.prototype.attachOnFocus = function (wnd) {
   try {
      wnd = wnd ? wnd : window;
      var forms = wnd.document.forms;
      for (var i = 0; i < forms.length; ++i) {
         var ctrls = forms [i].elements;
         for (var j = 0; j < ctrls.length; ++j) {
            if (isEditable (ctrls [j])){//alert(ctrls[j].id);
               ctrlAttachEvent (ctrls [j], "focus", virkOnFocus);}
         }
      }
      
      var frames = wnd.document.getElementsByTagName ("IFRAME");
      for (var i = 0; i < frames.length; ++i)
         ctrlAttachEvent (frames [i], "load", virkOnLoadFrame);
      
      for (var i = 0; i < wnd.frames.length; ++i)
         this.attachOnFocus (wnd.frames [i]);
   }
   catch (e) {
   }
}

Virk.prototype.getLayout = function () {
   if (!this.wnd || this.wnd.closed)
      return "";
   return this.wnd.virkCtrl.getLayout ();
}

function virkOnLoadFrame () {
   theVirk.attachOnFocus ();
}

function virkOnFocus (e) {
   e = e || window.event;
   theVirk.activeCtrl = e.srcElement || e.target;
//alert(theVirk.activeCtrl.id);
}

function isEditable (ctrl) {

   return ctrl.isContentEditable
       || ctrl.tagName == "INPUT" && ctrl.type == "text"
       || ctrl.tagName == "TEXTAREA";
}

function ctrlAttachEvent (ctrl, type, listener) {
   if (ctrl.addEventListener) {
      ctrl.addEventListener (type, listener, false);
   }
   else if (ctrl.attachEvent) {
      ctrl.detachEvent ("on" + type, listener);
      ctrl.attachEvent ("on" + type, listener);
   }
   else {
      ctrl ["on" + type] = listener;
   }
}
//VIRK end





function caret() {
 //newText = "";
 if(synth)synth.cancel();    
 var node = GEBI("TTSText");
 if(node.selectionStart) return node.selectionStart;
 else if(!document.selection) return 0;
 var c		= "\001";
 var sel	= document.selection.createRange();
 var dul	= sel.duplicate();
 var len	= 0;
 dul.moveToElementText(node);
 sel.text	= c;
 len		= (dul.text.indexOf(c));
 sel.moveStart('character',-1);
 sel.text	= "";
 return len;
}

function getCaretText(event){
	if(GEBI("TTSText") && GEBI("TTSText").value!=""){
      	     var t = GEBI("TTSText");
	     t.focus();
	     var sText = getSelectionText();
	     var pos = caret();
	     if(sText!=""){
		var end = sText.length;
		newText = sText;
		   var _Start = pos;
		   var _End = CUT_SMART(pos,end);
		   setTimeout(function(){ 
			RANGE_START = _Start;
			RANGE_END = _End;

			t.focus();
			t.setSelectionRange(_Start, _End);
		   }, 200);

	     }else {

		var end = GEBI("TTSText").value.length;
		newText = GEBI("TTSText").value.substring(pos, CUT_SMART(pos,0));
		newText = newText.substring(0, ttsLIMIT);


		   setTimeout(function(){ 
			t.focus();
			t.selectionStart = pos;
			t.selectionEnd = CUT_SMART(pos,0);
			RANGE_START = t.selectionStart;
			RANGE_END = t.selectionEnd;
			t.setSelectionRange(t.selectionStart, t.selectionEnd);
		   }, 200);
		}

	}
}

function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

function getTheText(){
//        newText = GEBI("textarea").value;
	newText = GEBI('TTSText').value;
}

function handleSpeechPause(){
	GEBI("controls").className="pause";
}

function handleSpeechResume(){
	GEBI("controls").className="play";
}

function handleSpeechEvent(){
	if(GEBI("textarea")) {
		//GEBI("textarea").blur();
		GEBI("controls").className="play";
		FirstLoop=0;	
		newText=GEBI("textarea").value;
		GEBI("ttsgo").value="Say It";
	}
}

function PlayPause(ob, event){   
    if(GEBI(ob).className=="play"){
	GEBI(ob).className="pause";
	if(FirstLoop==0){		
		Reload(ob);
		FirstLoop=1;
	} else {
		event.preventDefault();
		setTimeout(function(){  			
			synth.resume();	
		}, 300);
	}
    } else {
	FirstLoop=1;
	event.preventDefault();
	GEBI(ob).className="play";
	synth.pause();	
    }
}

function Reload(ob){
    if(synth)synth.cancel();    
    FirstLoop=0;	
    GOOGLE_TTS();
    GEBI(ob).className="pause";
}


function GOOGLE_TTS(){
	FirstLoop=1;
	if(synth)synth.cancel();
	openMe();
        var TTSlang = GEBI('TTSLangs').value;
/*
	if(DetLangCode!=""){
		var out="g_en-US_m";
		switch(DetLangCode){
		 	case "hi": out = "g_hi-IN_f"; break;
	 		case "id": out = "g_id-ID_f"; break;
		 	case "hl": out = "g_nl-NL_f"; break;
		 	case "pl": out = "g_pl-PL_f"; break;
		}
		TTSlang = out;
	}
*/
	GEBI("ttsgo").innerHTML="Speaking";

	speechText = GEBI('TTSText').value; 


  			var TTL = "English American";
			var voices = synth.getVoices();
			var utterance = new SpeechSynthesisUtterance();
			var LNG="g_en-US_m";



			switch(TTSlang){
			 	case "g_zh-HK_f": TTL="Chinese Cantonese female"; 
					LNG = "zh-HK";
					break;
			 	case "g_zh-TW_f": TTL="Chinese Taiwanese female"; 
					LNG = "zh-TW";
					break;
			 	case "g_en-UK_m": TTL="English British male"; 
					LNG = "en-GB|Male";
					break;
			 	case "g_en-UK_f": TTL="English British female"; 
					LNG = "en-GB|Female";
					break;
			 	case "g_de-DE_f": TTL="German female"; 
					LNG = "de-DE";
					break;
			 	case "g_hi-IN_f": TTL="Hindi female"; 
					LNG = "hi-IN";
					break;
			 	case "g_id-ID_f": TTL="Indonesian female";
					LNG = "id-ID";
					break;
			 	case "g_it-IT_f": TTL="Italian female"; 
					LNG = "it-IT";
					break;
			 	case "g_nl-NL_f": TTL="Dutch female"; 
					LNG = "nl-NL";
					break;
			 	case "g_pl-PL_f": TTL="Polish female"; 
					LNG = "pl-PL";
					break;
			 	case "g_es-ES_f": TTL="Spanish European female"; 
					LNG = "es-ES";
					break;
			 	case "g_es-US_f": TTL="Spanish American female"; 
					LNG = "es-US";
					break;
			 	case "g_ru-RU_f": TTL="Russian female"; 
					LNG = "ru-RU";
					break;
			}


			for (var a=0; a<voices.length; a++){
			    if(LNG.indexOf("|")!=-1){
				var ARR=LNG.split("|");
				if(ARR[0]==voices[a].lang && voices[a].name.indexOf(ARR[1])!=-1){
					utterance.voice = voices[a];
				}
			    }else{
				if(LNG==voices[a].lang){
					utterance.voice = voices[a];
				}
			    }
			}
			var SP = 1.0;
			switch(speed){
			 	case "10":  SP=2.0; break;
			 	case "6":   SP=1.6; break;
			 	case "3":   SP=1.3; break;
			 	case "0":   SP=1.0; break;
			 	case "-3":  SP=0.7; break;
			 	case "-6":  SP=0.4; break;
			 	case "-10": SP=0.1; break;
			}


		        GEBI("ttsinfo").style.display='none';
			var gPLAYER = GEBI("closer"); 
		        var URL = "https://about.imtranslator.net/add-ons/";
		        var BR = GetBr()

                        switch(BR){
                         case "chrome": URL = "https://chrome.google.com/webstore/detail/imtranslator-translator-d/noaijdpnepcgjemiklgfkcfbkokogabh"; BR = "Chrome"; break;
                         case "firefox": URL = "https://addons.mozilla.org/en-US/firefox/addon/imtranslator/"; BR = "Firefox"; break;
                         case "opera": URL = "https://addons.opera.com/en/extensions/details/imtranslator-translator-dictionary-tts/"; BR = "Opera"; break;
                         case "yandex": URL = "https://addons.opera.com/en/extensions/details/imtranslator-translator-dictionary-tts/"; BR = "Yandex"; break;
                         default: BR = "your browser"; break;
			}


		        var QWESTION = "Would you like to download ImTranslator Extension for "+ BR +"?";
		 	var DOWNLOAD = "<table width='100%' style='border-top:1px solid #369;border-bottom:1px solid #369;'><tr><td width='85%'><a href='"+ URL +"' target='_blank'><div id='geturltext' style='margin-top:3px;margin-left:5px;font-size:12px;color:#000;'>"+ QWESTION +"</div></a></td><td widht='15%' align='right'><a href='"+ URL +"' target='_blank'><div id='yesbtn2'>Yes</div> </a></tr></table>";
		 	var PLAYER = "<div id='player' style='border:0px;' align='center'><table width='97%' style='padding:6px;background:#F1F3F4;border-radius:25px;height:45px;margin-left:-6px;' bgcolor='#fff'><tr><td width=20><div id='controls' class='pause'></div></td><td></td><td align='right'><div id='volume' class='volume'></div></td><td><input type='range' min='0' max='10' value='"+TheVolume+"' class='slider' id='myRange'></td><td></td></tr></table></div>";
		 	var KOFI = "<a href='https://ko-fi.com/smartlink' target='_blank'><div id='SOD' title='We used to make enough money to self support our development of ImTranslator. But times have changed and keeping in mind that ImTranslator must remain FREE we appreciate any support for our work. Thank you.'><span>$</span> Make a small contribution</div></a>";
		 	var HDR ="<table width=99%><tr><td width=55% valign=top><div style='margin-left:6px;margin-top:6px;font-size:12px;color:#000;text-align:left'>Speaking: <span style='color:red;font-size:12px;'>"+TTL+" voice</span><br>Start from any cursor position on the text</div></td><td width=45% align=center valign=top>"+KOFI+"</td></tr></table>";

                      	      

                        GEBI("tURL").style.display="block";
                        gPLAYER.style.display="block";
			gPLAYER.style.background="white";
//			gPLAYER.style.borderRadius="5px";
			gPLAYER.style.border="1px solid #369";
//			gPLAYER.style.height="106px";
                        gPLAYER.innerHTML="<div id='speech_container'>"+HDR+PLAYER+"</div>";
                        //GEBI('closer').style.display='none';


			if (current_font_source == "large") GEBI("TTSText").style.fontSize = "20px";
			else GEBI("TTSText").style.fontSize = "15px";



                        setCookie("volume",TheVolume);

                        if(newText=="") newText = speechText;







			utterance.text = newText;
			utterance.rate = SP;
			utterance.volume = getCookie("volume")*1/10;
                        //newText="";

			utterance.addEventListener('end', handleSpeechEvent);
			utterance.addEventListener('pause', handleSpeechPause);
			utterance.addEventListener('resume', handleSpeechResume);

			setTimeout(function(){  
				synth.speak(utterance);
			}, 300);


			GEBI("Borders").style.height='580px !important';
}


function openMe(){
	change_fontTTS2();
}


function TTS_DETECT(ob){
  DivAlert();
  var text="";
  RXlang="";
  text = GEBI('TTSText').value;
  if(newText!="") text=newText;
  for(var i=0; i<text.length; i++) {
     if (text.indexOf("&")!=-1)           text = text.replace("&"," ");
     if (text.indexOf("&")!=-1)           text = text.replace("%"," ");
     if (text.indexOf("+")!=-1)           text = text.replace("+"," ");
  }


	 GEBI('tURL').style.display='block';
	 var TMPtext=text.replace(/[.,\/#?!$%\^&\*;:{}=\-_`~()]/g,"");
	 TMPtext = TMPtext.replace(/\d+/g,'');
	 var lang = GEBI('TTSLangs').value;

	 var Name = GEBI('TTSLangs').options[GEBI('TTSLangs').selectedIndex].text;
	 Name = Name.replace("(male)","");
	 Name = Name.replace("(female)","");
	 if(Name.indexOf(" ")>=-1){
	 	var ArrName = Name.split(" ");
		Name = ArrName[0];
	 }

	 var CNT="000000";
	 var DOIT=0;
	 var ALLlangs="";


	 if(englishPattern.test(TMPtext)==true){CNT="010000";RXlang="en";ALLlangs=ALLlangs+RXlang+",";}
	 if(cyrillicPattern.test(TMPtext)==true){CNT="100000";RXlang="ru";ALLlangs=ALLlangs+RXlang+",";}
	 if(koreanPattern.test(TMPtext)==true){CNT="001000";RXlang="ko";ALLlangs=ALLlangs+RXlang+",";}
	 if(japanesePattern.test(TMPtext)==true){CNT="000100";RXlang="ja";ALLlangs=ALLlangs+RXlang+",";}
	 if(chinesePattern.test(TMPtext)==true){CNT="000010";RXlang="zh";ALLlangs=ALLlangs+RXlang+",";}
	 if(westernPattern.test(TMPtext)==true){CNT="000001";RXlang="fr,pt,es,it,de";ALLlangs=ALLlangs+"wst,";}


	 if(ALLlangs!="") {
        	ALLlangs = ALLlangs.substring(0,(ALLlangs.length-1));
		CNT="000001";
		RXlang = ALLlangs.replace("wst","fr,pt,es,it,de,pl");
		if(RXlang.indexOf(",")==-1)CNT="100000";
	 }

         if(TMPtext == "") CNT="111111";
	 var BR = GetBr();
	 var st = "true";
	 TEMPLANGS = ALLlangs;

	 switch(CNT){
	  case "000000":

		DETECTOR(text);
		setTimeout(function() {
		  var SL_WPTid = setInterval(function(){
		    if(DetLangCode!=""){
			 clearInterval(SL_WPTid);
			 if(Name!=DetLangName){
				if(RXlang==""){
					RXlang = DetLangCode;
					if(RXlang=="hi") MSG_Single(RXlang,lang, Name);
					else MSG_NotSupported(RXlang,lang, Name);
				} else 	MSG_Multiple(RXlang,lang, Name);
			 } else ForceTTS();
		    } else GEBI("ttsgo").innerHTML="Say It";
		  },100); 
		}, 500);   
		return "false";
		break;
	  case "100000": st = COMPARE(RXlang,lang,Name);		
		break;
	  case "010000": st = COMPARE(RXlang,lang,Name);
		break;
	  case "001000": st = COMPARE(RXlang,lang,Name);
		break;
	  case "000100": st = COMPARE(RXlang,lang,Name);
		break;
	  case "000010": st = COMPARE(RXlang,lang,Name);
		break;
	  case "000001":
	        if(ALLlangs.indexOf("wst") != -1){
			DETECTOR(text);
			setTimeout(function() {
				var SL_WPTid = setInterval(function(){
				    if(DetLangCode!=""){
					 clearInterval(SL_WPTid);
					 if(Name!=DetLangName){
						 if(DetLangCode == "pl"){
							RXlang = DetLangCode;
							MSG_Single(RXlang,lang, Name);
						 } else COMPAREMULTIPLE(RXlang,lang,Name,1);
					 }// else ForceTTS();
				    } else GEBI("ttsgo").innerHTML="Say It";
				},100); 
			}, 500);   

		} COMPAREMULTIPLE(RXlang,lang,Name,1); 
		st = "false";
		break;

	 }
	 return st;
}



function COMPARE(RXlang,lang, Name){
        if (lang.indexOf("enf")!=-1) lang="en";
        if (lang.indexOf("en")!=-1) lang="en";
        if (lang.indexOf("zh")!=-1) lang="zh";
        if (lang.indexOf("es")!=-1) lang="es";
        if (lang.indexOf("it")!=-1) lang="it";
        if (lang.indexOf("de")!=-1) lang="de";
        if (lang.indexOf("ru")!=-1) lang="ru";
        if (lang == "g_pl-PL_f") lang="pl";

	if(RXlang.indexOf(lang)!=-1){
	    DivAlert();
	    return "true";
	}else{
	    if(RXlang != "en"){
		    MSG_Single(RXlang,lang, Name); 
		    return "false";
	    } else {
		    return "true";
	    }
	}
}

function COMPAREMULTIPLE(RXlang,lang, Name, st){
        if (DetLangCode!="" && RXlang.indexOf(DetLangCode)==-1){
		RXlang = RXlang +","+DetLangCode;
                TEMPLANGS = RXlang;
	}

        if (lang.indexOf("enf")!=-1) lang="en";
        if (lang.indexOf("en")!=-1) lang="en";
        if (lang.indexOf("zh")!=-1) lang="zh";
        if (lang.indexOf("es")!=-1) lang="es";
        if (lang.indexOf("it")!=-1) lang="it";
        if (lang.indexOf("de")!=-1) lang="de";
        if (lang == "g_pl-PL_f") lang="pl";

	if(RXlang.indexOf(lang)!=-1){
	    DivAlert();
	    if(st==1){
		ForceTTS();
	    }	
	}else{
	    MSG_Multiple(RXlang,lang, Name); 
	}
}


function MSG_NotSupported(RXlang,lang, Name){
	    GetCustomAlert("Our system detected that your text is not in " + Name +" language.<br><br> We believe it's " + GetLongName(RXlang),1);    
	    var BR = GetBr();
	    if(ALLTTS_V.indexOf(RXlang)!=-1){
		    GEBI("customBTNS").innerHTML = "<input type='button' class=setOK value='Ok' onclick='NO_SUPPORT_ALERT(BR); return false;'>";
	    }else   GEBI("customBTNS").innerHTML = "<input type='button' class=setOK value='Ok' onclick='DivAlert(); return false;'>";

	    GEBI("customBTNS").innerHTML = GEBI("customBTNS").innerHTML + " &nbsp; <input type='button' class=setOK value='Close' onclick='ForceTTS(); return false;'>";		
	    GEBI("xclose").onclick= function(){
		ForceTTS(); 
	    }
	    return "false";
}


function MSG_Single(RXlang,lang, Name){
	    GetCustomAlert("Our system detected that your text is not in " + Name +" language.<br><br> We believe it's " + GetLongName(RXlang),1);
            GEBI("customBTNS").innerHTML = "<input type='button' class=setOK value='Ok' onclick='CustomOkAlert2(); return false;'>";	
	    GEBI("customBTNS").innerHTML = GEBI("customBTNS").innerHTML + " &nbsp; <input type='button' class=setOK value='Close' onclick='ForceTTS(); return false;'>";	
	    RXlang=DetLangCode;

	    GEBI("xclose").onclick= function(){
		ForceTTS(); 
	    }
	    return "false";
}

function MSG_Multiple(RXlang,lang, Name){
	    var TL = "Our system detected that your text is not in " + Name +" language."
	    var arr = RXlang.split(",");
	    var OUT="";
	    for(var j=0;j<arr.length;j++){
	      var LN = GetLongName(arr[j]);
	      OUT=OUT+"<span class=btns title='Listen in "+LN+"'onClick=\"Redoit2('"+arr[j]+"')\">"+LN+"</span> ";	      
	    }
	    GetCustomAlert(TL + "<br><br>We believe this is one of these languages:<br><br></div>" + OUT +"<br><br>",0);

	    GEBI("customBTNS").innerHTML = "<input type='button' class=setOK value='Close' onclick='ForceTTS(); return false;'>";	
	    GEBI("xclose").onclick= function(){
		ForceTTS(); return false;
	    }
}



function DETECTOR(text){
  	var theLIMIT = 300;
  	text = text.substring(0,theLIMIT)
//  	text = "";
	var SLDImTranslator_url = "../sl_detect.asp?text="+encodeURIComponent(text);
		var ajaxRequest;  
		try{
			ajaxRequest = new XMLHttpRequest();
		} catch (e){
			try{
				ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try{
					ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e){return false;}
			}
		}
		ajaxRequest.onreadystatechange = function(){
			if(ajaxRequest.readyState == 4){
                        	DetLangCode = ajaxRequest.responseText;
                        	DetLangName = GetLongName(DetLangCode);
			}
		}
		ajaxRequest.open("POST", SLDImTranslator_url, true);
		ajaxRequest.send(null);                          
}


function GetLongName(DetLangCode){
 var DetLangName;
 for(var i=0; i<ids.length; i++){
	if(DetLangCode==ids[i]){
		DetLangName=PAIRLIST[i];
		DetLangName=DetLangName.replace(" Simp","");
		DetLangName=DetLangName.replace(" Trad","");
	}
 }
 return DetLangName;
}

function Redoit(){
 DivAlert();
 if(RXlang.length<3)  GEBI('TTSLangs').value = RXlang;
 GEBI("ttsgo").click();
}

function Redoit2(lng){
 DivAlert();
 if(WorkingLangs.indexOf(lng) > -1){
	if (lng.indexOf("hi")!=-1) lng="g_hi-IN_f";
	if (lng.indexOf("id")!=-1) lng="g_id-ID_f";
	if (lng.indexOf("nl")!=-1) lng="g_nl-NL_f";

	GEBI('TTSLangs').value = lng; 
	//GEBI("ttsgo").click();
	ForceTTS();
 }else{
	var BR = GetBr();
	NO_SUPPORT_ALERT(BR);
 }
}

function TryAgain(){
	var TL = "Our system detected that your text is one of these languages:";    
	var arr = TEMPLANGS.split(",");
	var OUT="";
	for(var j=0;j<arr.length;j++){
	      var LN = GetLongName(arr[j]);
	      OUT=OUT+"<span class=btns title='Listen in "+LN+"'onClick=\"Redoit2('"+arr[j]+"')\">"+LN+"</span> ";	      
	}
	GetCustomAlert(TL + "<br><br>" + OUT +"<br><br>",0);
	GEBI("customBTNS").innerHTML = "<input type='button' class=setOK value='Close' onclick='DivAlert(); return false;'>";	
}

function RangeTextNow(){
	    var txtElement = GEBI('TTSText');
	    if (txtElement.setSelectionRange) { 
        	txtElement.focus(); 
	        txtElement.setSelectionRange(0, CUT_SMART(0,0)); 
	    } else if (txtElement.createTextRange) { 
        	var range = txtElement.createTextRange();  
	        range.moveStart('character', CUT_SMART(0,0)); 
        	range.select(); 
	    } 
}

function CUT_SMART(start,key){
 	var length = 250;
 	var length_ = length;
 	var length2 = 0;
 	var lng = GEBI("TTSLangs").value;
 	if(lng.indexOf("_") == -1){
           length = truncStrByWord(start,ttsLIMIT);
	}else{
	   if(lng.indexOf("en") != -1) length = truncStrByWord(start,length);
	   if(lng.indexOf("zh") != -1) length = 70;
	   if(lng.indexOf("hi") != -1) length = 70;
	   if(lng.indexOf("es") != -1) length = truncStrByWord(start,200);
	   if(lng.indexOf("de") != -1) length = truncStrByWord(start,200);
	   if(lng.indexOf("it") != -1) length = truncStrByWord(start,200);
	   if(lng.indexOf("ru") != -1) length = truncStrByWord(start,200);
	   if(lng.indexOf("id") != -1) length = truncStrByWord(start,200);
	   if(lng.indexOf("pl") != -1) length = truncStrByWord(start,200);
	}

 	if(key != 0){
		length = key;
	 	var lng = GEBI("TTSLangs").value;
	 	if(lng.indexOf("_") == -1){
        	   length2 = truncStrByWord(start,ttsLIMIT);
		}else{
		   if(lng.indexOf("en") != -1) length2 = truncStrByWord(start,length_);
		   if(lng.indexOf("zh") != -1) length2 = 70;
		   if(lng.indexOf("hi") != -1) length2 = 70;
		   if(lng.indexOf("es") != -1) length2 = truncStrByWord(start,200);
		   if(lng.indexOf("de") != -1) length2 = truncStrByWord(start,200);
		   if(lng.indexOf("it") != -1) length2 = truncStrByWord(start,200);
		   if(lng.indexOf("ru") != -1) length2 = truncStrByWord(start,200);
		   if(lng.indexOf("id") != -1) length2 = truncStrByWord(start,200);
		   if(lng.indexOf("pl") != -1) length2 = truncStrByWord(start,200);
		}

		if (length > length2) length = length2;
	}
 	var end = start+length;
 	return (end);
}



function truncStrByWord (start, length) {
   length = start+length;
   length=length-25;
   var str=GEBI("TTSText").value;
   var thestr = str;
//   if (str.length > length) {
      	str = str.substring (start, length);
	str = str.replace(new RegExp("/(.{1,"+length+"})\b.*/"), "$1");
        str2 = thestr.substring(length, (length+25));


        var tempstr=str2.split(" ");
        tmp="";
        for (i=0; i<tempstr.length-1; i++){
          tmp = tmp+tempstr[i]+" ";
        } 
        str=str+tmp;
//   } 
   str = str.length;	
   return str;
}



function CheckCursorPos() {
    var input = GEBI('TTSText');
    if ("selectionStart" in input && document.activeElement == input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    else if (input.createTextRange) {
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (var len = 0;
                     rng.compareEndPoints("EndToStart", rng) > 0;
                     rng.moveEnd("character", -1)) {
                len++;
            }
            rng.setEndPoint("StartToStart", input.createTextRange());
            for (var pos = { start: 0, end: len };
                     rng.compareEndPoints("EndToStart", rng) > 0;
                     rng.moveEnd("character", -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
}
