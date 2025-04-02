import http from "http";
import url from "url";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import replaceTemplate from "../modules/replaceTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempOverview = fs.readFileSync(
    `${__dirname}/../templates/template-overview.html`,
    "utf-8"
);
const tempCard = fs.readFileSync(
    `${__dirname}/../templates/template-card.html`,
    "utf-8"
);
const tempProduct = fs.readFileSync(
    `${__dirname}/../templates/template-product.html`,
    "utf-8"
);

const data = fs.readFileSync(`${__dirname}/../dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const PORT = 3000; // Change port to 3000

export default function handler(req, res) {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, { "Content-Type": "text/html" });
        const cardsHtml = dataObj
            .map((el) => replaceTemplate(tempCard, el))
            .join("");

        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
        res.end(output);
    } else if (pathname === "/product") {
        const product = dataObj[query.id];
        res.writeHead(200, { "Content-Type": "text/html" });
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>Page not found!</h1>");
    }
}

// Uncomment the following block for local testing
const server = http.createServer(handler);
server.listen(PORT, "127.0.0.1", () => {
    console.log(`Listening to requests on port ${PORT}`);
});
