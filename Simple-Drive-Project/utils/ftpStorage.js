require("dotenv").config();
const ftp = require("basic-ftp");
const { Readable, Writable } = require("stream");

const { FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS, FTP_SECURE } = process.env;

function makeClient() {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  return client;
}

exports.save = async (id, buffer) => {
  const client = makeClient();
  try {
    await client.access({
      host: FTP_HOST,
      port: FTP_PORT,
      user: FTP_USER,
      password: FTP_PASS,
      secure: FTP_SECURE === "true",
    });

    // Converts buffer into Readable stream
    const readStream = Readable.from(buffer);

    await client.uploadFrom(readStream, id);
  } finally {
    client.close();
  }
};

exports.retrieve = async (id) => {
  const client = makeClient();
  try {
    await client.access({
      host: FTP_HOST,
      port: FTP_PORT,
      user: FTP_USER,
      password: FTP_PASS,
      secure: FTP_SECURE === "true",
    });

    const chunks = [];
    const writable = new Writable({
      write(chunk, _, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    await client.downloadTo(writable, id);

    return Buffer.concat(chunks);
  } finally {
    client.close();
  }
};
