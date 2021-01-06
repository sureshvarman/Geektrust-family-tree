import FamilyTree from "./family-tree";
import SeedData from "./seed-data";
import DB from "./db";

import {
	Tgender,
	actions,
	relations,
	TAddChildInput,
	TGetRelationInput,
} from "./family-utils";
import { readFileSync } from "fs";

import ResponseParser from "./response-parser";

import {
	BrotherInLawsRelation,
	BrotherRelation,
	SisterInLawsRelation,
	SisterRelation,
	SiblingsRelation,
	MotherRelation,
	FatherRelation,
	SpouseRelation,
	PaternalAuntRelation,
	PaternalUncleRelation,
	MaternalAuntRelation,
	MaternalUncleRelation,
	SonRelation,
	DaughterRelation,
} from "./relations";

/**
 * @class App application class, where the application related logics are performed
 */
export default class App {
	familyTree: FamilyTree = new FamilyTree(new DB());

	/**
	 * App logic, it will do the seed file using the input paramaters
	 */
	constructor(fileLocation?: string) {
		const seedData = new SeedData(this.familyTree);
		seedData.seed(fileLocation);
	}

	/**
	 * Function to parse the input by spaces or tabs
	 * @param {string} queryParams
	 */
	protected parseInput(queryParams: string) {
		const params = queryParams.split(/\t|\s/);

		return params;
	}

	/**
	 * Function to parse the input for the child input
	 * @param {string} queryParams
	 */
	protected parseAddChildInput(queryParams: string): TAddChildInput {
		const params = this.parseInput(queryParams);

		return {
			gender: params[2],
			child: params[1],
			mother: params[0],
		};
	}

	/**
	 * Function to parse the input for the get child input
	 * @param {string} queryParams
	 */
	protected parseGetRelationInput(queryParams: string): TGetRelationInput {
		const params = this.parseInput(queryParams);

		return {
			relationship: params[1],
			member: params[0],
		};
	}

	/**
	 * Function to execute given actions
	 * @param action
	 * @param name
	 */
	protected doQuery(query: string, queryParams: string) {
		switch (query.toLowerCase()) {
			case actions.ADD_CHILD:
				const childQueryInput = this.parseAddChildInput(queryParams);

				return this.familyTree.addChild(
					childQueryInput.child,
					childQueryInput.gender == Tgender.MALE
						? Tgender.MALE
						: Tgender.FEMALE,
					childQueryInput.mother
				);

			case actions.GET_RELATIONSHIP:
				const relationQueryInput = this.parseGetRelationInput(queryParams);

				switch (relationQueryInput.relationship.toLowerCase()) {
					case relations.SPOUSE:
						return new ResponseParser(
							new SpouseRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.DAUGHTER:
						return new ResponseParser(
							new DaughterRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.SON:
						return new ResponseParser(
							new SonRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.SIBLINGS:
						return new ResponseParser(
							new SiblingsRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.BROTHER:
						return new ResponseParser(
							new BrotherRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.SISTER_IN_LAW:
						return new ResponseParser(
							new SisterInLawsRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.BROTHER_IN_LAW:
						return new ResponseParser(
							new BrotherInLawsRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.SISTER:
						return new ResponseParser(
							new SisterRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.MATERNAL_AUNT:
						return new ResponseParser(
							new MaternalAuntRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.PATERNAL_AUNT:
						return new ResponseParser(
							new PaternalAuntRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.MATERNAL_UNCLE:
						return new ResponseParser(
							new MaternalUncleRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.PATERNAL_UNCLE:
						return new ResponseParser(
							new PaternalUncleRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.FATHER:
						return new ResponseParser(
							new FatherRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();

					case relations.MOTHER:
						return new ResponseParser(
							new MotherRelation(this.familyTree).getMembers(
								relationQueryInput.member
							)
						).parse();
				}
				break;
		}
	}

	/**
	 * Function to display the plain text
	 */
	showHelpers() {
		console.log(
			`
			\n \t\t\t Actions supported
			\n ------------------------------------------------------------------------
			\n 1. ${actions.ADD_CHILD} 
			\n \t\tFor e.g. ${actions.ADD_CHILD} <mother name> <child name> <gender(male|female)>
			\n 2. ${actions.GET_RELATIONSHIP} 
			\n \t\tFor e.g. ${actions.GET_RELATIONSHIP} <name> <relationship>
			\n \t\t i.e. relationship = ${relations.FATHER} ${relations.MOTHER} ${relations.PATERNAL_UNCLE}, ${relations.MATERNAL_UNCLE}, ${relations.PATERNAL_AUNT}, ${relations.MATERNAL_AUNT}, ${relations.SISTER_IN_LAW}, ${relations.SON}, ${relations.DAUGHTER}, ${relations.SIBLINGS}, ${relations.SPOUSE}, ${relations.BROTHER}, ${relations.SISTER}
			`
		);
	}

	/**
	 * Function takes plain text as input and provide output based on the query
	 * with the help of doQuery function
	 * @param input
	 */
	query(input: string) {
		const query = input.match(/[a-zA-Z\_]*/);
		const params = input.split(`${query} `)[1];

		try {
			const result = this.doQuery(query[0], params);
			console.log(result);
		} catch (e) {
			console.log(e.message);
		}
	}

	/**
	 * Function to prompt for user input
	 */
	parseInputFile(fileLocation: string) {
		let inputs = readFileSync(fileLocation, "utf-8")
			.split("\n")
			.filter((data) => {
				return !data.match(/\/\//) && data; // ignoring comments
			});

		for (let input of inputs) {
			this.query(input);
		}
	}
}
