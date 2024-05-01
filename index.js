const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

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

  const executeUpload = new PutObjectCommand({
    Bucket: "alunos-csv-local",
    Key: "teste.csv",
    Body: Buffer.from("12345"),
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

module.exports.simularUploadCsv = async (event) => {
  try {
    await executeUploadBucket();
    console.log("simule aqui o upload do arquivo");

    return {
      statusCode: 200,
      body: JSON.stringify({
        mensagem: "Simulando upload de arquivo...",
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports.cadastrarAlunos = async (event) => {
  console.log("função lamba executada pelo evento do bucker S3");
  const s3Event = event.Records[0].s3;

  const bucket = s3Event.bucket.name;
  const fileKey = decodeURIComponent(s3Event.object.key.replace(/\+/g, ""));

  const fileData = await getDataCsvFile(bucket, fileKey);

  console.log(fileData);
};
