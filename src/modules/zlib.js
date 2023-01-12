import path from 'node:path';
import  { pipeline } from 'node:stream';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';

import { checkFileDestination, checkFolderDestination, getDestination } from './parser.js';

export const compress = (command_line) => {
	return new Promise((resolve, reject) => {
		try{
			const destination = getDestination(command_line, 1, 3);

			if(!destination || !destination.first || !destination.second){
				resolve(false);
			}

			const fileName = path.basename(destination.first);

			const gzipBrotli = createBrotliCompress();
			const fileFrom = createReadStream(destination.first);
			const fileTo = createWriteStream(path.join(destination.second, fileName + '.gz'));

			pipeline(fileFrom, gzipBrotli, fileTo, (err) => {
				if(err){
					resolve(false);
				}else{
					console.log('File ' + fileName + ' successfully compressed');
					resolve(true);
				}
			})
		}catch(err){
			resolve(false);
		}
	})
}

export const decompress = (command_line) => {
	return new Promise((resolve, reject) => {
		try{
			const destination = getDestination(command_line, 1, 3);

			if(!destination || !destination.first || !destination.second){
				resolve(false);
			}

			const fileName = path.parse(destination.first).name;

			const gzipBrotli = createBrotliDecompress();
			const fileFrom = createReadStream(destination.first);
			const fileTo = createWriteStream(path.join(destination.second, fileName));

			pipeline(fileFrom, gzipBrotli, fileTo, (err) => {
				if(err){
					resolve(false);
				}else{
					console.log('File ' + path.basename(fileName) + ' successfully decompressed');
					resolve(true);
				}
			})
		}catch(err){
			resolve(false);
		}
	})
}