/**
 * King shah family tree assignment,
 * This file is just an entry point, refer the internal class structures for more details
 */
import App from "./app";
import { writeFileSync } from "fs";

const app = new App();

const fileLocation = process.argv[2];

let resultSet = "";

const outputLog = console.log;
console.log = function (result) {
	outputLog(result);
	resultSet += result + "\n";
};

app.parseInputFile(fileLocation);

writeFileSync(`${process.cwd()}/output.txt`, resultSet);
