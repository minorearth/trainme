const requireContext = require.context("./lottiefiles", false, /\.json$/);
const lottieFiles = {};

requireContext.keys().forEach((filename) => {
  const key = filename.replace("./", "").replace(".json", "");
  lottieFiles[key] = requireContext(filename);
});

export const getLottie = (name) => {
  return lottieFiles[name];
};
