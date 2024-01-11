import * as fs from 'fs';
import * as path from 'path';

const file = path.join(process.cwd(), './apps/user/src/role/mock/role.json');

export const data = JSON.parse(fs.readFileSync(file, 'utf-8').toString());
