export default function getRms(array, start = 0, end = array.length - 1) {
  let rms = 0;
  for (let i = start; i <= end; i++) {
    rms += array[i]**2;
  }
  return Math.sqrt(rms / (end - start + 1));
};
