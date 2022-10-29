import XLSX from 'xlsx';

export default function writeBook({
  title,
  sampleRate,
  outputFile,
  stamps,
  log
}) {
  const book = XLSX.utils.book_new();
  book.Props = {
    Title: title,
  };
  
  const bottom = stamps.length + 2;
  const samples = stamps.length - 1;
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([
    ["Timestamp (samples)", "Interval (ms)", "Variance (ms)"],
    ["(samples)", "(ms)", "(ms)"],
    ...stamps.map((timestamp, i) => [
      timestamp,
      i === 0 ? undefined : {f: `(A${i + 3} - A${i + 2}) * 1000 / Stats!B1`},
      i === 0 ? undefined : {f: `abs(Stats!B2 - B${i + 3})`},
    ]),
  ]), "Ticks");

  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([
    ["Sample rate", sampleRate, "Hz"],
    ["Mean interval", { f: `average(Ticks!B4:B${bottom})` }, "ms"],
    ["StdDev", { f: `stdev(Ticks!B3:B${bottom})`}, "ms"],
    ["Skew", { f: `skew(Ticks!B3:B${bottom})`}],
    ["Kurtosis", { f: `kurt(Ticks!B3:B${bottom})`}],
    ["1 sigma", { f: `100 * countif(Ticks!C3:Ticks!C9, concatenate("<=", 0.5*B2)) / ${samples}`}, "%"],
    ["2 sigma", { f: `100 * countif(Ticks!C3:Ticks!C9, concatenate("<=", 1*B2)) / ${samples}`}, "%"],
    ["3 sigma", { f: `100 * countif(Ticks!C3:Ticks!C9, concatenate("<=", 1.5*B2)) / ${samples}`}, "%"]
  ]), "Stats");
  log(1, `Writing ${outputFile}`);
  XLSX.writeFile(book, outputFile);   
};
