const sampel = require('./sample.json');

const CariPembagi = (data) => {
    const { kreteria, alternatif_kriteria} = data
    let pembagi = []
    for (let index = 0; index < kreteria.length; index++) {
        // filter kepentingan
        let kepentingan = alternatif_kriteria.filter((el) => el.kreteria_id == kreteria[index].id ).map(el => el.value)
        // set value kepentingan
        if(kreteria[index].id == 'cost') {
            pembagi.push({
                id_kreteria : kreteria[index].id,
                name : kreteria[index].name,
                value : Math.min.apply(Math, kepentingan)
            })
        } else {
            pembagi.push({
                id_kreteria : kreteria[index].id,
                name : kreteria[index].name,
                value : Math.max.apply(Math, kepentingan)
            })
        }
    }

    return pembagi
}

function normalisasi(pembagi, dataAlt) {
    let result = []
    // looping for normalisasi
    for (let index = 0; index < dataAlt.length; index++) {
        let findIdkreteria = pembagi.filter(el => {
            if (el.id_kreteria == dataAlt[index].kreteria_id) {
                result.push({
                    ...dataAlt[index],
                    value_normal : el.value,
                    value_normalisasi :  (dataAlt[index].kreteria_id > 1) ? dataAlt[index].value / el.value :  el.value /  dataAlt[index].value
                })
            }
        })
        
    }
    return result
}

function setWithObj(normalisasi, attibutes) {
    
    let tmp = {}
    
    for (let i = 0; i < normalisasi.length; i++) {
        for (let index = 0; index < attibutes.length; index++) {
            if(attibutes[index].id == normalisasi[i].kreteria_id) {
                if(tmp[normalisasi[i].alternatif_id] === undefined) {
                    tmp[normalisasi[i].alternatif_id] = [normalisasi[i].value_normalisasi ]
                } else {
                    tmp[normalisasi[i].alternatif_id] = [...tmp[normalisasi[i].alternatif_id], normalisasi[i].value_normalisasi ]
                }
            }
        }
    }
   
    return tmp
}

let hitugAltVlaue = (data, attibutes, Objectdata) => {
    let result = []
    let objKey = Object.keys(data)
    for (let index = 0; index < objKey.length; index++) {
        result.push({
            id_alternatif : objKey[index],
            name_alternatif : Objectdata[index].alternatif_name,
            value: data[objKey[index]].reduce((a, b, inx) => a + ( b * attibutes[inx].agregat), 0)
        })
    }
    return result
}

let hitungPembagi = CariPembagi(sampel)
// console.table(hitungPembagi);
let hitungNormalisasi = normalisasi(hitungPembagi, sampel.alternatif_kriteria)
// console.table(hitungNormalisasi);
let SetOBJ = setWithObj(hitungNormalisasi, sampel.kreteria)
// console.log(SetOBJ)
let hasilKualifikasi = hitugAltVlaue(SetOBJ, sampel.kreteria, sampel.alternatif)
// console.table(hasilKualifikasi);
let rangking = hasilKualifikasi.sort((a, b) => b.value - a.value)
console.table(rangking);

// convert to binary
function convertToBinary(x) {
    let bin = 0;
    let rem, i = 1, step = 1;
    while (x != 0) {
        rem = x % 2;
        console.log(
            `Step ${step++}: ${x}/2, Remainder = ${rem}, Quotient = ${parseInt(x/2)}`
        );
        x = parseInt(x / 2);
        bin = bin + rem * i;
        i = i * 10;
    }
    console.log(`Binary: ${bin}`);
}

// convertToBinary(21)