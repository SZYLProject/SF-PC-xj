// $(document).ready(function(){ 
//     TV_Initialize();
//     getEvent(T_GetEvent);				
// });
// $(window).unload(function(){ 
//     TV_Disable(); 
// }); 	
// //离开页面
// $(window).bind('beforeunload',function(){
// ;				TV_Disable();
// });					



function AppendStatus(szStatus)
{
//qnviccub.QNV_Tool(QNV_TOOL_WRITELOG,0,szStatus,NULL,NULL,0);//写本地日志到控件注册目录的userlog目录下
$("#StatusArea").append(szStatus+"\r\n" );
// var scrollTop = $("#StatusArea")[0].scrollHeight;   //byyuwen
// $("#StatusArea").scrollTop(scrollTop);  	//byyuwen


//var szHint = $("#StatusArea").val()+ szStatus +"\r\n";
// $("#StatusArea").val(szHint);
//  $("#StatusArea").scrollTop($("#StatusArea").scrollHeight());
}
function AppendStatusEx(uID,szStatus)
{
uID=uID+1;
AppendStatus("通道"+uID+":"+szStatus);
}
function showDlg(flag)
{
var urlStr=prompt("请输入上传的文件的URL，格式如php文件上传","");
if (urlStr!=null && urlStr != "")
{
if(flag==0)
TV_uploadFile(urlStr);
else
ali_uploadFile(urlStr);
}
else{
alert('上传url不能为空!');
}
}

