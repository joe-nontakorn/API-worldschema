const worldSchemaRoutes = require("./worldSchemaRoutes");
const countryRoutes = require("./countryRoutes");

exports.routes = ({ app }) => {
  // Importing all routes
  app.use("/api/worldschema", worldSchemaRoutes);
  app.use("/api/country", countryRoutes);
};
