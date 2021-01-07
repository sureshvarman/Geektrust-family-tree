import FamilyTree from "./family-tree";
import SeedData from "./seed-data";
import DB from "./db";

import {
	Tgender,
	Operations,
	Relations,
	TAddChildInput,
	TGetRelationInput,
	messages,
	QueryType,
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
	 * @param {string} queryParams
	 */
	protected queryRelation(queryParams: string) {
		const relationQueryInput = this.parseGetRelationInput(queryParams);
		switch (relationQueryInput.relationship.toLowerCase()) {
			case Relations.SPOUSE:
				return new ResponseParser(
					this.familyTree
						.buildRelation(relationQueryInput.member, new SpouseRelation())
						.getMembers()
				).parse();

			case Relations.DAUGHTER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(relationQueryInput.member, new ChildRelation())
						.getMembers(Tgender.FEMALE)
				).parse();

			case Relations.SON:
				return new ResponseParser(
					this.familyTree
						.buildRelation(relationQueryInput.member, new ChildRelation())
						.getMembers(Tgender.MALE)
				).parse();

			case Relations.SIBLINGS:
				return new ResponseParser(
					this.familyTree
						.buildRelation(relationQueryInput.member, new SiblingsRelation())
						.getMembers()
				).parse();

			case Relations.BROTHER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(relationQueryInput.member, new SiblingsRelation())
						.getMembers(Tgender.MALE)
				).parse();

			case Relations.SISTER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(relationQueryInput.member, new SiblingsRelation())
						.getMembers(Tgender.FEMALE)
				).parse();

			case Relations.SISTER_IN_LAW:
				return new ResponseParser(
					this.familyTree
						.buildRelation(
							relationQueryInput.member,
							new SisterInLawsRelation()
						)
						.getMembers()
				).parse();

			case Relations.BROTHER_IN_LAW:
				return new ResponseParser(
					this.familyTree
						.buildRelation(
							relationQueryInput.member,
							new BrotherInLawsRelation()
						)
						.getMembers()
				).parse();

			case Relations.MATERNAL_AUNT:
				return new ResponseParser(
					this.familyTree
						.buildRelation(
							relationQueryInput.member,
							new MaternalAuntRelation()
						)
						.getMembers()
				).parse();

			case Relations.PATERNAL_AUNT:
				return new ResponseParser(
					this.familyTree
						.buildRelation(
							relationQueryInput.member,
							new PaternalAuntRelation()
						)
						.getMembers()
				).parse();

			case Relations.MATERNAL_UNCLE:
				return new ResponseParser(
					this.familyTree
						.buildRelation(
							relationQueryInput.member,
							new MaternalUncleRelation()
						)
						.getMembers()
				).parse();

			case Relations.PATERNAL_UNCLE:
				return new ResponseParser(
					this.familyTree
						.buildRelation(
							relationQueryInput.member,
							new PaternalUncleRelation()
						)
						.getMembers()
				).parse();

			case Relations.FATHER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(relationQueryInput.member, new FatherRelation())
						.getMembers()
				).parse();

			case Relations.MOTHER:
				return new ResponseParser(
					this.familyTree
						.buildRelation(relationQueryInput.member, new MotherRelation())
						.getMembers()
				).parse();

			default:
				return "";
		}
	}

	protected addMember(operation: string, queryParams: string) {
		switch (operation.toLowerCase()) {
			case Operations.ADD_CHILD:
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
		}
	}

	/**
	 * Function to get the query type
	 * @param {string} queryString
	 *
	 * @returns {string}
	 */
	protected getQueryType(queryString: string) {
		const query = queryString.split("_");
		const operation = query[0];

		if (operation.toLowerCase() == QueryType.ADDITTION.toLowerCase()) {
			return QueryType.ADDITTION;
		}

		return QueryType.GET_RELATIONSHIP;
	}

	/**
	 * Function to execute given actions
	 * @param action
	 * @param name
	 */
	protected doQuery(query: string, queryParams: string) {
		const queryType = this.getQueryType(query);

		switch (queryType) {
			case QueryType.ADDITTION:
				return this.addMember(query, queryParams);

			case QueryType.GET_RELATIONSHIP:
				return this.queryRelation(queryParams);
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
			\n 1. ${Operations.ADD_CHILD} 
			\n \t\tFor e.g. ${Operations.ADD_CHILD} <mother name> <child name> <gender(male|female)>
			\n 2. ${Operations.GET_RELATIONSHIP} 
			\n \t\tFor e.g. ${Operations.GET_RELATIONSHIP} <name> <relationship>
			\n \t\t i.e. relationship = ${Relations.FATHER} ${Relations.MOTHER} ${Relations.PATERNAL_UNCLE}, ${Relations.MATERNAL_UNCLE}, ${Relations.PATERNAL_AUNT}, ${Relations.MATERNAL_AUNT}, ${Relations.SISTER_IN_LAW}, ${Relations.SON}, ${Relations.DAUGHTER}, ${Relations.SIBLINGS}, ${Relations.SPOUSE}, ${Relations.BROTHER}, ${Relations.SISTER}
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
