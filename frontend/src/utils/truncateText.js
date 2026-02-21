export default function truncateText(str, length, word) {
  if (str.length < length) return str;
  return str.split(' ').slice(0, word).join(' ') + " ...";
}