import FamilyTree from "./family-tree";
import SeedData from "./seed-data";
import DB from "./db";

import {
	Tgender,
	actions,
	relations,
	TAddChildInput,
	TGetRelationInput,
	messages,
} from "./family-utils";
import { readFileSync } from "fs";

import ResponseParser from "./response-parser";

import {
	BrotherInLawsRelation,
	SisterInLawsRelation,
	SiblingsRelation,
	MotherRelation,
	FatherRelation,
	SpouseRelation,
	PaternalAuntRelation,
	PaternalUncleRelation,
	MaternalAuntRelation,
	MaternalUncleRelation,
	ChildRelation,
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
	 * Function to query the relationships
	 * @param {string} member
	 * @param {string} relationship
	 */
	protected queryRelation(member: string, relationship: string) {
		switch (relationship.toLowerCase()) {
			case relations.SPOUSE:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new SpouseRelation())
						.getMembers()
				).parse();

			case relations.DAUGHTER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new ChildRelation())
						.getMembers(Tgender.FEMALE)
				).parse();

			case relations.SON:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new ChildRelation())
						.getMembers(Tgender.MALE)
				).parse();

			case relations.SIBLINGS:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new SiblingsRelation())
						.getMembers()
				).parse();

			case relations.BROTHER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new SiblingsRelation())
						.getMembers(Tgender.MALE)
				).parse();

			case relations.SISTER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new SiblingsRelation())
						.getMembers(Tgender.FEMALE)
				).parse();

			case relations.SISTER_IN_LAW:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new SisterInLawsRelation())
						.getMembers()
				).parse();

			case relations.BROTHER_IN_LAW:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new BrotherInLawsRelation())
						.getMembers()
				).parse();

			case relations.MATERNAL_AUNT:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new MaternalAuntRelation())
						.getMembers()
				).parse();

			case relations.PATERNAL_AUNT:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new PaternalAuntRelation())
						.getMembers()
				).parse();

			case relations.MATERNAL_UNCLE:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new MaternalUncleRelation())
						.getMembers()
				).parse();

			case relations.PATERNAL_UNCLE:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new PaternalUncleRelation())
						.getMembers()
				).parse();

			case relations.FATHER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new FatherRelation())
						.getMembers()
				).parse();

			case relations.MOTHER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(member, new MotherRelation())
						.getMembers()
				).parse();

			default:
				return "";
		}
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

				const childMember = this.familyTree
					.addMember(
						childQueryInput.child,
						childQueryInput.gender == Tgender.MALE
							? Tgender.MALE
							: Tgender.FEMALE
					)
					.getMember(childQueryInput.child);

				this.familyTree
					.buildRelation(childQueryInput.mother, new ChildRelation())
					.makeRelation(childMember);

				return messages.CHILD_ADDITION_SUCCEEDED;

			case actions.GET_RELATIONSHIP:
				const relationQueryInput = this.parseGetRelationInput(queryParams);
				return this.queryRelation(
					relationQueryInput.member,
					relationQueryInput.relationship
				);
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