function  T_GetEvent(uID,uEventType,uHandle,uResult,szdata)
{
//var vValueArray=qnviccub.QNV_Event(0,2,0,"","",1024);
if(uEventType == -1)
return;
var vValue=" type="+uEventType+" Handle="+uHandle+" Result="+uResult+" szdata="+szdata;
switch(uEventType)
{
case BriEvent_PhoneHook:// 本地电话机摘机事件
AppendStatusEx(uID,"本地电话机摘机"+vValue);
break;	
case BriEvent_PhoneDial:// 只有在本地话机摘机，没有调用软摘机时，检测到DTMF拨号
AppendStatusEx(uID,"本地话机拨号"+vValue);
break;	
case BriEvent_PhoneHang:// 本地电话机挂机事件
TV_HangUpCtrl(uID);
AppendStatusEx(uID,"本地电话机挂机"+vValue);
break;
case BriEvent_CallIn:// 外线通道来电响铃事件
AppendStatusEx(uID,"外线通道来电响铃事件"+vValue);
break;
case BriEvent_GetCallID://得到来电号码
AppendStatusEx(uID,"得到来电号码"+vValue);
break;
case BriEvent_StopCallIn:// 对方停止呼叫(产生一个未接电话)
AppendStatusEx(uID,"对方停止呼叫(产生一个未接电话)"+vValue);
break;
case BriEvent_DialEnd:// 调用开始拨号后，全部号码拨号结束
AppendStatusEx(uID,"调用开始拨号后，全部号码拨号结束"+vValue);
break;
case BriEvent_PlayFileEnd:// 播放文件结束事件
AppendStatusEx(uID,"播放文件结束事件"+vValue);
break;
case BriEvent_PlayMultiFileEnd:// 多文件连播结束事件
AppendStatusEx(uID,"多文件连播结束事件"+vValue);
break;
case BriEvent_PlayStringEnd://播放字符结束
AppendStatusEx(uID,"播放字符结束"+vValue);
break
case BriEvent_RepeatPlayFile:// 播放文件结束准备重复播放
AppendStatusEx(uID,"播放文件结束准备重复播放"+vValue);
break;
case BriEvent_SendCallIDEnd:// 给本地设备发送震铃信号时发送号码结束
AppendStatusEx(uID,"给本地设备发送震铃信号时发送号码结束"+vValue);
break;
case BriEvent_RingTimeOut://给本地设备发送震铃信号时超时
AppendStatusEx(uID,"给本地设备发送震铃信号时超时"+vValue);
break;	
case BriEvent_Ringing://正在内线震铃
AppendStatusEx(uID,"正在内线震铃"+vValue);
break;
case BriEvent_Silence:// 通话时检测到一定时间的静音.默认为5秒
AppendStatusEx(uID,"通话时检测到一定时间的静音"+vValue);
break;
case BriEvent_GetDTMFChar:// 线路接通时收到DTMF码事件
console.log("线路接通时收到DTMF码事件  by yw")
AppendStatusEx(uID,"线路接通时收到DTMF码事件"+vValue);
break;
case BriEvent_RemoteHook:// 拨号后,被叫方摘机事件
console.log("线路接通时收到DTMF码事件  by yw")
AppendStatusEx(uID,"拨号后,被叫方摘机事件"+vValue);
break;
case BriEvent_RemoteHang://对方挂机事件
console.log("对方挂机事件 by yw")
TV_HangUpCtrl(uID);
AppendStatusEx(uID,"对方挂机事件"+vValue);
break;
case BriEvent_Busy:// 检测到忙音事件,表示PSTN线路已经被断开
AppendStatusEx(uID,"检测到忙音事件,表示PSTN线路已经被断开"+vValue);
break;
case BriEvent_DialTone:// 本地摘机后检测到拨号音
AppendStatusEx(uID,"本地摘机后检测到拨号音"+vValue);
break;
case BriEvent_RingBack:// 电话机拨号结束呼出事件。
AppendStatusEx(uID,"电话机拨号结束呼出事件"+vValue);
break;
case BriEvent_MicIn:// MIC插入状态
AppendStatusEx(uID,"MIC插入状态"+vValue);
break;
case BriEvent_MicOut:// MIC拔出状态
AppendStatusEx(uID,"MIC拔出状态"+vValue);
break;
case BriEvent_FlashEnd:// 拍插簧(Flash)完成事件，拍插簧完成后可以检测拨号音后进行二次拨号
AppendStatusEx(uID,"拍插簧(Flash)完成事件，拍插簧完成后可以检测拨号音后进行二次拨号"+vValue);
break;
case BriEvent_RefuseEnd:// 拒接完成
AppendStatusEx(uID,"拒接完成"+vValue);
break;
case BriEvent_SpeechResult:// 语音识别完成 
AppendStatusEx(uID,"语音识别完成"+vValue);
break;
case BriEvent_FaxRecvFinished:// 接收传真完成
AppendStatusEx(uID,"接收传真完成"+vValue);
break;
case BriEvent_FaxRecvFailed:// 接收传真失败
AppendStatusEx(uID,"接收传真失败"+vValue);
break;
case BriEvent_FaxSendFinished:// 发送传真完成
AppendStatusEx(uID,"发送传真完成"+vValue);
break;
case BriEvent_FaxSendFailed:// 发送传真失败
AppendStatusEx(uID,"发送传真失败"+vValue);
break;
case BriEvent_OpenSoundFailed:// 启动声卡失败
AppendStatusEx(uID,"启动声卡失败"+vValue);
break;
case BriEvent_UploadSuccess://远程上传成功
AppendStatusEx(uID,"远程上传成功"+vValue);
break;
case BriEvent_UploadFailed://远程上传失败
AppendStatusEx(uID,"远程上传失败"+vValue);
break;
case BriEvent_EnableHook:// 应用层调用软摘机/软挂机成功事件
AppendStatusEx(uID,"应用层调用软摘机/软挂机成功事件"+vValue);
break;
case BriEvent_EnablePlay:// 喇叭被打开或者/关闭
AppendStatusEx(uID,"喇叭被打开或者/关闭"+vValue);
break;
case BriEvent_EnableMic:// MIC被打开或者关闭
AppendStatusEx(uID,"MIC被打开或者关闭"+vValue);
break;
case BriEvent_EnableSpk:// 耳机被打开或者关闭
AppendStatusEx(uID,"耳机被打开或者关闭"+vValue);
break;
case BriEvent_EnableRing:// 电话机跟电话线(PSTN)断开/接通
AppendStatusEx(uID,"电话机跟电话线(PSTN)断开/接通"+vValue);
break;
case BriEvent_DoRecSource:// 修改录音源
AppendStatusEx(uID,"修改录音源"+vValue);
break;
case BriEvent_DoStartDial:// 开始软件拨号
AppendStatusEx(uID,"开始软件拨号"+vValue);
break;
case BriEvent_RecvedFSK:// 接收到FSK信号，包括通话中FSK/来电号码的FSK
AppendStatusEx(uID,"接收到FSK信号，包括通话中FSK/来电号码的FSK"+vValue);
break;
case BriEvent_PlugOut:
AppendStatusEx(uID,"设备移除");
break;
case BriEvent_DevErr://设备错误
AppendStatusEx(uID,"设备错误"+ decodeURIComponent(vValue) );
break;
default:
if(uEventType < BriEvent_EndID)
AppendStatusEx(uID,"忽略其它事件发生:ID=" + uEventType+ vValue);	
break;
}

}

