exports.handler = async (event) => {
  console.log("Event received in reports:", JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "reports service is operational!" })
  };
};
