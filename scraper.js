import puppeteer from "puppeteer";
import fs from "fs";

import axios from "axios";
import xml2js from "xml2js";
import scrapeUrlsFromSitemapXml from "./getData.js";
import { url } from "inspector";
const jsDataStorage = [];
const sitemapUrl = "https://www.theodinproject.com/sitemap.xml";

console.log(typeof scrapeUrlsFromSitemapXml);
