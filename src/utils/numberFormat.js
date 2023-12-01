
exports.numberFormat = (Number, minDigit, maxDigit) => {

    let _mindigit = minDigit ?? 0;
    let _maxdigit = maxDigit ?? 0;

    return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: _mindigit,
        maximumFractionDigits: _maxdigit 
    }).format(Number)

}