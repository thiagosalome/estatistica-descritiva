var btn_generate = document.querySelector('.btn-generate');

btn_generate.onclick = function(e){
	e.preventDefault();
	var statistic = new Descriptive('#numbers');
	statistic.descriptive();

	//Draws
	statistic.drawNumbers();
	statistic.drawTable();
	statistic.drawInfo();
	statistic.drawChartHistogram();
	statistic.drawChartOgiva();
}

