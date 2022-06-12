import { Console } from 'console';
import { createWriteStream} from 'fs';

export const mondayuMyLogger = new Console({
    stdout: createWriteStream('mylogger.txt', { flags: 'a' }),
});