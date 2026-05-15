function parseSmashed(str: string) {
  // Find all dot positions
  const dots: number[] = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '.') dots.push(i);
  }

  if (dots.length < 2) return null;

  const lastDotIdx = dots[dots.length - 1];
  const secondLastDotIdx = dots[dots.length - 2];

  const amountStr = str.substring(lastDotIdx - 1);
  const rateStr = str.substring(secondLastDotIdx - 1, lastDotIdx - 1);
  const qtyStr = str.substring(0, secondLastDotIdx - 1);

  return {
    qty: parseFloat(qtyStr),
    rate: parseFloat(rateStr),
    amount: parseFloat(amountStr)
  };
}

const tests = [
  '10.250.25',
  '22.505.00',
  '0.500.180.09'
];

tests.forEach(t => {
  console.log(`${t} =>`, parseSmashed(t));
});
