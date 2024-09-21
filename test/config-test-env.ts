import * as dotenv from 'dotenv';
import { join } from 'path';

const envFile = 'sample.env';
dotenv.config({ path: join(process.cwd(), envFile) });
