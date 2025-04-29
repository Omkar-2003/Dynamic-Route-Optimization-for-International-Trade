
const sdk = require("@api/searoutes-docs");
sdk.auth("");

const FindSearoute = async (req, res) => {
  try {
    const mumbaiCoordinates = req.body.src;
    const canadaCoordinates = req.body.dest;
    const blockAreas = req.body.blockarea;
    // Assuming you have to wait for SDK response
    const data = await sdk.getSeaRoute({
      continuousCoordinates: "true",
      allowIceAreas: req.body.allowIceAreas,
      avoidHRA: req.body.avoidHRA,
      avoidSeca: req.body.avoidSeca,
      speed: req.body.speed,
      coordinates: `${mumbaiCoordinates};${canadaCoordinates}`,
    });
    console.log(data);
    // Send data in the response
    res.status(200).json({ message: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error"); // Send appropriate error response
  }
};

module.exports = {
  FindSearoute,
};
