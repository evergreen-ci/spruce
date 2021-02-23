// Need to specify a static timezone so tests do not fail when run on computers in different regions
module.exports = async () => {
  process.env.TZ = "UTC";
};
