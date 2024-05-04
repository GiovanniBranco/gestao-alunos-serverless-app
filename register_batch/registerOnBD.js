const BASE_URL_API = "https://test.com";

const registerOnBD = async (students) => {
  const promises = students.map((student) => {
    return fetch(BASE_URL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
  });

  const responses = await Promise.all(promises);

  if (responses.some((response) => !response.ok))
    throw new Error("Occurred a error while registering");
};

module.exports = { registerOnBD };
