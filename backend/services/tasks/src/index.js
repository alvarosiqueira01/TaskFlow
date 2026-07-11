exports.handler = async (event) => {
  console.log("Event received in tasks:", JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "tasks service is operational!" })
  };
};
