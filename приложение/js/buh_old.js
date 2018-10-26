
function start(){
        var line = new Array();//массив строк
        
        //line[1] = "(x^4)(y^5)(z^3)+3(x^3)(y^4)(z^2)+2xyz+z+x+y+xy";
        //line[0] = "4(x^5)(y^5)(z^4)-3(x^3)(y^4)(z^2)+(x^2)(y^5)(z^2)+xyz+xz";
        //line[0] = "(x^4)(y^5)(z^3)+3(x^3)(y^4)(z^2)+x";
        //line[1] = "4(x^6)(y^6)(z^6)+4(x^5)(y^4)(z^4)-3(x^3)(y^4)(z^2)";
        //line[0] = "2x+2y+22z+1";
        //line[1] = "x+y+11z";
        //line[0] = "4(x^6)(y^6)(z^6)+4(x^5)(y^4)(z^4)-3(x^3)(y^4)(z^2)";
        //line[1] = "4(x^6)(y^6)(z^6)+4(x^5)(y^4)(z^4)-3(x^3)(y^4)(z^2)";
        //парсим строки(Разбиваем строки массив строковых мономов)
        //сначала разбиваем знаком +
      
        line[0] = "x";
        line[1] = "y";
        line[2] = "xy+z";
       
        var k = 0;
        $('.ur').each(function(){
            line[k] = $(this).val();
            k++;
        });
         /* line[0] = "(x^2)-2x+(y^2)-26y+70";
        line[1] = "(x^2)-22x+(y^2)-16y+160";
        line[2] = "(x^2)-20x+(y^2)-2y+76";
         line[0] = "xy-(z^2)-z";
        line[1] = "(x^2)-x-yz";
        line[2] = "xz-(y^2)-y";*/
        var pars_line = parse(line);//
        
        var etalon_arr = etalon(pars_line);//эталонный массив переменных
        var system = convert(pars_line, etalon_arr);
        //alert(system[0][0]['cof']);
        //var m = multi(system[0][6],system[0]);
        //alert(polHtml(sum,etalon_arr)) 
        var output='входные данные:<br>'+sysHtml(system, etalon_arr);  
        //alert(system[0][3]['stepen'][0]);
        //var nok = nokMon(system[0][0],system[1][1]);
         $('#formula').html(output);
         var basis = algoritm(system);
       //var r = residue(system[1],system[0])
      // var s = sum_pol(system[0],system[1]);
       output+=('Базис грёбнера:<br>'+sysHtml(basis,etalon_arr) + 'входные данные:<br>'+sysHtml(system, etalon_arr)) ;
        //output+=('Остаток от деления:<br>'+polHtml(r,etalon_arr)) ;
        //output+=polHtml(s, etalon_arr);
       $('#formula').html(output);
        //$('#formula').html(monHtml(des, etalon_arr));
        //$('#formula').html(polHtml(s, etalon_arr));
        
    };
    function counts(){//формирование текстовых полей для ввода уравнений
        var n = $('#count').val();
        if(n){
               var str = "";
            var i =0;
            for(i = 0;i<n;i++){
                str+='<div class="line"><input type="text" class="ur" /> = 0 </div>';
            }
            $('.urs').html(str);
            $('#start').css('display','block'); 
        }else{
            $('#start').css('display','none'); 
        }
        
    };
    
    function parse(line){
        //парсим строки(Разбиваем строки массив строковых мономов)
        //сначала разбиваем знаком +
        var i = 0;
        var j = 0;
        var k = 0;
        var pars_line=new Array();
             for ( i = 0; i<line.length; i++){//
            pars_line[i] = line[i].split("+");//получаем строковые мономы
            length = pars_line[i].length;
            for(j=0; j<length; j++){
                min_pars = pars_line[i][j].split("-");
                if(min_pars != pars_line[i][j]){
                    pars_line[i][j] = min_pars[0];
                    var len = pars_line[i].length-1;
                    for( k = 1; k < min_pars.length; k++){

                        //pars_line[i][pars_line[i].length+k-1]=("-"+min_pars[k]);//нужно запомнить минус!!!
                        pars_line[i][pars_line[i].length]=("-"+min_pars[k]);//нужно запомнить минус!!!

                    }
                }
            }
        } 
        return pars_line;
    };
    
    //ПРинемает строковый массив мономов
    //Возвращает эталонный массив переменных
    function etalon(arr){
        var result = new Array();
        var flag = true;
        var i =0;
        var j =0;
        var l = 0;
        var k = 0;
        for(i=0;i<arr.length; i++){
           
            for(j=0; j<arr[i].length;j++){
                 //alert(j);
                  //alert(arr[i][j]);
                for(k=0;k<arr[i][j].length;k++)//
                
                if(/[a-zA-Z]/.test(arr[i][j][k])){
                        
                        for(l=0;l<result.length; l++){
                            if(result[l]==arr[i][j][k]){
                                flag=false;
                            }
                        }
                        if(flag==true){
                            result.push(arr[i][j][k]);   
                        }
                        flag = true;
                        
                }
            }
        }
        return result.sort();
        
    };
    
    
    //принимает строковый массив мономов
    //возвращает преоброванный массив
    function convert(arr,et_arr){
        var i = 0;
        var j = 0;
        var k =0;
        var result = new Object();
        for(i = 0; i<arr.length; i++){//многочлены в системе
            var tmp_pol = new Object(); 
            for(j = 0; j<arr[i].length; j++){//перебираем мономы в многочленах
                var tmp_mon = new Object();
                var tmp_step = new Array();
                
                //Выделяем коэффицент
                k = 0;//Счётчик для символов в стрлоковом мономе
                cof = '';
                if(arr[i][j][k] == '-'){
                    k ++;
                    cof += '-'
                }
                while( (/[0-9]/.test( arr[i][j][k] ))&&(k<arr[i][j].length) ){
                    
                    cof+=arr[i][j][k];
                    k++;
                  }
                if(cof==''){cof='1';}
                if(cof=='-'){cof='-1';}  
                tmp_mon['cof']=+cof;
               
                //выделяем показатели
                //k=0;
                for(l=0; l<et_arr.length; l++)
                { 
                    
                    var perem = false;
                    for(k=0; k<arr[i][j].length; k++){
                       
                        if( arr[i][j][k] == et_arr[l]){//В строковом мономе находим переменную из эталонного массива
                            perem = true;
                             
                            if(k+1<arr[i][j].length){
                                
                                if(arr[i][j][k+1] == "^"){
                                    var stepen='';
                                    k+=2;
                                    while((/[0-9]/.test( arr[i][j][k])||(arr[i][j][k])=='-')&&(k<arr[i][j].length)){ 
                                        stepen+=arr[i][j][k];
                                        k++;
                                        
                                    }
                                    
                                    tmp_step[l]=+stepen;
                                }
                                else{
                                    tmp_step[l]=1;
                                }
                            }else{
                                    tmp_step[l]=1;
                            }
                        }
                    } 
                    if(perem == false) { tmp_step[l] = 0;}
                    
                    tmp_mon['stepen'] = tmp_step;
                }
                tmp_pol[j]=tmp_mon;
                
            }
            tmp_pol['length'] = j; 
            qsort(tmp_pol,comparison);
            result[i] = tmp_pol;
        }
        result.length=i;
        return result;
            
    };

    
    function qsort(data, compare, change) {//быстрая сортировка в порядке убывания
        var a = data,
            f_compare = compare,
            f_change  = change;
     
       /* if (!a instanceof Array) { // Данные не являются массивом
            return undefined;
        };*/
      
        if (f_compare == undefined) { // Будем использовать простую функцию (для чисел)
            f_compare = function(a, b) {return ((a == b) ? 0 : ((a > b) ? 1 : -1));};
        };
        if (f_change == undefined) { // Будем использовать простую смены (для чисел)
            f_change = function(a, m, n) { var c = a[m]; a[m] = a[n];a[n] = c; };
        };
     
        var qs = function (z, r)  {
            
            var m = z,
                n = r,
               // x = a[l+r>>1];
                //x = a[Math.floor(Math.random()*(r-l+1))+l];
                x = a[z]; // Если нет желания использовать объект Math
     
            //alert(x['stepen']);
            while(m <= n) {
              
                while(f_compare(a[m], x) == 1) {m++;}
                while(f_compare(a[n], x) == -1) {n--;}
                if(m <= n) {f_change(a, m++, n--);}
            };
            if(z < n) {qs(z, n);}
            if(m < r) {qs(m, r);}
        };
        
        qs(0, a.length-1);
    };

    //функция сравнения мономов
    function comparison (a,b){
       
        for (m=0;m<a['stepen'].length; m++){
            if( a['stepen'][m] > b['stepen'][m] ){ return 1; }
            if( a['stepen'][m] < b['stepen'][m] ){  return -1; }
        }
       
        return 0;
    };
    
    function sum_pol(a,b){//Сумма полиномов
        var j = 0;
        var k = 0;
        var i = 0;
        var res = new Object();
        //alert( a[3]['cof']);
        for( i = 0; (i<a.length)&&(j<b.length); i++ ){
            //alert(i);
            q = comparison( a[i], b[j] );
             res[k] = new Object();
            switch(q){
                case 1: //a[i]>b[j]
                
                    res[k] = a[i];
                    k++;
                    if(i == (a.length-1)){
                        while(j<b.length){
                            res[k] = b [j];
                            k++;
                            j++;
                        }
                    }
                   
                    break;
                case -1: //a[i]<b[j]
                   // alert('safsd');
                    res[k] = b[j];
                    j++;
                    k++;
                    i--;
                   // alert(j);
                    if(j==(b.length)){
                        i++;
                        //alert(i);
                        while(i<a.length){
                            //alert(a[i]['cof']);
                            res[k] = a [i];
                            k++;
                            i++;
                        }
                    }
                    break;
                case 0: //a[i]==b[j]
                    if(a[i]['cof'] + b[j]['cof']!=0){
                        res[k]['cof'] = a[i]['cof'] + b[j]['cof'];
                        res[k]['stepen'] = a[i]['stepen'];
                        k++;   
                    }
                    j++;
                    if(j==(b.length)){
                        i++;
                        //alert(i);
                        while(i<a.length){
                            //alert(a[i]['cof']);
                            res[k] = a [i];
                            k++;
                            i++;
                        }
                    }
                    if(i==(a.length-1)){
                        while(j<b.length){
                            res[k] = b [j];
                            k++;
                            j++;
                        }
                    }
                     
                    break;      
            }
        }
        res.length = k;
        return res;
    }
    
    //Умножение полинома на моном
    function multi(mon,poll){
        var i = 0;
        var j = 0;
        var pol = new Object;
        //pol = poll;
        for ( i = 0; i < poll.length; i++ ){
            pol[i] = new Object();
            pol[i]['cof']= poll[i]['cof'] * mon['cof'];
            pol[i]['stepen'] = new Array();
            for( j=0; j < mon['stepen'].length; j++ ){
                pol[i]['stepen'][j] = poll[i]['stepen'][j] + mon['stepen'][j];
           } 
        }
        pol.length = poll.length; 
        return pol;
    }
    
    //деление монома на моном
    //вход а- делимое b - делитель
    //res - частное(если делится, если не делится то false)
    function divisionMon(a,b){
        var res = new Object();
        var i = 0;
        var cof ;
        if((b['cof'] != 0)&&(a['cof'] != 0)){
            res['cof'] = a['cof']/ b['cof'];
            //cof = a['cof']/ b['cof'];
            //alert(res['cof']);
            //res['cof'] = 
            /*alert(typeof(res['cof']))
            alert(typeof(Math.round(cof*100000)/100000))
          // res['cof'] = Math.round(cof*100000)/100000;*/
            //alert(Math.round(res['cof']*100000)/100000);
            //alert(res['cof']);
            //alert('next');
        }else{
            return false;
        }
        
        res['stepen'] = new Array();
        for( i = 0; i < a['stepen'].length; i++){
            if(a['stepen'][i] >= b['stepen'][i]){
                res['stepen'][i] = a['stepen'][i]-b['stepen'][i]
            }else{
                return false;
            }
        }
        //alert(res['cof']);
        //alert(res['stepen'][0]);
        return res;
    }
    
    //Получение коэффийцента для составления остатка
    //ВХОД pol1 - полином который делим, pol1 - полином на который делим
    //выход готовый коэффицент() для подстановки в формулу
    function cofDev(pol1,pol2){
        var i = 0;
        for (i = 0; i < pol1.length; i++){
            cof = divisionMon(pol1[i],pol2[0]);
            //alert(cof['cof']);
            if(cof){
                
                return cof;
            }
            
        }
        return false;
    }
    
    //Деление полиномов с остатком
    function residue(a,b)
    {
        //var i = 0;
        var res =  a;
        var c = cofDev(res,b); 
        var tmp;
        //var n = 0;
        //var flag = true;
        while(c != false){
           // n++;
          c['cof'] *= -1;
         tmp = multi(c,b);
         res = sum_pol(res,tmp);
          if(res.lenght == 0){
            return res;
          }
          c = cofDev(res,b);  
        }
        return res;
        
    }
    
    //нок мономов (без учёта коэффмцентов)
    function nokMon(a,b){
        var i = 0;
        var res = new Object();
        res['cof'] = 1;//для обработки данных у любого не нулевого монома должен быть коэффицент
        res['stepen'] = new Array();
        for( i = 0; i < a['stepen'].length; i++){

            if( a['stepen'][i] > b['stepen'][i] ){
                res['stepen'][i] = a['stepen'][i];
            }else{
                res['stepen'][i] = b['stepen'][i];
            }
        }
        return res;
    }
    
    function clone(a){//создание копии системмым
        var res = new Object();
        var i = 0;
        var j = 0;
        var k = 0;
        for(i = 0; i<a.length; i++){
            //res[i] = new Object();
            var tmp_pol = new Object();
            for (j = 0; j<a[i].length; j++){
                var tmpmon = new Object();
                tmpmon['cof'] =a[i][j]['cof'];
                var tmp_step = new Array();
                for(k=0; k<a[i][j]['stepen'].length; k++){
                    tmp_step[k] = a[i][j]['stepen'][k];
                }
                tmpmon['stepen'] = tmp_step;
                tmp_pol[j] =  tmpmon;
            }
            res[i] = tmp_pol;
            res[i].length = a[i].length;
        }
        
        res.length = a.length;
        return res;
    }
    
    
    
    function eq(p1,p2){//равенство полиномов
        var i = 0;
        var j = 0;
        if(p1.length==p2.length){
            for(i=0; i<p1.length; i++){
                if(p1[i]['cof'] != p2[i]['cof']){
                    return false;//полиномы не равны
                }
                for(j=0;j<p1[i]['stepen'].length; j++){
                    if(p1[i]['stepen'][j]!=p2[i]['stepen'][j]){
                        return false;//полиномы не равны
                    }
                }
            }
            return true;//полиномы равны
        }
        return false;
    }
    
    
    function algoritm(sys){
        var res = clone(sys);
        var tmp = clone(sys);
        
        var i = 0;
        var j = 0;
        var k = 0;
        var n = 0;
        var m = 0;
    
        while( 1 ){
            for( i = 0; i < res.length; i++ ){
                for( j = 0; j<res.length; j++ ){
                    if( i!=j ){     
                        //Вычисляем S полином
                        var tmp_nok = nokMon(res[i][0],res[j][0]);//nok
                        var s1 = multi( divisionMon( tmp_nok,res[i][0] ),res[i] );
                        tmp_nok['cof'] *= -1;
                        var s2 = multi( divisionMon( tmp_nok,res[j][0] ),res[j] );
                        var s = sum_pol( s1,s2 );
                        
                        
                        for( k=0; ( k<res.length )&&(s != 0); k++){//вычисляем остаток от деления
                            s = residue( s, res[k] );
                        }
                         var flag = true;
                         for(m=0; m<tmp.length; m++){
                                if(eq(tmp[m],s)){
                                    flag = false;
                                }
                        }
                        if((s.length != 0)&&flag){
                            tmp[tmp.length] = s;
                            tmp.length++;
                        }
                    }
                }
            }
            if( res.length != tmp.length ){
                res = clone(tmp);
                n++;
                 if(n>1000){
                    alert('Зациклилось. 1000 итераций');
                        return res;
                        
                 }
                //alert(res[res.length-1][0]['stepen']);
            }else{
                return res;
            }
           
        }
        
    }
  /* Функции для вывода формулы*/  
    function monHtml(monom, etalon){
        
        var str ='';
        var flagCof = false;//флаг будет true если коэффицент единица
        var flagStep = true; //false если хотя-бы однна степень не нулевая
        switch(monom['cof']){
            case -1:
              str = '-';
              flagCof = true;
              break;
            case 1:
               flagCof = true;
               break;
            default:
             str+= monom['cof'];
             break;
        }
       /* if(  monom['cof'] != 1){
            //alert(typeof(str));
            str+= monom['cof'];
            
        }*/
        
        var i = 0;
        for(i=0; i<monom['stepen'].length; i++){
            if(monom['stepen'][i]!=0){
            flagStep = false;
              str+=etalon[i]
              if(monom['stepen'][i]!=1){
                   str+='<span class="stepen">'+monom['stepen'][i]+'</span>'
                }  
            }
            
            
        }
        if(flagCof&&flagStep){
           str+='1'; 
        }
        return str;
    }
    
  
    function polHtml(polinom,etalon){
        var i = 0;
        if(polinom.length>0){
          var str = monHtml(polinom[0],etalon);
            for( i=1; i<polinom.length; i++){
                if(polinom[i]['cof']>0){
                    str+='+'+monHtml(polinom[i],etalon);
                }else{
                    str+=monHtml(polinom[i],etalon);
                }
            }
            return str;  
        }else{
            return 0;
        }
        
    }
    
    function sysHtml(bas, etalon){
        var str='';
        var i=0;
        for(i=0;i<bas.length;i++){
            str+='<div class="pol">'+polHtml(bas[i],etalon)+'</div>'
        }
        return str;
    }
    /* Функции для вывода формулы*/ 
    
    
    function start1(){
       
        var mon1= new Object();
        var mon2= new Object();
        var mon3= new Object();
        var mon4= new Object();
        
       mon1["cof"]=4;
      // mon1["perem"]=["x","y","z"];
       mon1["stepen"]=[2,3,4];
      
       
       mon2["cof"]=3;
        //alert(mon2["cof"]);
      // mon2["perem"]=["x","y","z"];
       mon2["stepen"]=[1,1,1]
       
       mon3["cof"]=3;
       //mon3["perem"]=["x","y","z"];
       mon3["stepen"]=[1,4,1]
       
       mon4["cof"]=1;
      // mon4["perem"]=["x","y","z"];
       mon4["stepen"]=[1,1,3];
       
       var pol1= new Object();
       pol1[0]=mon1;
       pol1[1]=mon2;
       pol1[2]=mon3;
       pol1[3]=mon4;
       
       
       
       var mon5= new Object();
       var mon6= new Object();
        
       mon5["cof"]=5;
       //mon5["perem"]=["x","y","z"];
       mon5["stepen"]=[2,1,1];
      
       
       mon6["cof"]=1;
        //alert(mon2["cof"]);
       //mon6["perem"]=["x","y","z"];
       mon6["stepen"]=[1,5,1]
       

       
       var pol2= new Object();
       pol2[0]=mon5;
       pol2[1]=mon6;
       
       
       var system= new Object();
       
       system[0]=pol1;
       system[1]=pol2;
       
       alert(system[0][0] ["cof"]);
       
      
      
      
      
    };