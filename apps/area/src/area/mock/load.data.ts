import * as fs from 'fs';
import * as path from 'path';

const location = './apps/area/src/area/mock';

const areaFile = path.join(process.cwd(), `${location}/area.json`);

const provinceFile = path.join(process.cwd(), `${location}/province.json`);

const cityFile = path.join(process.cwd(), `${location}/city.json`);

const districtFile = path.join(process.cwd(), `${location}/district.json`);

const zip_Code = path.join(process.cwd(), `${location}/post_number.json`);

const priceConfigFile = path.join(
  process.cwd(),
  `${location}/price-config.json`,
);

const priceFile = path.join(process.cwd(), `${location}/price.json`);

export const area = JSON.parse(fs.readFileSync(areaFile, 'utf-8').toString());

export const province = JSON.parse(
  fs.readFileSync(provinceFile, 'utf-8').toString(),
);

export const city = JSON.parse(fs.readFileSync(cityFile, 'utf-8').toString());

export const district = JSON.parse(
  fs.readFileSync(districtFile, 'utf-8').toString(),
);

export const zipCode = JSON.parse(
  fs.readFileSync(zip_Code, 'utf-8').toString(),
);

export const priceConfig = JSON.parse(
  fs.readFileSync(priceConfigFile, 'utf-8').toString(),
);

export const price = JSON.parse(fs.readFileSync(priceFile, 'utf-8').toString());
