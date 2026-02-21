export default function numberWithCommas(number) {
  return "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // return number.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
}