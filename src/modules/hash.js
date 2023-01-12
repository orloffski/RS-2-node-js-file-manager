import fs from 'node:fs';
import crypto from 'node:crypto';

import { checkFileDestination } from './parser.js';

export const getHash = async(command_line) => {
	return new Promise((resolve, reject) => {
		const filePath = command_line.split(' ')[1];

		if(!checkFileDestination(filePath)
			.then(value => value)
			.catch(err => false)){

			resolve(false);
		}

		const fileReadStream = fs.createReadStream(filePath);
		const hash = crypto.createHash('sha256');

		fileReadStream.pipe(hash);

		fileReadStream.on('data', chunk => hash.update(chunk));

		fileReadStream.on('end', () => {
			hash.end();
			console.log(hash.digest('hex'));
			resolve(true);
		});

		fileReadStream.on('error', () => {
			resolve(false);
		})
	})
}