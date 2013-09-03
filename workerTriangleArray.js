/* Forma cadenas con la configuración de los polígonos */
self.onmessage = function(ev){
    var array = ev.data.array;
    var base = ev.data.base;
    var rows = array.length;
    var i=0;
    var res = [];
    for(; i < rows; i+=2) {
        var row = array[i];
        var cols = row.length;
        var curr = array[i+1]; //tipo del primer triángulo
        var left = 0;
        var top = i/2*base;
        var bottom = top+base;
        var right = base;
        var j=0;
        for(; j < cols; j++){
            if(row[j] || curr > array[i+1]){ //a partir del primer triángulo dibujado
                if(row[j]){ //si no es una posición vacía                    
                    switch(curr%4){
                        case 1: res.push(left + ',' + top
                            + ' ' + right + ',' + top 
                            + ' ' + left + ',' + bottom);
                            break;
                        case 2: res.push(right + ',' + top
                            + ' ' + right + ',' + bottom 
                            + ' ' + left + ',' + bottom);
                            break;
                        case 3: res.push(left + ',' + top
                            + ' ' + left + ',' + bottom 
                            + ' ' + right + ',' + bottom);
                            break;
                        case 0: res.push(right + ',' + top
                            + ' ' + left + ',' + top 
                            + ' ' + right + ',' + bottom);
                            break;
                    }
                }
                curr++;
            }
            if(curr % 2 == 1 || curr == array[i+1]){ //solo aumenta en 1, 3 y posiciones antes del primer triángulo
                left += base;
                right += base;
            }
        }
    }
    var debugs = "afasd";

    data = {
        array : res,
        plane : ev.data.plane
    };
    self.postMessage(data);
}