//编码问题
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(

　　-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,

　　-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,

　　-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,

　　52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,

　　-1,　0,　1,　2,　3,  4,　5,　6,　7,　8,　9, 10, 11, 12, 13, 14,

　　15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,

　　-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,

　　41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {

　　var out, i, len;

　　var c1, c2, c3;

　　len = str.length;

　　i = 0;

　　out = "";

　　while(i < len) {

c1 = str.charCodeAt(i++) & 0xff;

if(i == len)

{

　　 out += base64EncodeChars.charAt(c1 >> 2);

　　 out += base64EncodeChars.charAt((c1 & 0x3) << 4);

　　 out += "==";

　　 break;

}

c2 = str.charCodeAt(i++);

if(i == len)

{

　　 out += base64EncodeChars.charAt(c1 >> 2);

　　 out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));

　　 out += base64EncodeChars.charAt((c2 & 0xF) << 2);

　　 out += "=";

　　 break;

}

c3 = str.charCodeAt(i++);

out += base64EncodeChars.charAt(c1 >> 2);

out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));

out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));

out += base64EncodeChars.charAt(c3 & 0x3F);

　　}

　　return out;

}

function base64decode(str) {

　　var c1, c2, c3, c4;

　　var i, len, out;

　　len = str.length;

　　i = 0;

　　out = "";

　　while(i < len) {

/* c1 */

do {

　　 c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];

} while(i < len && c1 == -1);

if(c1 == -1)

　　 break;

/* c2 */

do {

　　 c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];

} while(i < len && c2 == -1);

if(c2 == -1)

　　 break;

out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

/* c3 */

do {

　　 c3 = str.charCodeAt(i++) & 0xff;

　　 if(c3 == 61)

　return out;

　　 c3 = base64DecodeChars[c3];

} while(i < len && c3 == -1);

if(c3 == -1)

　　 break;

out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

/* c4 */

do {

　　 c4 = str.charCodeAt(i++) & 0xff;

　　 if(c4 == 61)

　return out;

　　 c4 = base64DecodeChars[c4];

} while(i < len && c4 == -1);

if(c4 == -1)

　　 break;

out += String.fromCharCode(((c3 & 0x03) << 6) | c4);

　　}

　　return out;

}

function utf16to8(str) {

　　var out, i, len, c;

　　out = "";

　　len = str.length;

　　for(let i = 0; i < len; i++) {

c = str.charCodeAt(i);

if ((c >= 0x0001) && (c <= 0x007F)) {

　　 out += str.charAt(i);

} else if (c > 0x07FF) {

　　 out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));

　　 out += String.fromCharCode(0x80 | ((c >>　6) & 0x3F));

　　 out += String.fromCharCode(0x80 | ((c >>　0) & 0x3F));

} else {

　　 out += String.fromCharCode(0xC0 | ((c >>　6) & 0x1F));

　　 out += String.fromCharCode(0x80 | ((c >>　0) & 0x3F));

}

　　}

　　return out;

}

function utf8to16(str) {

　　var out, i, len, c;

　　var char2, char3;

　　out = "";

　　len = str.length;

　　i = 0;

　　while(i < len) {

c = str.charCodeAt(i++);

switch(c >> 4)

{

　 case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:

　　 // 0xxxxxxx

　　 out += str.charAt(i-1);

　　 break;

　 case 12: case 13:

　　 // 110x xxxx　 10xx xxxx

　　 char2 = str.charCodeAt(i++);

　　 out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));

　　 break;

　 case 14:

　　 // 1110 xxxx　10xx xxxx　10xx xxxx

　　 char2 = str.charCodeAt(i++);

　　 char3 = str.charCodeAt(i++);

　　 out += String.fromCharCode(((c & 0x0F) << 12) |

　　　　((char2 & 0x3F) << 6) |

　　　　((char3 & 0x3F) << 0));

　　 break;

}

　　}

　　return out;

} 


export {
    AppendStatusEx
}