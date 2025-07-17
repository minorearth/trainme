import React from "react";

// https://www.svgrepo.com/svg/454517/animal-dog-domestic-3
declare const require: {
  context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp
  ): { keys: () => string[]; (id: string): any };
};

const avatarsContext = require.context("./avatars", false, /\.tsx$/);
const avatarModules = avatarsContext.keys().map(avatarsContext);

export const avatars = avatarModules.map((Component, index) => {
  console.log("index", index);
  const AvatarComponent = Component.default || Component;
  return <AvatarComponent key={index} />;
});
