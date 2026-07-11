exports.handler = async (event) => {
  console.log("Event received in media:", JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "media service is operational!" })
  };
};
