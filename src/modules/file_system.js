import { readdir } from 'node:fs/promises';
import fs from 'node:fs/promises';
import { chdir, cwd } from 'node:process';
import { access, constants } from 'node:fs/promises';
import path from 'node:path';
import * as parser from './parser.js';

export const ls_command = async(currentDir) => {
	try {
		const arrayForOutput = [];

		const files = await readdir(currentDir);
		for (const file of files){
			const fileItem = {
				name: file,
				type: ''
			};

			if(await access(path.join(currentDir, file), constants.F_OK)
				.then(value => true)
				.catch(err => false)){

				await fs.stat(file)
					.then(stats => {
						if(stats.isFile()){
							fileItem.type = 'file';
						}

						if(stats.isDirectory()){
							fileItem.type = 'directory';
						}

						if(stats.isDirectory() || stats.isFile()){
							arrayForOutput.push(fileItem);
						}
					})
					.catch(err => {}) // skip files without permissions
				}
		}

		arrayForOutput.sort((a,b) => {
			if (a.type < b.type) {
				return -1;
			}
			if (a.type > b.type) {
				return 1;
			}

			return 0;
		})
		console.table(arrayForOutput);

		return true;
	}catch (err){
		return false;
	}
}

export const up_command = async(currentDir) => {
	try{
		chdir(path.join(currentDir,'../'));

		return true;
	}catch(err){
		return false;
	}
}

export const cd_command = async(command_line) => {
	try{
		const destination = parser.getDestination(command_line, 1, 0).first;

		if(!destination){
			return false;
		}

		if(destination == '..'){
			return up_command(cwd());
		}

		if(path.isAbsolute(destination)){
			chdir(destination);
			return true;
		}else if(destination[destination.length - 1] == ':'){
			chdir(path.join(destination, '/'));
			return true;
		}else{
			chdir(path.join(cwd(), destination));
			return true;
		}
	}catch(err){
		return false;
	}
}