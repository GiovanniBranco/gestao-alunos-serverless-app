const { convertCsvData } = require("../convertCsvData");
const { registerOnBD } = require("../registerOnBD");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const getDataCsvFile = async (bucketName, fileKey) => {
  const client = new S3Client({});

  const executeCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  const response = await client.send(executeCommand);

  const dataCsv = await response.Body.transformToString("utf-8");

  return dataCsv;
};

module.exports.registerStudents = async (event) => {
  try {
    const s3Event = event.Records[0].s3;

    const bucket = s3Event.bucket.name;
    const fileKey = decodeURIComponent(s3Event.object.key.replace(/\+/g, ""));

    const fileData = await getDataCsvFile(bucket, fileKey);

    const students = await convertCsvData(fileData);

    await registerOnBD(students);

    console.log("Register successfully completed");
  } catch (error) {
    console.log(error);
  }
};
