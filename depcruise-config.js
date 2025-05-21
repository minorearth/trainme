// https://www.youtube.com/watch?v=7FHHvOswIzk&ab_channel=AntonMendelson
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: {
      dependencyTypes: [
        "npm",
        "npm-dev",
        "npm-optional",
        "npm-peer",
        "npm-bundled",
        "npm-no-pkg",
      ],
    },

    includeOnly: "^src",

    tsPreCompilationDeps: false,

    /* How to resolve external modules - use "yarn-pnp" if you're using yarn's Plug'n'Play.
       otherwise leave it out (or set to the default, which is 'node_modules')
    */
    externalModuleResolutionStrategy: "yarn-pnp",

    progress: { type: "performance-log" },

    reporterOptions: {
      archi: {
        collapsePattern: "node_modules/(?:@[^/]+/[^/]+|[^/]+)",

        theme: {
          modules: [
            {
              criteria: { collapsed: false },
              attributes: { shape: "tab" },
            },
            {
              criteria: { source: "^src/app/[^/]+" },
              attributes: { fillcolor: "#ffbdbd" },
            },
            {
              criteria: { source: "^src/pages/[^/]+" },
              attributes: { fillcolor: "#ffd9a3" },
            },
            {
              criteria: { source: "^src/features/[^/]+" },
              attributes: { fillcolor: "#aedaff" },
            },
            {
              criteria: { source: "^src/ui-kit/[^/]+" },
              attributes: { fillcolor: "#efefef" },
            },
          ],
          graph: {
            splines: "ortho",
            rankdir: "TB",
            ranksep: "1",
          },
        },
      },
    },
  },
};
