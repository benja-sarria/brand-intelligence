const getPhnticAvg = (arrayWithBooleans: boolean[]) => {
    let sum = 0;
    for (let i = 0; i < arrayWithBooleans.length; i += 1) {
        if (arrayWithBooleans[i] === true) {
            sum += 1;
        }
    }

    const avg = sum / arrayWithBooleans.length;
    return avg;
};

exports.getPhnticAvg = getPhnticAvg;
