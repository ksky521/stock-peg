function getRank(data, peg = 0.7) {
    let keys = Object.keys(data);
    let result = [];
    keys.map((k) => {
        let d = data[k];
        if (d.peg && d.pe && d.G && !isNaN(d.peg) && d.peg <= peg && d.peg > 0) {
            result.push({
                id: d.id,
                name: d.name,
                peg: d.peg,
                G: d.G,
                pe: d.pe
            });
        }
    });
    return result;
}

module.exports = getRank;
