import { argv, stdin as input, stdout as output  } from 'node:process';
import * as readline from 'node:readline/promises';
import { chdir, cwd } from 'node:process';
import os from 'node:os';

import * as parser from './modules/parser.js';
import * as printLog from './modules/message_output.js';
import * as engine from './modules/command_engine.js';

chdir(os.homedir());
const currDirName = cwd();

parser.parseUserName(argv.splice(2)[0])
	.then(username => {
		printLog.printHello(username, currDirName);

		const read = readline.createInterface({ input, output })
		read.on('line', (input) => {
			if(input == '.exit'){
				sayGoodByAndExit(username, read);
				return;
			}

			read.pause();
			engine.run(input, currDirName)
				.then(engineResponse => {
					if(!engineResponse.success)
						printLog.printOperationFiled();

					printLog.printCurrentDir(currDirName);
					read.resume();
				});
		})
		read.on('SIGINT', () => {
			sayGoodByAndExit(username, read);
		});
	});

const sayGoodByAndExit = (username, reader) => {
	printLog.printGoodBy(username);
	reader.close();
}