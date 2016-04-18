/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  console.log(dat);
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}
console.log(randomBuildData(500));
var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500),
  " 平顶山":randomBuildData(700)
};
// 用于渲染图表的数据
console.log(aqiSourceData["北京"]);
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: 0,
  nowGraTime: 0
}

function RandomColor(){
  return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
}
/**
 * 渲染图表
 */
function renderChart() {
	var background = document.querySelector(".aqi-chart-wrap");
	background.style.cssText = "width:100%;height:600px;border:1px solid black;display:flex;flex-wrap:nowarp;align-items :flex-end;margin-top:5px";
	var Source = "";
	for(i in chartData){
		Source += "<div style='height:"+chartData[i]+";width:33%;background-color:"+RandomColor()+";margin:3px' title='aqi:"+chartData[i]+"&#13Time:"+i+"'></div>";
	}
	background.innerHTML = Source;
	

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var radio = document.getElementsByName("gra-time");
  for(var i in radio){
	  if(radio[i].checked){
		  pageState.nowGraTime = i ;
	  }
  } 
  chartData = aqiSourceData[document.querySelector("select")[pageState.nowSelectCity].innerHTML];
  switch(pageState.nowGraTime){
	  case "1" : 
	  var sum = 0, count = 0,avg = 0, week = 0, temp = {};
	  for(var i in chartData){
		  
		  sum += chartData[i];
		  count++;
		  if(new Date(i).getDay() ==0){
			  avg = Math.round(sum/count);
			  temp[week] = avg;
			  week++;
			  sum =0;
			  count =0;
		  };  
	  }
	  temp[week] = Math.round(sum/count);
	  chartData = temp;
	  break;
	  case "2":
	  var sum =0, count =0 ,avg =0,month =1 ,temp={}
	  for(i in chartData){
		  sum = sum+chartData[i];
		  count++;
		  if(new Date(i).getMonth()+1 !== month){
			  avg = Math.round(sum/count);
			  temp[month] = avg;
			  month++;
			  sum = 0;
			  count = 0;
		  }
	  }
	  temp[month] = Math.round(sum/count);
	  chartData = temp;
	  console.log(chartData);
	  break;
  }
  renderChart();		  

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var Select = document.querySelector("select")
  pageState.nowSelectCity = Select.selectedIndex;
  chartData = aqiSourceData[Select[pageState.nowSelectCity].innerHTML];
  graTimeChange();
  renderChart();
  
  

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	var radio = document.getElementById("form-gra-time");
    radio.onclick = graTimeChange;
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var list = "";
  var Select = document.querySelector("select");
  for(i in aqiSourceData){
	  list += "<option>"+i+"</option>";
  }
  Select.innerHTML = list;
  Select.onchange = citySelectChange;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var Select = document.querySelector("select");
  chartData = aqiSourceData[Select[pageState.nowSelectCity].innerHTML];
  renderChart();
  
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

window.onload = function(){
	init();
}
