const getAvg = (arrayWithNumbers: string[]) => {
    let sum = 0;
    for (let i = 0; i < arrayWithNumbers.length; i += 1) {
        sum += parseFloat(arrayWithNumbers[i]); //don't forget to add the base
    }

    const avg = sum / arrayWithNumbers.length;
    return avg;
};

exports.getAvg = getAvg;
