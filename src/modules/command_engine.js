import * as files from "./files.js";
import * as fs from "./file_system.js";
import * as hash from "./hash.js";
import * as os from "./os_info.js";
import { checkCommand, commands } from "./parser.js";
import { compress, decompress } from "./zlib.js";

export const run = async(command_line, currDirName) => {
	return new Promise((resolve, reject) => {
		let engineResponse = {};

		if(checkCommand(command_line)){
			runCommand(command_line, currDirName)
				.then(result => {
					engineResponse = {
						success: result
					};
					resolve(engineResponse);
				})
		}else{
			engineResponse = {
				success: false
			};
			resolve(engineResponse);
		}
	})
}


const runCommand = async(command_line, currDirName) => {
	switch(command_line.split(' ')[0]) {
		case commands[0]:  // up
			return await fs.up_command(currDirName);
		case commands[1]:  // cd
		  	return await fs.cd_command(command_line);
		case commands[2]:  // ls
			return await fs.ls_command(currDirName);
		case commands[3]:  // cat
		  	return files.cat(command_line);
		case commands[4]:  // add
		  	return files.add(command_line);
			return true;
		case commands[5]:  // rn
		  	return files.rename(command_line);
		case commands[6]:  // cp
		  	return files.copy(command_line);
		case commands[7]:  // mv
		  	return files.move(command_line);
		case commands[8]:  // rm
		  	return files.remove(command_line);
		case commands[9]:  // os
		  	return os.getInfo(command_line);
		case commands[10]:  // hash
			return await hash.getHash(command_line);
		case commands[11]:  // compress
		  	return await compress(command_line);
		case commands[12]:  // decompress
		  	return await decompress(command_line);
		default:
		  return false;
	  }
}