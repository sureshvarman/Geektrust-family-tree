import FamilyTree from "./family-tree";
import SeedData from "./seed-data";
import DB from "./db";

import {
	Tgender,
	Operations,
	Relations,
	TGetRelationInput,
	messages,
	QueryType,
	TAddMemberInput,
	Irelation,
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

	/**
	 * Function to decide on member addition
	 * @param {string} operation
	 * @param {string} queryParams
	 *
	 * @returns {string}
	 */
	protected addMember(operation: string, queryParams: string) {
		switch (operation.toLowerCase()) {
			case Operations.ADD_CHILD:
				const childQueryInput = this.parseAddMemberInput(queryParams);

				this.buildRelation(
					new ChildRelation(),
					childQueryInput.firstMember,
					childQueryInput.gender,
					childQueryInput.relationMember
				);

				return messages.CHILD_ADDITION_SUCCEEDED;

			case Operations.ADD_SPOUSE:
				const spouseQueryInput = this.parseAddMemberInput(queryParams);

				this.buildRelation(
					new SpouseRelation(),
					spouseQueryInput.firstMember,
					spouseQueryInput.gender,
					spouseQueryInput.relationMember
				);
				return messages.SPOUSE_ADDITION_SUCCEEDED;

			case Operations.ADD_SIBLING:
				const siblingQueryInput = this.parseAddMemberInput(queryParams);

				this.buildRelation(
					new SiblingsRelation(),
					siblingQueryInput.firstMember,
					siblingQueryInput.gender,
					siblingQueryInput.relationMember
				);
				return messages.SIBLINGS_ADDITION_SUCCEEDED;

			case Operations.ADD_SISTER_IN_LAW:
				const sisternInLawQueryInput = this.parseAddMemberInput(queryParams);

				this.buildRelation(
					new SisterInLawsRelation(),
					sisternInLawQueryInput.firstMember,
					sisternInLawQueryInput.gender,
					sisternInLawQueryInput.relationMember,
					sisternInLawQueryInput.viaMember
				);
				return messages.SISTER_IN_LAW_ADDITION_SUCCEEDED;

			case Operations.ADD_BROTHER_IN_LAW:
				const brotherInLawQueryInput = this.parseAddMemberInput(queryParams);

				this.buildRelation(
					new BrotherInLawsRelation(),
					brotherInLawQueryInput.firstMember,
					brotherInLawQueryInput.gender,
					brotherInLawQueryInput.relationMember,
					brotherInLawQueryInput.viaMember
				);
				return messages.BROTHER_IN_LAW_ADDITION_SUCCEEDED;

			case Operations.ADD_PATERNAL_UNCLE:
				const paternalUncleQueryInput = this.parseAddMemberInput(queryParams);

				this.buildRelation(
					new PaternalUncleRelation(),
					paternalUncleQueryInput.firstMember,
					paternalUncleQueryInput.gender,
					paternalUncleQueryInput.relationMember,
					paternalUncleQueryInput.viaMember
				);
				return messages.PATERNAL_UNCLE_ADDITION_SUCCEEDED;

			case Operations.ADD_MATERNAL_UNCLE:
				const maternalUncleQueryInput = this.parseAddMemberInput(queryParams);

				this.buildRelation(
					new MaternalUncleRelation(),
					maternalUncleQueryInput.firstMember,
					maternalUncleQueryInput.gender,
					maternalUncleQueryInput.relationMember,
					maternalUncleQueryInput.viaMember
				);
				return messages.MATERNAL_UNCLE_ADDITION_SUCCEEDED;

			case Operations.ADD_PATERNAL_AUNT:
				const paternalAuntQueryInput = this.parseAddMemberInput(queryParams);

				this.buildRelation(
					new PaternalAuntRelation(),
					paternalAuntQueryInput.firstMember,
					paternalAuntQueryInput.gender,
					paternalAuntQueryInput.relationMember,
					paternalAuntQueryInput.viaMember
				);
				return messages.PATERNAL_AUNT_ADDITION_SUCCEEDED;

			case Operations.ADD_MATERNAL_AUNT:
				const maternalAuntQueryInput = this.parseAddMemberInput(queryParams);

				this.buildRelation(
					new MaternalAuntRelation(),
					maternalAuntQueryInput.firstMember,
					maternalAuntQueryInput.gender,
					maternalAuntQueryInput.relationMember,
					maternalAuntQueryInput.viaMember
				);
				return messages.MATERNAL_AUNT_ADDITION_SUCCEEDED;

			default:
				return "";
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
		const query = input.match(/[a-zA-Z\_\-]*/);
		let params = input.split(`${query} `)[1];

		params = params.substr(0, params.indexOf("#") || params.length);
		params = params.replace(/ $/, "");

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
