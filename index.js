const sampel = require('./sample.json');

// Pencarian data cost dan benefit
const CariPembagi = (data) => {
    const { kreteria, alternatif_kriteria } = data;
    let pembagi = [];
    for (const kriteria of kreteria) {
        // Filter kepentingan
        let kepentingan = alternatif_kriteria.filter(el => el.kreteria_id == kriteria.id).map(el => el.value);
        // Set value kepentingan
        pembagi.push({
            id_kreteria: kriteria.id,
            name: kriteria.name,
            value: kriteria.type == 'cost' ? Math.min(...kepentingan) : Math.max(...kepentingan)
        });
    }
    return pembagi;
};

// Normalisasi data 
const normalisasi = (pembagi, dataAlt) => {
    return dataAlt.map(da => {
        let pembagiItem = pembagi.find(p => p.id_kreteria == da.kreteria_id);
        return {
            ...da,
            value_normal: pembagiItem.value,
            value_normalisasi: da.kreteria_id > 1 ? da.value / pembagiItem.value : pembagiItem.value / da.value
        };
    });
};

// Setting to object
const setWithObj = (normalisasi, attibutes) => {
    return normalisasi.reduce((acc, norm) => {
        if (!acc[norm.alternatif_id]) acc[norm.alternatif_id] = [];
        acc[norm.alternatif_id].push(norm.value_normalisasi);
        return acc;
    }, {});
};

// Perhitungan data object di kali dengan bobot masing-masing kriteria
const hitugAltVlaue = (data, attibutes, Objectdata) => {
    return Object.keys(data).map((key, index) => {
        return {
            id_alternatif: key,
            name_alternatif: Objectdata[index].alternatif_name,
            value: data[key].reduce((a, b, inx) => a + (b * attibutes[inx].agregat), 0)
        };
    });
};

let hitungPembagi = CariPembagi(sampel);
let hitungNormalisasi = normalisasi(hitungPembagi, sampel.alternatif_kriteria);
let SetOBJ = setWithObj(hitungNormalisasi, sampel.kreteria);
let hasilKualifikasi = hitugAltVlaue(SetOBJ, sampel.kreteria, sampel.alternatif);
let rangking = [...hasilKualifikasi].sort((a, b) => b.value - a.value); // Gunakan spread operator untuk membuat array baru

console.table(rangking);