import fs from "fs";
import axios from "axios";
import { glob } from "glob";
import { v2 as cloudinary } from "cloudinary";
import { pathToFileURL } from "url";

const dir = await glob("./img/*.*");

async function test(fileToUpload) {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  const uploaded = await cloudinary.uploader
    .upload(fileToUpload, {
      eager: {
        transformation: {
          quality: 100,
          fetch_format: "webp",
        },
      },
    })
    .catch((e) => console.log(e));

  const url = uploaded.eager[0].url;
  console.log(url);
  // return
  const fileName = fileToUpload
    .split("\\")[1]
    .split(".")[0]
    .split("_")
    .join("_");
  // .reverse()
  // return
  return { url, fileName };
}

// const downloadUrl = await test(dir[0]);

async function download(downloadUrl, fileName) {
  const format = downloadUrl.split('.').at(-1)
  const response = await axios
    .get(downloadUrl, { responseType: "arraybuffer" })
    .catch((e) => e.code);
  const buffer = response.data;
  fs.writeFile(`./output/${fileName}.${format}`, buffer, () =>
    console.log("finished downloading!")
  );
}

// download(downloadUrl);

for (let i = 0; i < dir.length; i++) {
  const { url, fileName } = await test(dir[i]);
  await download(url, fileName);
}
