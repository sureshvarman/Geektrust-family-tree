import { readFileSync } from "fs";
import App from "../src/app";

import { messages, erroCode } from "../src/family-utils";

/**
 * Executing test based on the attached seed-data, which is sample input for the test cases
 */

describe("Problem", function () {
	const application = new App();

	application.showHelpers();

	let positiveData = readFileSync(
		process.cwd() + "/test/inputs/test-positive.txt",
		"utf8"
	).split("\n");

	let negativeData = readFileSync(
		process.cwd() + "/test/inputs/test-negative.txt",
		"utf-8"
	).split("\n");

	positiveData = positiveData.filter((data) => {
		return !data.match(/\/\//) && data;
	});
	negativeData = negativeData.filter((data) => {
		return !data.match(/\/\//) && data;
	});

	test(`Postive test cases`, function () {
		let output = "";
		let expected = "";

		const log = console.log;

		console.log = jest.fn((data) => {
			output += data ? " " + data : "";
		});

		for (let data of positiveData) {
			if (data) {
				const inputs = data.split("#");
				const expectedOutput = inputs[1];
				const input = inputs[0];

				expected += expectedOutput ? " " + expectedOutput : "";

				application.query(input);
			}
		}

		expect(output).toBe(expected);
		console.log = log;
	});

	test(`Negative test cases`, function () {
		let output = "";
		let expected = "";

		const log = console.log;

		console.log = jest.fn((data) => {
			output += data ? " " + data : "";
		});

		for (let data of negativeData) {
			if (data) {
				const inputs = data.split("#");
				const expectedOutput = inputs[1];
				const input = inputs[0];

				expected += expectedOutput ? " " + expectedOutput : "";

				application.query(input);
			}
		}

		expect(output).toBe(expected);
		console.log = log;
	});
});

/**
 * Parsing the data from the
 */
