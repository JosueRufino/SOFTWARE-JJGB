// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  app: {
    head: {
      title: "Software JJGB",
      script: [
        {
          defer: true,
          tagPosition: "bodyClose",
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/assets/puzzle.png",
        },
      ],
      meta: [{ charset: "utf-8" }],
    },
  },
  modules: ["@pinia/nuxt"],
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],
});
