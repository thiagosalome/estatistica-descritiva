//Descriptive Class
var Descriptive = function(selectornumbers){
	
	// Atributos
	var Numbers = document.querySelector(selectornumbers);
	var newNumbers = [];
	var K; //Número de Classe
	var AC; //Amplitude de Classe
	var Class = []; //Array de Class
	var xi = []; //Array de média bruta
	var fi = []; //Array de frequencia
	var xifi = [];
	var F = []; 
	var xi2fi = [];
	var fr = [];
	var Fr = [];

	//Métodos
	this.descriptive = function(){
		splitNumbers();
		convertNumbers();
    sortNumbers(newNumbers);
		calcClass();
		calcRangeClass();
		addRangeClass();
		calcXi();
		calcFi();
		calcXiFi();
		calcF();
		calcXi2Fi();
		calcfr();
		calcFr();
	}

	var splitNumbers = function(){
		//Cortando elementos a partir de espaço
		Numbers = Numbers.value.trim().split(" ");
	}

	var convertNumbers = function(){
		for (var i = 0; i < Numbers.length; i++) {
			newNumbers.push(parseFloat(Numbers[i].replace(",",".")));
		}
	}

	var sortNumbers = function(array){
		for (var i = 0; i < array.length; i++)
		{
			for (var j = 0; j < array.length; j++)
			{
				if (array[i] < array[j])
				{
					aux = array[i];
					array[i] = array[j];
					array[j] = aux;
				}
			}
		}
	}

	//Calculando número de classes (K = Math.sqrt(N))
	var calcClass = function(){
		K = Math.ceil(Math.sqrt(newNumbers.length));
	}

	//Calculando Amplitude de classe (AC = AT/K)
	var calcRangeClass = function(){
		var AT = newNumbers[newNumbers.length - 1] - newNumbers[0]; //Amplitude Total
		AC = (AT/K);
		AC = Math.ceil(AC * 100) / 100;
	}

	//Adiciona a Amplitude de classe aos Números
	var addRangeClass = function(){
		var ultimate = newNumbers[0] + AC;
		for (var i = 0; i < K; i++) {
			if(Class.length == 0){
				Class.push([newNumbers[0], ultimate]);
			}
			else{
				Class.push([ultimate, Math.round((ultimate + AC) * 100) / 100]);
				ultimate = Math.round((ultimate + AC) * 100) / 100;
			}
		}
	}

	//Calcula o ponto médio de cada Classe
	var calcXi = function(){
		for (var i = 0; i < K; i++) {
			xi.push(parseFloat(((Class[i][0] + Class[i][1]) / 2).toFixed(3)));
		}
	}

	//Calcula a frequência dos números
	var calcFi = function(){
		var classBefore;
		var aux = 1;
		var visited = false;

		for (var i = 0; i < newNumbers.length; i++) {
			for (var j = 0; j < Class.length; j++) {
				if(newNumbers[i] >= Class[j][0] && newNumbers[i] < Class[j][1]){
					if(classBefore != undefined && classBefore == Class[j][0]){
						fi[i - aux] += 1;
						aux++;
					}
					else{
						//Se entrou aqui é porque passou para a próxima classe
						fi.push(+1);
					}
					classBefore = Class[j][0];
					j = Class.length;
				}
				else if(fi[j] == undefined){
					fi.push(0);
					classBefore = Class[j][0];
				}
			}
		}
	}
	
	//Calcula xi*fi (Média*Frequência)
	var calcXiFi = function(){
		if(xi.length == fi.length){
			for (var i = 0; i < xi.length; i++) {
				xifi.push(parseFloat((xi[i] * fi[i]).toFixed(3)));
			}
		}
	}

	//Calcula F (frequência acrescentada)
	var calcF = function(){
		var fiBefore = 0;
		for (var i = 0; i < fi.length; i++) {
			F.push(fiBefore + fi[i]);
			fiBefore += fi[i];
		}
	}

	//Calcula xi2*fi (Média ao quadrado*Frequencia)
	var calcXi2Fi = function(){
		if(xi.length == fi.length){
			for (var i = 0; i < xi.length; i++) {
				xi2fi.push(parseFloat((Math.pow(xi[i],2) * fi[i]).toFixed(2)));
			}
		}
	}

	//Calcula fr(fi/N)
	var calcfr = function(){
		calcSumFi();
		for (var i = 0; i < fi.length; i++) {
			fr.push(Math.round((fi[i] / sumFi)* 10000) / 10000);
		}
	}

	//Calcula Fr(F/N)
	var calcFr = function(){
		calcSumFi();
		for (var i = 0; i < F.length; i++) {
			Fr.push(Math.round((F[i] / sumFi)* 10000) / 10000);
		}
	}

	var calcSumFi = function(){
		this.sumFi = 0;
		for (var i = 0; i < fi.length; i++) {
			this.sumFi += fi[i]
		}
	}
	
	var calcSumXiFi = function(){
		this.sumXiFi = 0;
		for (var i = 0; i < xifi.length; i++) {
			this.sumXiFi += xifi[i]
		}
	}

	//Calcula e retorna Média Agrupada
	this.calcAverage = function(){
		calcSumFi();
		calcSumXiFi();
		this.average = sumXiFi / sumFi;
		return this.average;
	}

	//Calcula a moda (elemento com maior frequencia)
	this.calcModa = function(){
		this.moda = [0,0]; //[valor, local]
		for (var i = 0; i < fi.length; i++) {
			if(this.moda[0] < fi[i]){
				this.moda[0] = fi[i];
				this.moda[1] = i + 1; //O array comeca com 0
			}
		}
		return this.moda;
	}

	//Calcula a mediana (N+1/2) N é o total da frequencia
	this.calcMedium = function(){
		calcSumFi();
		this.medium = Math.floor((sumFi + 1) / 2);
		for (var i = 0; i < F.length; i++) {
			if(this.medium >= F[i] && this.medium <= F[i + 1]){
				if(this.medium == F[i]){
					this.medium = [xi[i], Math.floor((sumFi + 1) / 2)];
				}
				else{
					this.medium = [xi[i + 1], Math.floor((sumFi + 1) / 2)];
				}
			}
		}
		return this.medium;
	}

	//Calculando o quartis
	this.calcQuartis = function(){
		this.calcMedium(); //Calcula a mediana antes
		this.q1 = ((this.medium[1] - 1) + 1) / 2;
		//Verficando se a posição de q1 é decimal		
		if(this.q1 % 1 != 0){
			var p1 = Math.floor(this.q1 / 1); //Pegando as partes e arredondando para baixo
			var p2 = Math.floor(this.q1 / 1 + 1);

			p1 = calcP(p1);
			p2 = calcP(p2);

			this.q1 = [(p1 + p2) / 2, this.q1]; //[valor, posicao]
		}
		else{
			//Q1 não é decimal
			this.q1 = [calcP(this.q1), this.q1]; //[valor, posicao]
		}

		this.q2 = this.medium;
		this.q3 = this.medium[1] + this.q1[1]; //Pegando a soma das posições da mediana + q1

		if(this.q3 % 1 != 0){
			var p1 = Math.floor(this.q3 / 1); //Pegando as partes e arredondando para baixo
			var p2 = Math.floor(this.q3 / 1 + 1);

			p1 = calcP(p1);
			p2 = calcP(p2);

			this.q3 = [(p1 + p2) / 2, this.q3]; //[valor, posicao]
		}
		else{
			//Q3 não é decimal
			this.q3 = [calcP(this.q3), this.q3]; //[valor, posicao]
		}
	}

	//Calcula o quartis caso ele seja decimal e precise ser dividido em dois números
	//Ou passando a posição de um quartis ele retorna o valor referente
	var calcP = function(p){
		for (var i = 0; i < F.length; i++) {
			if(p >= F[i] && p <= F[i + 1]){
				if(p == F[i]){
					p = xi[i];
				}
				else{
					p = xi[i + 1];
				}
			}
		}
		return p;
	}

	/*---------------------
				Draw Numbers
	---------------------*/
	this.drawNumbers = function(){
		var numbersDraw = '<h2 class="title-description">Listagem de Números</h2><p class="listnumbers">x = { </p>'
		document.querySelector('main .container').insertAdjacentHTML('beforeend', numbersDraw);
		for (var i = 0; i < newNumbers.length; i++) {
			if(newNumbers[i] == newNumbers[newNumbers.length - 1]){
				var teste = newNumbers[i] + ' } ';
			}
			else{
				var teste = newNumbers[i] + ' - ';
			}
			document.querySelector('.listnumbers').insertAdjacentHTML('beforeend', teste);
		}
	}

	/*---------------------
				Draw Table
	---------------------*/
	this.drawTable = function(){
		var table = '<h2 class="title-description">Tabela</h2>'+
								'<table class="table" border="1">'+
									'<thead>'+
										'<tr>'+
											'<th>Classes</th>'+
											'<th>xi (Média)</th>'+
											'<th> (Frequência)</th>'+
											'<th>xifi</th>'+
											'<th>F (Frequência Acumulada)</th>'+
											'<th>xi2fi</th>'+
											'<th>fr</th>'+
											'<th>Fr</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody>'+
									'</tbody>'+
								'</table>';
		document.querySelector('main .container').insertAdjacentHTML('beforeend', table);

		//Listando as rows com as informações
		for (var i = 0; i < Class.length; i++) {
			var row = '<tr>'+
									'<td>' + Class[i][0] + ' -- ' + Class[i][1] + '</td>'+
									'<td>' + xi[i] + '</td>'+
									'<td>' + fi[i] + '</td>'+
									'<td>' + xifi[i] + '</td>'+
									'<td>' + F[i] + '</td>'+
									'<td>' + xi2fi[i] + '</td>'+
									'<td>' + fr[i] + '</td>'+
									'<td>' + Fr[i] + '</td>'+
								'</tr>';
			
			document.querySelector('tbody').insertAdjacentHTML('beforeend', row);
		}
	}

	/*---------------------
				Draw Info
	---------------------*/
	this.drawInfo = function(){
		this.calcAverage();
		this.calcModa();
		this.calcMedium();
		this.calcQuartis();
		var infoDraw = '<h2 class="title-description">Informações Complementares</h2>'+
										'<ul class="info-complement">'+
											'<li><strong>Média:</strong> ' + this.average + '</li>'+
											'<li><strong>Moda:</strong></br>Valor - ' + this.moda[0] + '</br>Posição - ' + this.moda[1] + '</li>'+
											'<li><strong>Mediana:</strong></br>Valor - ' + this.medium[0] + '</br>Posição - ' + this.medium[1] + '</li>'+
											'<li><strong>Quartis:</strong>' +
													'<ul>'+
														'<li><strong>Q1:</strong></br>Valor - ' + this.q1[0] + '</br>Posição - ' + this.q1[1] + '</li>'+
														'<li><strong>Q2:</strong></br>Valor - ' + this.q2[0] + '</br>Posição - ' + this.q2[1] + '</li>'+
														'<li><strong>Q3:</strong></br>Valor - ' + this.q3[0] + '</br>Posição - ' + this.q3[1] + '</li>'
													'</ul>'+
											'</li>'+
										'</ul>';

		document.querySelector('main .container').insertAdjacentHTML('beforeend', infoDraw);
	}


	/*---------------------
			Draw Histogram
	---------------------*/
	this.drawChartHistogram = function(){
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawVisualization);


		function drawVisualization() {

      var matriz = [];

      for (var i = 0; i < Class.length; i++) {
      	matriz.push([Class[i][0] + ' - ' + Class[i][1], fr[i], fr[i]]);
      }

      //Adicionando elementos no inicio do vetor (push é no final)
      matriz.unshift(['Classe', 'Frequência', 'Frequência']);

      var data = google.visualization.arrayToDataTable(matriz);


      var options = {
      	title : 'Histograma - Classe por Frequência Relativa',
      	vAxis: {title: 'fr (y)'},
      	hAxis: {title: 'Classes (x)'},
      	seriesType: 'bars',
      	series: {1: {type: 'line'}},
				legend: {position: 'none'},
				colors: ['#003254', '#333333']
      };

      //Criando elemento para colocar gráfico
      var chartContent = '<h2 class="title-description">Gráfico Histograma</h2><div id="charContent"></div>';
      document.querySelector('main .container').insertAdjacentHTML('beforeend', chartContent);

      var chart = new google.visualization.ComboChart(document.getElementById('charContent'));
      chart.draw(data, options);
    }
	}

	/*---------------------
			Draw Ogiva
	---------------------*/
	this.drawChartOgiva = function(){
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);


		function drawChart() {

			var matriz = [];

			//Como o 0 taḿbém conta então eu acrescento no vetor de Fr
			Fr.unshift(0); 
			//Para ficar do mesmo tamanho que Fr eu adiciono mais um índice ao final que começa com o último valor do índice anterior
			Class.push([Class[Class.length - 1][1], undefined]);	

			for (var i = 0; i < Class.length; i++) {
				matriz.push([Class[i][0], Fr[i], Fr[Fr.length - 1 - i]]);
			}

      //Adicionando elementos no inicio do vetor (push é no final)
      matriz.unshift(['Classe', 'Frequência', 'Frequência']);

      var data = google.visualization.arrayToDataTable(matriz);

      var options = {
        title: 'Frequências Relativas',
        curveType: 'function',
        legend: { position: 'none' },
        colors: ['#003254', '#333333']
      };

      //Criando elemento para colocar gráfico
      var chartContentOgiva = '<h2 class="title-description">Gráfico OGIVA</h2><div id="charContentOgiva"></div>';
      document.querySelector('main .container').insertAdjacentHTML('beforeend', chartContentOgiva);

      var chart = new google.visualization.LineChart(document.getElementById('charContentOgiva'));
      chart.draw(data, options);
    }
	}

	//Getters
	this.getNumbers = function(){
		return newNumbers;
	}
}				