export function calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length === 0) {
        return 0;
    }

    const meanX = x.reduce((a, b) => a + b, 0) / x.length;
    const meanY = y.reduce((a, b) => a + b, 0) / y.length;

    let covXY = 0;
    let varX = 0;
    let varY = 0;

    for (let i = 0; i < x.length; i++) {
        const diffX = x[i] - meanX;
        const diffY = y[i] - meanY;

        covXY += diffX * diffY;
        varX += diffX * diffX;
        varY += diffY * diffY;
    }

    covXY /= (x.length - 1);
    varX /= (x.length - 1);
    varY /= (x.length - 1);

    const stdX = Math.sqrt(varX);
    const stdY = Math.sqrt(varY);

    if (stdX === 0 || stdY === 0) {
        return 0;
    }

    return covXY / (stdX * stdY);
}

export function calculateAverage(prices) {
    if (prices.length === 0) return 0;
    return prices.reduce((a, b) => a + b, 0) / prices.length;
}
