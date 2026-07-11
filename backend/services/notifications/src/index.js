exports.handler = async (event) => {
  console.log("Event received in notifications:", JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "notifications service is operational!" })
  };
};
