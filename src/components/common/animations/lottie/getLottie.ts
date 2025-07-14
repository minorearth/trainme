declare const require: {
  context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp
  ): { keys: () => string[]; (id: string): any };
};

const requireContext = require.context("./lottiefiles", false, /\.json$/);
const lottieFiles: { [key: string]: string } = {};

requireContext.keys().forEach((filename: string) => {
  const key = filename.replace("./", "").replace(".json", "");
  lottieFiles[key] = requireContext(filename);
});

export const getLottie = (name: string) => {
  return lottieFiles[name];
};
