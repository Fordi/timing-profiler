import { relative } from 'path';

export default function readArgs() {
  const [_, cmd, ...args] = process.argv;
  const usage = (message) => {
    if (message) {
      process.stderr.write(message + '\n');
    }
    process.stderr.write([
      `Usage: node ${relative(process.cwd(), cmd) || '.'} -i {input.wav} -o {output.xlsx} [-t {noiseThreshold}] [-w {rmsWindow}] [-c {channel}] [-v]`,
      `    -i {input.wav}      Input .wav file`,
      `    -o {output.xlsx}    Output .xls file`,
      `    -t {noiseThreshold} Noise threshold as multiple of whole-file RMS (default: 10)`,
      `    -w {rmsWindow}      Size of window for volume detection in ms (default: 1)`,
      `    -c {channel}        Channel to use (default=0)`,
      `    -v                  Increase verbosity (up to twice)`
    ].join('\n') + '\n\n');
    process.exit(message ? -1 : 0);
  };
  const config = {
    VERBOSE: 0,
    threshold: 10,
    window: 1,
    channel: 0,
    log: (level, ...args) => {
      config.VERBOSE >= level && process.stderr.write(args.join(' ') + '\n', 'utf8');
    },
  };
  if (args.length === 0) {
    usage();
  }
  for (let i = 0; i < args.length; i++) {
    switch(args[i]) {
      case '-i':
        config.inputFile = args[++i];
      break;
      case '-o':
        config.outputFile = args[++i];
      break;
      case '-t':
        config.threshold = parseFloat(args[++i]) ?? 10;
      break;
      case '-w':
        config.window = parseFloat(args[++i]) ?? 1;
      break;
      case '-v':
        config.VERBOSE++;
      break;
      case '-c':
        config.channel = parseInt(args[++i]) ?? 0;
      break;
      default: 
        usage(`Unrecognized argument: ${args[i]}`);
    }
  }
  return config;
};
