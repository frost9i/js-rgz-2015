"use strict";

//to do: .toFixed вынести в вывод числа, а считать с максимальной точностью
//use: Infinity для участков с бесконечным сопротивлением

function calc() {

function submitTable() {
	var init_all = [
		document.getElementById("r1").value,
		document.getElementById("x1").value,
		document.getElementById("r2").value,
		document.getElementById("x2").value,
		document.getElementById("r3").value,
		document.getElementById("x3").value,
		document.getElementById("r4").value,
		document.getElementById("x4").value,
		document.getElementById("r5").value,
		document.getElementById("x5").value,
		document.getElementById("r6").value,
		document.getElementById("x6").value,
		document.getElementById("v").value
	];
	return init_all;
}

//Initial values defined by user
var pi = Math.PI;

var init = submitTable();
//console.log (init);
/*
for (var i = 0; i<init.length; i++) { 
	//console.log(init[i]);
	if (init[i] == "") { 
		init[i] = Infinity; 
	}
}
*/
var init1 = ["1", +init[0], +init[1]];
var init2 = ["2", +init[2], +init[3]*-1];
var init3 = ["3", +init[4], +init[5]];
var init4 = ["4", +init[6], +init[7]*-1];
var init5 = ["5", +init[8], +init[9]];
var init6 = ["6", +init[10], +init[11]*-1];
var init_v = [+init[12], ""]; 

//Result variables
var result;

//Calculations

function alg2eul (n) {
	var branch = n[0];
	var a = n[1];
	var b = n[2]; 
	
	var A = (Math.sqrt((a*a) + (b*b)));
	var alpha = (Math.atan(b/a) * (180/pi));
	
	return [branch, a, b, A, alpha];
}

function eul2alg (n) {
	var branch = n[0];
	var A = n[1];
	var alpha = n[2] * (pi/180);
		
	var a = A*(Math.cos(alpha));
	var b = A*(Math.sin(alpha));
	
	return [branch, a, b, A, n[2]];
}

function print_alg(n) {
	var a = n[1].toFixed(2); 
	var b = n[2].toFixed(2);
	var branch = n[0];

	if (b < 0) {var sign = " -"; b *= -1; }
	else {sign = "+";};

	return ("R" + branch.sub() + sign + " jX" +
	branch.sub() + " = " + a + " " + sign + " " + "j" + b);
}

function print_eul(n) {
	var A = n[3].toFixed(2);
	var alpha = n[4].toFixed(2);

	if (alpha < 0) {var sign = " -"; alpha *= -1; }
	else {sign = " "};
	alpha = alpha.toString();

	return (A + "e" + sign.sup() + "j".sup() + alpha.sup());
}

function division (num,denom) {
	return [
		num[0] / denom[0],
		num[1] - denom[1]
	];
}

function multiply (x,y){
	return [
		x[3] * y[3],
		x[4] + y[4]
	];
}

function z_par(m,n) {
	// -> (Zm*Zn)/(Zm+Zn)
	
	var branch = m[0] + n[0];

	var numinator = [
		m[3] * n[3],
		m[4] + n[4] //потому что степени
	];
	
	var denominator = [
		branch,
		m[1] + n[1],
		m[2] + n[2],
	];
	
	var denom2eul = alg2eul(denominator);
	denominator = [denom2eul[3],denom2eul[4]];

	var polar = division(numinator,denominator);
	polar.unshift(branch);
	
	return eul2alg(polar);
}

function z_ser(m,n) {
	var ser = [
		m[0] + n[0],
		m[1] + n[1],
		m[2] + n[2]
	];

	return alg2eul(ser);
}


//Calculations
//All Z
var z1 = alg2eul(init1);
var z2 = alg2eul(init2);
var z3 = alg2eul(init3);
var z4 = alg2eul(init4);
var z5 = alg2eul(init5);
var z6 = alg2eul(init6);

//Series and parallel
var z_56 = z_par(z5,z6);
var z_456 = z_ser(z4,z_56);
var z_3456 = z_par(z3,z_456);
var z_23456 = z_par(z2,z_3456);
var z_123456 = z_ser(z1,z_23456);

//Voltage and current
var adapt_z = [z_123456[3],z_123456[4]];
var i_1 = division(init_v,adapt_z);
i_1.unshift("1");
i_1 = eul2alg(i_1);

var u_2 = multiply(i_1,z_23456);
u_2.unshift("2");
u_2 = eul2alg(u_2);

var adapt_u = [u_2[3],u_2[4]];
adapt_z = [z2[3],z2[4]];
var i_2 = division(adapt_u,adapt_z);
i_2.unshift("2");
i_2 = eul2alg(i_2);

adapt_z = [z3[3],z3[4]];
var i_3 = division(adapt_u,adapt_z);
i_3.unshift("3");
i_3 = eul2alg(i_3);

adapt_z = [z4[3],z4[4]];
var i_4 = division(adapt_u,adapt_z);
i_4.unshift("4");
i_4 = eul2alg(i_4);

var u_3 = multiply(i_4,z_56);
u_3.unshift("3");
u_3 = eul2alg(u_3);

adapt_u = [u_3[3],u_3[4]];
adapt_z = [z5[3],z5[4]];
var i_5 = division(adapt_u,adapt_z);
i_5.unshift("5");
i_5 = eul2alg(i_5);

adapt_z = [z6[3],z6[4]];
var i_6 = division(adapt_u,adapt_z);
i_6.unshift("6");
i_6 = eul2alg(i_6);

//Discriminant
var b_5 = init5[2] / (init5[1]*init5[1] + init5[2]*init5[2]);
var a = b_5;
var b = -1;
var c = b_5 * init6[1] * init6[1];

var D = b * b - 4 * a * c;

if (D < 0) {
	var x6 = "";
	var summary = "<br><h3>Поскольку D < 0<br>можно сделать вывод, что резонанс не возможен.</h3><br>";
	result = ["",""];
	
}
else {
	var x6 = "<b>Значение реактивного сопротивления X" + "6".sub() + " при котором наступит резонанс токов:</b><br>";
		
	var x6_1 = (-1 * b  + Math.sqrt(D)) / (2 * a);
	var x6_2 = (-1 * b  - Math.sqrt(D)) / (2 * a);

	result = [
	1e6 / (2 * pi * 50 * x6_1),
	1e6 / (2 * pi * 50 * x6_2),
	];

	var summary = "<br>Готово.<br>";

}

//Printing
var logZarr = [
"<b>1. Представим сопротивление участка в комплексной форме:</b><br>",
"Z" + "1".sub() + " = " + print_alg(init1) + " = " + print_eul(z1) + " Ом<br>",
"Z" + "2".sub() + " = " + print_alg(init2) + " = " + print_eul(z2) + " Ом<br>",
"Z" + "3".sub() + " = " + print_alg(init3) + " = " + print_eul(z3) + " Ом<br>",
"Z" + "4".sub() + " = " + print_alg(init4) + " = " + print_eul(z4) + " Ом<br>",
"Z" + "5".sub() + " = " + print_alg(init5) + " = " + print_eul(z5) + " Ом<br>",
"Z" + "6".sub() + " = " + print_alg(init6) + " = " + print_eul(z6) + " Ом<br>"
];

var logZ = "";
for (var i = 0; i<logZarr.length; i++) { logZ += logZarr[i]; }
document.getElementById("log1").innerHTML=logZ;


var log2 = [
"<b>2. Эквивалентное сопротивление Z" + "56".sub() + ":</b><br>",
"Z" + "56".sub() + " = " + print_alg(z_56) + " = " + print_eul(z_56) + " Ом<br>",
"<b>3. Эквивалентное сопротивление Z" + "456".sub() + ":</b><br>",
"Z" + "456".sub() + " = " + print_alg(z_456) + " = " + print_eul(z_456) + " Ом<br>",
"<b>4. Эквивалентное сопротивление Z" + "3456".sub() + ":</b><br>",
"Z" + "3456".sub() + " = " + print_alg(z_3456) + " = " + print_eul(z_3456) + " Ом<br>",
"<b>5. Эквивалентное сопротивление Z" + "23456".sub() + ":</b><br>",
"Z" + "23456".sub() + " = " + print_alg(z_23456) + " = " + print_eul(z_23456) + " Ом<br>",
"<b>6. Эквивалентное сопротивление всей цепи:</b><br>",
"Z = " + print_alg(z_123456) + " = " + print_eul(z_123456) + " Ом<br>"
];

var logFold = "";
for (var i = 0; i<log2.length; i++) { logFold += log2[i]; }
document.getElementById("log2").innerHTML=logFold;

var log3 = [
"<b>7. Комплекс тока в неразветвленной части цепи:</b><br>",
"I = U / Z = " + init_v[0] + " / " + print_eul(z_123456) + " = " + print_eul(i_1) + " А<br>",
"<b>8. Комплексное напряжение на зажимах 2-2':</b><br>",
"U" + "22'".sub() + " = I × Z" + "23456".sub() + " = " + print_eul(i_1) + " × " +
print_eul(z_23456) + " = " + print_eul(u_2) + " В<br>",
"<b>9. Значение тока I" + "2".sub() + " :</b><br>",
"I" + i_2[0].sub() + " = U" + "22'".sub() + " / Z" + "2".sub() + " = " +
print_eul(u_2) + " / " + print_eul(z2) + " = " + print_eul(i_2) + " А<br>",
"<b>10. Значение тока I" + "3".sub() + " :</b><br>",
"I" + i_3[0].sub() + " = U" + "22'".sub() + " / Z" + "3".sub() + " = " +
print_eul(u_2) + " / " + print_eul(z3) + " = " + print_eul(i_3) + " А<br>",
"<b>11. Значение тока I" + "4".sub() + " :</b><br>",
"I" + i_4[0].sub() + " = U" + "22'".sub() + " / Z" + "4".sub() + " = " +
print_eul(u_2) + " / " + print_eul(z4) + " = " + print_eul(i_4) + " А<br>",
"<b>12. Комплексное напряжение на зажимах 3-3':</b><br>",
"U" + "33'".sub() + " = I" + "4".sub() +" × Z" + "56".sub() + " = " +
print_eul(i_4) + " × " + print_eul(z_56) + " = " + print_eul(u_3) + " В<br>",
"<b>13. Значение тока I" + "5".sub() + " :</b><br>",
"I" + i_5[0].sub() + " = U" + "33'".sub() + " / Z" + "5".sub() + " = " +
print_eul(u_3) + " / " + print_eul(z5) + " = " + print_eul(i_5) + " А<br>",
"<b>14. Значение тока I" + "6".sub() + " :</b><br>",
"I" + i_6[0].sub() + " = U" + "33'".sub() + " / Z" + "6".sub() + " = " +
print_eul(u_3) + " / " + print_eul(z6) + " = " + print_eul(i_6) + " А<br>",
];

var logui = "";
for (var i = 0; i<log3.length; i++) { logui += log3[i]; }
document.getElementById("log3").innerHTML=logui;

var log4 = [
"<b>15. Условие возникновения резонанса токов, это равенство реактивных " +
"проводимостей b" + "5".sub() + " = b" + "6".sub() + ":</b><br>",
"b" + "5".sub() + " = " + b_5.toFixed(4) + " Ом<br>",
];

var log_dis = "";
for (var i = 0; i<log4.length; i++) { log_dis += log4[i]; }
document.getElementById("log4").innerHTML=log_dis;


var log5 = [
	"D = " + D + ";<br>",
	x6,
	"C" + "6".sub() + " = " + result[0] + " мкФ<br>",
	"C" + "6".sub() + " = " + result[1] + " мкФ<br>",
	summary,
];

var log_end = "";
for (var i = 0; i<log5.length; i++) { log_end += log5[i]; }
document.getElementById("log5").innerHTML=log_end;


}
