const { parse } = require("fast-csv");

const emailRegex = /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const convertCsvData = async (data) => {
  const result = await new Promise((resolve, reject) => {
    const students = [];

    const stream = parse({
      headers: ["nome", "email"],
      renameHeaders: true,
    })
      .validate((student) => emailRegex.test(student.email))
      .on("data", (student) => students.push(student))
      .on("error", () => reject(new Error("Couldn't parse data")))
      .on("end", () => resolve(students));

    stream.write(data);
    stream.end();
  });

  if (result instanceof Error) throw result;

  return result;
};

module.exports = { convertCsvData };
