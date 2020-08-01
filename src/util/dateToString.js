function DateToString(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const DateString = date.toLocaleDateString('pt-BR', options);
  return DateString;
}

module.exports = DateToString;
