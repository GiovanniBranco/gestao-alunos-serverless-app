const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { readFile } = require("fs/promises");
const { join } = require("path");

const getClientS3Local = () => {
  return new S3Client({
    forcePathStyle: true,
    credentials: {
      accessKeyId: "S3RVER",
      secretAccessKey: "S3RVER",
    },
    endpoint: "http://localhost:4569",
  });
};

const executeUploadBucket = async () => {
  const client = getClientS3Local();

  const fileName = "cadastrar_alunos.csv";
  const pathFile = join(__dirname, fileName);
  const csvData = await readFile(pathFile, "utf-8");

  const executeUpload = new PutObjectCommand({
    Bucket: "alunos-csv-local",
    Key: fileName,
    Body: csvData,
  });

  await client.send(executeUpload);
};

const getDataCsvFile = async (bucketName, fileKey) => {
  const client = getClientS3Local();

  const executeCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  const response = await client.send(executeCommand);

  const dataCsv = await response.Body.transformToString("utf-8");

  return dataCsv;
};

module.exports = {
  executeUploadBucket,
  getDataCsvFile,
};
