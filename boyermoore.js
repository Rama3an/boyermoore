function good(T) {
    let good = new Array(T.length + 1);
    let array = new Array(T.length + 1);
    for (let i = 0; i < T.length + 1; ++i)
        good[i] = 0;

    let j = T.length + 1;

    array[T.length] = T.length + 1;

    for (let i = T.length; i > 0; --i) {
        while (j <= T.length && T[i - 1] != T[j - 1]) {
            if (good[j] == 0)
                good[j] = j - i;
            j = array[j];
        }
        --j;
        array[i - 1] = j;
    }

    prefCount(T, j, array, good);

    return good;
}


function prefCount(T, j, array, good){
    let pref = array[0];
    for (j = 0; j <= T.length; j++) {
        if (j == pref)
            pref = array[pref];
        if (good[j] == 0)
            good[j] = pref;
    }
}


function bad(T) {
    let bad = [];
    for (let j = 0; j < T.length; j++) {
        bad[T.charAt(j)] = j + 1;
    }
    return bad;
}

function findTinS(S, T) {
    let result = [];
    let i = 0;
    let j = 0;
    let badsuf = bad(T);
    let goodsuf = good(T);
    while (i <= S.length - T.length) {
        for (j = T.length - 1; j >= 0 && T[j] == S[i + j]; --j) ;
        if (j < 0) {
            result.push(i);
            i += goodsuf[j + 1];
        } else
            i += Math.max(
                goodsuf[j + 1],
                ((badsuf[S[i + j]]) ? Math.max(j - badsuf[S[i + j]], 1) : j));
    }
    return result;
}


let fs = require('fs');
let arg = process.argv;

fs.readFile(arg[2], (err, data1) => {
    if (err) {
        console.error(err);
        return;
    }
    let S = data1.toString();

    fs.readFile(arg[3], (err, data2) => {
        if (err) {
            console.error(err);
            return;
        }
        let T = data2.toString();

        let result = findTinS(S, T);

        let finish =  `Строка: ${S}\nПодстрока: ${T}\n`;

        if (result.length == 0)
            finish += `Не удалось найти подстроку в строке!\n`;
        else
            for (let i = 0; i < result.length; i++)
                finish += `${i + 1} вхождение слева с символа: ${result[i]}\n`;

        fs.writeFile('output.txt', finish, (err) => {
            if (err) {
                console.err(err);
                return;
            }
        });
    });
});