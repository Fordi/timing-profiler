# timing-profiler

Little tool for Wintergatan to use in his timing test rig.

Give it a `wav` file, and it will:

* Look for a signal that rises over a threshold
* Find the sample of the first zero-crossing preceding that signal
* Report all sample locations matching that description it finds in a spreadsheet,
  along with formulae to help them be statistically meaningful.

```
Usage: node . -i {input.wav} -o {output.xlsx} [-t {noiseThreshold}] [-w {rmsWindow}] [-c {channel}] [-v]
    -i {input.wav}      Input .wav file
    -o {output.xlsx}    Output .xls file
    -t {noiseThreshold} Noise threshold as multiple of whole-file RMS (default: 10)
    -w {rmsWindow}      Size of window for volume detection in ms (default: 1)
    -c {channel}        Channel to use (default=0)
    -v                  Increase verbosity (up to twice)
```

# Initial setup

This should work on OS-X, Windows and Linux.

If you don't have node, here's how to install it quickly on any OS-X or Linux system:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
source ~/.nvm/nvm.sh
nvm use
```

Once you've got node:

```bash
npm i
```

Example of use:

```bash
node . -v -i "${HOME}/Documents/Gate 5.wav" -o "${HOME}/Documents/Gate 5.xlsx"
```

```
44100 Hz
2 channels
Analyzing channel 0; 755202 samples, 17124.761904761905ms
RMS: 0.005507570651153589
Threshold: 0.05507570651153589
8 ticks found
Writing /home/fordi/Documents/Gate 5.xlsx
```
