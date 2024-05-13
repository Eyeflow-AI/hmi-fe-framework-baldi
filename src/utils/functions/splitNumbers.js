function isInt(n) {
  return n % 1 === 0;
}

const splitNumbers = (value) => {
  let isInteger = isInt(value);
  let newValue = value;
  let integerPart = String(value).split(".")[0];
  let decimalPart = "";
  if (value > 1000) {
    integerPart = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    newValue = integerPart;
  }
  if (!isInteger) {
    decimalPart = String(value).split(".")[1];
    newValue = `${integerPart},${decimalPart}`;
  }

  return newValue;
};

export default splitNumbers;
