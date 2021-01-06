import FamilyTree from "./family-tree";
import SeedData from "./seed-data";
import DB from "./db";

import { Tgender, actions, relations } from "./family-utils";
import { readFileSync } from "fs";

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
	 * Function to execute given actions
	 * @param action
	 * @param name
	 */
	protected doQuery(query: string, queryParams: string) {
		switch (query.toLowerCase()) {
			case actions.ADD_CHILD:
				const addChildParams = queryParams.split(/\t|\s/);
				let gender = addChildParams[2],
					child = addChildParams[1],
					mother = addChildParams[0]; // assuming mother name is only single name

				return this.familyTree.addChild(
					child,
					gender == Tgender.MALE ? Tgender.MALE : Tgender.FEMALE,
					mother
				);

			case actions.GET_RELATIONSHIP:
				const relationParams = queryParams.split(/\t|\s/);
				const member = relationParams[0];
				const relationship = relationParams[1];

				switch (relationship.toLowerCase()) {
					case relations.SPOUSE:
						return new SpouseRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.DAUGHTER:
						return new DaughterRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.SON:
						return new SonRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.SIBLINGS:
						return new SiblingsRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.BROTHER:
						return new BrotherRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.SISTER_IN_LAW:
						return new SisterInLawsRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.BROTHER_IN_LAW:
						return new BrotherInLawsRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.SISTER:
						return new SisterRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.MATERNAL_AUNT:
						return new MaternalAuntRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.PATERNAL_AUNT:
						return new PaternalAuntRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.MATERNAL_UNCLE:
						return new MaternalUncleRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.PATERNAL_UNCLE:
						return new PaternalUncleRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.FATHER:
						return new FatherRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");

					case relations.MOTHER:
						return new MotherRelation(this.familyTree)
							.getMembers(member)
							.map((familyMember) => {
								return familyMember.getName();
							})
							.join(" ");
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
