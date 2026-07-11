exports.handler = async (event) => {
  console.log("Event received in collaboration:", JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "collaboration service is operational!" })
  };
};
