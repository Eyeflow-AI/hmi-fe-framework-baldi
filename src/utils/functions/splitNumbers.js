const splitNumbers = (value) => {
  if (value > 1000) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return value;
};

export default splitNumbers;
