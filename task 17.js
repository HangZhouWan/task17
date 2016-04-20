// JavaScript Document
window.onload = function(){
	Selector();
	radioChick();
}

var chartData = {};

var pageState = {
	citySelect : 0,
	graSelect:0
}

function getDateStr(dat){
	var Y = dat.getFullYear();
	var M = dat.getMonth()+1;
	var D = dat.getDate();
	M = M<10? '0'+M:M;
	D = D<10? '0'+D:D;
	return Y+'-'+M+'-'+D;
}

function randBuildData(seed){
	var returnData = {};
	var dat = new Date("2016-01-01");
	var datStr = "";
	for(var i = 0;i<91;i++){
		datStr = getDateStr(dat);
		returnData[datStr] = Math.round(Math.random()*seed);
		dat.setDate(dat.getDate()+1);
	}
	return returnData;
}

var aqiSuorceData = {
	"北京":randBuildData(500),
	"上海":randBuildData(300),
	"广州":randBuildData(200),
	"深圳":randBuildData(150),
	"沈阳":randBuildData(500)
}

function Selector(){
	var Selector = document.querySelector("select");
	var inner = "";
	for(var i in aqiSuorceData){
		inner += "<option>"+i+"</option>";
	}
	Selector.innerHTML = inner;
	Selector.onchange = changCitySelect;
}

function changCitySelect(){
	var Select = document.querySelector("select")
	pageState.citySelect = this.selectedIndex;
	var city = Select[pageState.citySelect].innerHTML
	chartData = aqiSuorceData[city];
	render();
}

function render(){
	var background = document.querySelector(".aqi-chart-wrap");
	background.style.cssText = "border:1px solid black;height:500px;width:100%;display:flex;flex-warp:nowarp;align-items:flex-end;";
	var inner = "";
	for(var i in chartData){
		inner += "<div style = 'margin-right:3px;width:33%;background-color:red;height:"+chartData[i]+"px;' title = '日期:"+i+"数值:"+chartData[i]+"'></div>";
	}
	background.innerHTML = inner;
}


function graTimeChange(){
	var radio = document.getElementsByName("gra-time");
	console.log(radio);
	var index = 0;
	for(var i in radio){
		if(radio[i].checked){
			index = i;
		}
	}
	selector = document.querySelector("select");
	chartData = aqiSuorceData[selector[pageState.citySelect].innerHTML];
	switch(index){
		case "1" :
		var sum = 0,count = 0,week = 1 ,avg = 0,temp = {};
		for(var i in chartData){
			sum += chartData[i];
			count++;
			if(new Date(i).getDay() == 0){
				avg = Math.round(sum/count);
				temp[week] = avg;
				week ++;
				sum = 0;
				count = 0;
			}
		}
		temp[week]=Math.round(sum/count);
		chartData = temp;
		break;
		case "2" :
		var sum = 0,count = 0, month = 1,avg = 0,temp = {};
		for(var i in chartData){
			sum += chartData[i];
			count++;
			if(new Date(i).getMonth()+1 !== month){
				avg = Math.round(sum/count);
				console.log(avg);
				temp[month] = avg;
				month++;
				sum = 0;
				count = 0;
			}
		}
		temp[month] = Math.round(sum/count);
		chartData = temp;
		break;
	}
	render();
}


function radioChick(){
	var radio = document.querySelector("#form-gra-time");
	radio.onclick = graTimeChange;
}