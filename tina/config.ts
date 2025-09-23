import { defineConfig } from "tinacms";
import {} from 'dotenv/config';

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENTID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "blog/",
  },
  media: {
    tina: {
      mediaRoot: "/blog/assets/",
      publicFolder: "",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "blog/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            required: false,
            list: true,
            ui: {
              component: 'tags',
            }
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: false,
          },
          {
            type: "boolean",
            name: "visible",
            label: "Visible",
            required: true,
            description: "Whether this post should be visible in the blog list",
            ui: {
              defaultValue: true,
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "page",
        label: "Pages",
        path: "blog/pages",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: false,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            required: false,
            list: true,
            ui: {
              component: 'tags',
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
