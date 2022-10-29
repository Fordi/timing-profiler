import wav from 'node-wav';
import { readFile } from 'fs/promises';
import getRms from './getRms.mjs';
import writeBook from './writeBook.mjs';

export default async function analyze({ log, inputFile, outputFile, threshold, window, channel }) {
  const {
    sampleRate,
    channelData,
  } = wav.decode(await readFile(inputFile));
  
  const sampleWindow = Math.ceil(sampleRate * (window / 1000));
  log(1, `${sampleRate} Hz`);
  log(1, `${channelData.length} channels`);
  const signal = channelData[channel];
  log(1, `Analyzing channel ${channel}; ${signal.length} samples, ${1000 * signal.length / sampleRate}ms`);

  const rms = getRms(signal);
  const rmsThreshold = threshold * rms;

  log(1, `RMS: ${rms}`);
  log(1, `Threshold: ${rmsThreshold}`);
  
  let mode = 'searching';
  let dir = 1;
  const stamps = [];
  

  for (let i = sampleWindow; i < signal.length; i+=dir) {
    
    const curRms = getRms(signal, i - sampleWindow, i);
    let lastMode = mode;
    if (mode === 'searching') {
      if (curRms > rmsThreshold) {
        mode = 'finding zero cross';
        log(2, `${lastMode} -> ${mode} @ ${i * 1000 / sampleRate}ms`);
        dir = -1;
        continue;
      }
    }
    if (mode === 'finding zero cross') {
      if (Math.sign(signal[i]) !== Math.sign(signal[i - 1])) {
        stamps.push(i);
        mode = 'settling';
        log(2, `${lastMode} -> ${mode} @ ${i * 1000 / sampleRate}ms`);
        dir = 1;
        continue;
      }
    }
    if (mode === 'settling') {
      if (curRms <= rms * 2) {
        mode = 'searching';
        log(2, `${lastMode} -> ${mode} @ ${i * 1000 / sampleRate}ms`);
        continue;
      }
    }
  }
  log(2, 'end of sample');
  log(1, `${stamps.length} ticks found`);
  
  writeBook({
    title: `Profile for ${inputFile}`,
    stamps,
    outputFile,
    sampleRate,
    log
  });
};
