import React from "react";

// https://www.svgrepo.com/svg/454517/animal-dog-domestic-3

const avatarsContext = require.context("./avatars", false, /\.jsx$/);
const avatarModules = avatarsContext.keys().map(avatarsContext);

export const avatars = avatarModules.map((Component, index) => {
  const AvatarComponent = Component.default || Component;
  return <AvatarComponent key={index} />;
});
