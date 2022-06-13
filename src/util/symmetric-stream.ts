import { Transform } from "stream";

const symmetricLine = new Transform({
  transform(chunk, encoding, callback) {
    let numQuotes = 0;
    let lastPos;

    // Look for quote (") character
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 34) {
        continue;
      }

      // When encountering "double quotes" (""), skip ahead
      if (chunk[i + 1] === 34) {
        i++;
        continue;
      }

      // When encountering a single quote character, record the number of times
      // it occurs and the last position it was found at
      numQuotes++;
      lastPos = i;
    }

    // If we have an odd number of quote characters on a line (we're assuming
    // each chunk here is a line), replace the last single quote character found
    // with a space
    if (numQuotes % 2 !== 0) {
      chunk[lastPos] = 32;
    }

    // Push the chunk back onto the other end of the stream. If the buffer is empty,
    // we don't want to add a newline (doesn't play well with csv-parser etc)
    this.push(chunk.length ? `${chunk}\n` : chunk);
    console.log(chunk.length ? `${chunk}\n` : chunk);
    callback();
  },
});

export default symmetricLine;
