require("dotenv").config();
const crypto = require("crypto");
const axios = require("axios");

// S3 bucket config
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const S3_REGION = process.env.S3_BUCKET_REGION;
const AWS_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

// Helper function to create the SigV4 signing key
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto
    .createHmac("sha256", "AWS4" + key)
    .update(dateStamp)
    .digest();
  const kRegion = crypto
    .createHmac("sha256", kDate)
    .update(regionName)
    .digest();
  const kService = crypto
    .createHmac("sha256", kRegion)
    .update(serviceName)
    .digest();
  return crypto.createHmac("sha256", kService).update("aws4_request").digest();
}

// Building the endpoint URL + required auth headers
function createAuthHeaders(method, key, payload = "") {
  const host = `${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;
  const endpoint = `https://${host}/${encodeURIComponent(key)}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "") + "Z";
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${S3_REGION}/s3/aws4_request`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const payloadHash = crypto.createHash("sha256").update(payload).digest("hex");

  // 1) Canonical request
  const canonicalRequest = [
    method,
    `/${key}`,
    "",
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
    "",
    signedHeaders,
    payloadHash,
  ].join("\n");
  console.log(canonicalRequest);
  // 2) String to sign
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");
  console.log(stringToSign);
  // 3) Signature
  const signingKey = getSignatureKey(
    AWS_SECRET_ACCESS_KEY,
    dateStamp,
    S3_REGION,
    "s3"
  );
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  // 4) Authorization header
  const authorizationHeader = [
    `AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY_ID}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(",");

  return {
    endpoint,
    headers: {
      Authorization: authorizationHeader,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      host: host,
    },
  };
}

exports.save = async (id, buffer) => {
  const { endpoint, headers } = createAuthHeaders("PUT", id, buffer);
  const opts = {
    headers: {
      ...headers,
      "Content-Type": "application/octet-stream",
      "Content-Length": buffer.length,
    },
  };

  await axios.put(endpoint, buffer, opts);
};

exports.retrieve = async (id) => {
  const { endpoint, headers } = createAuthHeaders("GET", id);
  const opts = {
    headers,
    responseType: "arraybuffer",
  };

  const res = await axios.get(endpoint, opts);
  return Buffer.from(res.data);
};
