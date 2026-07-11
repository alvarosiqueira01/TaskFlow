exports.handler = async (event) => {
  console.log("Event received in auth:", JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "auth service is operational!" })
  };
};
