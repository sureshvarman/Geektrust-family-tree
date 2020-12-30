import { readFileSync } from "fs";
import App from "../app";

import { messages, erroCode } from "../src/family-utils";

/**
 * Executing test based on the attached seed-data, which is sample input for the test cases
 */

describe("Problem", function () {
	const application = new App();

	let positiveData = readFileSync(
		process.cwd() + "/test/inputs/test-positive.txt",
		"utf8"
	).split("\n");

	positiveData = positiveData.filter((data) => {
		return !data.match(/\/\//) && data;
	});

	test(`It should all be positive, no "NONE" expected`, function () {
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
	});
});

/**
 * Parsing the data from the
 */
