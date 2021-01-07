import FamilyTree from "./family-tree";
import SeedData from "./seed-data";
import DB from "./db";

import {
	Tgender,
	Operations,
	Relations,
	TGetRelationInput,
	QueryType,
	TAddMemberInput,
	Irelation,
} from "./family-utils";
import { readFileSync } from "fs";

import ResponseParser from "./response-parser";
import RelationShipFactory from "./relations/factory";

/**
 * @class App application class, where the application related logics are performed
 */
export default class App {
	private familyTree: FamilyTree = new FamilyTree(new DB());
	private relationFactory = new RelationShipFactory();

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
	protected parseAddMemberInput(queryParams: string): TAddMemberInput {
		const params = this.parseInput(queryParams);

		return {
			relationMember: params[0],
			firstMember: params[1],
			gender:
				params[2] && params[2].toLowerCase() == Tgender.MALE
					? Tgender.MALE
					: Tgender.FEMALE,
			viaMember: params[3],
		};
	}

	/**
	 * Function to build relation using Irelation
	 * @param {Irelation} relation Irelation to be build
	 * @param {string} firstMember first member stirng
	 * @param {Tgender} gender gender as string
	 * @param {string} relationMember relationmember string
	 * @param {string} viaMember via member string
	 */
	protected buildRelation(
		relation: Irelation,
		firstMember: string,
		gender: Tgender,
		relationMember: string,
		viaMember?: string
	) {
		const member = this.familyTree
			.addMember(firstMember, gender)
			.getMember(firstMember);

		if (viaMember) {
			this.familyTree
				.buildRelation(relationMember, relation)
				.makeRelation(member, this.familyTree.getMember(viaMember));
		} else {
			this.familyTree
				.buildRelation(relationMember, relation)
				.makeRelation(member);
		}
	}

	/**
	 * Function to parse the input for the get child input
	 * @param {string} queryParams
	 */
	protected parseGetRelationInput(queryParams: string): TGetRelationInput {
		const params = this.parseInput(queryParams);

		return {
			relationship: <Relations>params[1].toLowerCase(),
			member: params[0],
		};
	}

	/**
	 * Function to query the relationships
	 * @param {string} queryParams
	 */
	protected queryRelation(queryParams: string) {
		const relationQueryInput = this.parseGetRelationInput(queryParams);

		const relationShipBuilder = this.relationFactory.getRelationshipParser(
			relationQueryInput.relationship
		);

		return new ResponseParser(
			this.familyTree
				.buildRelation(relationQueryInput.member, relationShipBuilder.Relation)
				.getMembers(relationShipBuilder.gender)
		).parse();
	}

	/**
	 * Function to decide on member addition
	 * @param {string} operation
	 * @param {string} queryParams
	 *
	 * @returns {string}
	 */
	protected addMember(operation: string, queryParams: string) {
		const parseQueryInput = this.parseAddMemberInput(queryParams);

		const relationShipBuilder = this.relationFactory.getRelationshipBuilder(
			<Operations>operation.toLowerCase()
		);

		this.buildRelation(
			relationShipBuilder.Relation,
			parseQueryInput.firstMember,
			parseQueryInput.gender,
			parseQueryInput.relationMember,
			parseQueryInput.viaMember
		);

		return this.relationFactory.getRelationShipBuilderMessages(
			<Operations>operation.toLowerCase()
		);
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
	private showHelpers() {
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
	private query(input: string) {
		const query = input.match(/[a-zA-Z\_\-]*/);
		let params = input.split(`${query} `)[1];
		let queryAndExpectation = params.split("#");

		try {
			const result = this.doQuery(query[0], queryAndExpectation[0]);
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
