import fs from 'fs';
import axios from 'axios';
import { glob } from 'glob';
import { v2 as cloudinary } from 'cloudinary';
import { pathToFileURL } from 'url';


const dir = await glob('./img/*.*');

async function test(fileToUpload) {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET, // Click 'View Credentials' below to copy your API secret
    });

    const uploaded = await cloudinary.uploader
        .upload(fileToUpload, { eager: { transformation: { quality: "50", width: 500,crop: "scale", fetch_format: "webp" } } })
        .catch((e) => console.log(e));

    console.log(uploaded.eager);
    return uploaded.eager[0].url;
}

const downloadUrl = await test(dir[0]);

async function download(downloadUrl) {
    const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' }).catch(e =>e.code);
    const buffer = response.data;
    fs.writeFile(`./image.webp`, buffer, () => console.log('finished downloading!'));
}

download(downloadUrl);

// testing the gpush
