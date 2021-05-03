/*
   Thanks to the developer Sergey Aleksandrov
 */

window.addEventListener("load", Main_Spring, true);
function Main_Spring() {

    // *** Некие исходные данные ***
	
    var canvas = spring_canvas;
    canvas.onselectstart = function () {return false;};     // запрет выделения canvas
    var ctx = canvas.getContext("2d");                      // на ctx происходит рисование
    var w = canvas.width;                                   // ширина окна в расчетных координатах
    var h = canvas.height;                                  // высота окна в расчетных координатах

    var Pi = 3.1415926;    	      	    // число "пи"
	var g = 9.8;						// гравитационная постоянная 
	
	var T0 = 0.01;    		      	        // масштаб времени (период колебаний исходной системы)
	var k0 = 2 * Pi / T0;           	// масштаб частоты
	

	
    var m0 = 1;    		      	        // масштаб массы маятника
	var l0 = 2;							// масштаб длины маятника
	var fiZero0 = 5;						// масштаб начального угла отклонения
	var fiZero02 = 9;						// масштаб начального угла отклонения
	var fiZero03 = 10;						// масштаб начального угла отклонения

	var count = true;       // проводить ли расчет системы
        var v = 0;				// скорость тела
        var t = 0;
	var f_1 = 0.1; // угл отклонения первого маятника от положения равновесия
	var f_2 = 0.1; // угл отклонения второго маятника от положения равновесия
        var f_3 = 0.1; // угл отклонения второго маятника от положения равновесия
	var q = 5;     // маштабирующий коэффициент отклонения маятника
	
	// параметры полученные из размеров холста
    var rw = canvas.width / 100;    	var rh = canvas.height / 4;
	var x0 = canvas.width/5 + 150;
	var y0 = canvas.height/8;
    var rad0 = 15;
	
	
	
    // *** Задание вычислительных параметров ***

    var fps = 60;		      	        // frames per second - число кадров в секунду (качечтво отображения)
    var spf = 10;		      	        // steps per frame   - число шагов интегрирования между кадрами 
    var dt  = 50 * T0 / fps;    	    // шаг интегрирования (качество расчета)
    var steps = 0;                      // количество шагов интегрирования


    // *** Задание физических параметров ***

    var m = 1 * m0;                 	// масса маятника
	var l = 8 * l0;						// длина маятников
	var fiZero = 0.3 * fiZero0; 			// начальное отклонение первого маятника
	var hole = canvas.width/2 + 50;				// расстояние между закреплениями маятников по Х
	var bound_x = x0;					// координаты закрепления первого маятника по Х
	var bound_y = 10;					// координаты закрепления первого маятника по У
	

	var fiZero2 = 0.3 * fiZero02; 			// начальное отклонение первого маятника
	var fiZero3 = 0.3 * fiZero03; 			// начальное отклонение первого маятника
    

	
	// Параметры первого круга-грузика
	var circ1 = {
		x: x0,
		y: y0,
		rad: rad0,
		fill: "rgba(0, 0, 255, 1)"
	};
	
	// Параметры второго круга-грузика
	var circ2 = {
		x: x0 ,
		y: y0,
		rad: rad0,
		fill: "rgba(0, 155, 0, 1)"
	};

	// Параметры третьего круга-грузика
	var circ3 = {
		x: x0 ,
		y: y0,
		rad: rad0,
		fill: "rgba(0, 155, 0, 1)"
	};

	// *** Функция обеспечивающая "жизнь" маятников ***
	
    function control() {
        calculate();		
        draw();
        requestAnimationFrame(control);
		
    }
    control();
	// *** Функция расчетов координат ***
	
    function calculate() {                                 
	
        //if (!count) return;

        for (var s=1; s<=spf; s++) {

								
			t += dt;
			
		    f_1 = fiZero * Math.cos((1)/280000 * t) * Math.cos((1) * t); 
			// закон изменения угла отклонения первого маятника от положения равновесия

		    f_2 = fiZero2 * Math.cos((1)/280000 * t) * Math.cos((1/2) * t); 
			// закон изменения угла отклонения второго маятника от положения равновесия

		    f_3 = fiZero3 * Math.cos((1)/280000 * t) * Math.cos((1) * t); 
			// закон изменения угла отклонения третьего маятника от положения равновесия

			
			// изменение координат первого грузика
			circ1.x = (x0 + l * Math.sin(f_1) * q);
			circ1.y = 100 + (y0 + l * Math.cos(f_1) * q);
			

			// изменение координат второго грузика
			circ2.x = (circ1.x  + l * Math.sin(f_2) * q);
			circ2.y = 30 + (circ1.y + l * Math.cos(f_2) * q);

			// изменение координат третьего грузика
			circ3.x = (circ2.x  + l * Math.sin(f_3) * q);
			circ3.y = 30 + (circ2.y + l * Math.cos(f_3) * q);
	
            steps++;
            
        }

    }
	
	// *** Функция рисования объектов ***
	
    function draw() {

        ctx.clearRect(0, 0, w, h);

		
		// Стержень первого маятника
		ctx.lineWidth = 6;
        ctx.strokeStyle = "#e1974d";
		ctx.beginPath();
		ctx.moveTo(circ1.x, circ1.y);
		ctx.lineTo(x0, y0 - bound_y);
		ctx.stroke();
		
		// Круглый грузик первого маятника
		ctx.beginPath();
		ctx.arc(circ1.x, circ1.y, rad0, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'red';
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		
		
		// Рисование закрепления первого маятника
		ctx.lineWidth = 6;
                ctx.strokeStyle = "#7394cb";
		ctx.beginPath();
		ctx.moveTo(x0-20, y0 - bound_y);
		ctx.lineTo(x0+20, y0 - bound_y);
		ctx.stroke();


		// Стержень второго маятника
		ctx.lineWidth = 6;
                ctx.strokeStyle = "#e1974d";
		ctx.beginPath();
		ctx.moveTo(circ1.x, circ1.y);
		ctx.lineTo(circ2.x, circ2.y);
		ctx.stroke();
		
		// Круглый грузик второго маятника
		ctx.beginPath();
		ctx.arc(circ2.x, circ2.y, rad0, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		


		// Стержень третьего маятника
		ctx.lineWidth = 6;
                ctx.strokeStyle = "#e1974d";
		ctx.beginPath();
		ctx.moveTo(circ2.x, circ2.y);
		ctx.lineTo(circ3.x, circ3.y);
		ctx.stroke();
		
		// Круглый грузик третьего маятника
		ctx.beginPath();
		ctx.arc(circ3.x, circ3.y, rad0, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		

		
    }
	
}