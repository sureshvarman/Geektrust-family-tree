import FamilyTree from "./src/family";
import SeedData from "./src/seed-data";
import DB from "./src/db";

import {
	Tgender,
	actions,
	relations,
	messages,
	erroCode,
} from "./src/family-utils";

/**
 * @class App application logics are handled in here.
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

				this.familyTree.addChild(
					child,
					gender == Tgender.MALE ? Tgender.MALE : Tgender.FEMALE,
					mother
				);

				console.log(messages.CHILD_ADDITION_SUCCEEDED);

				break;

			case actions.GET_RELATIONSHIP:
				const relationParams = queryParams.split(/\t|\s/);
				const member = relationParams[0];
				const relationship = relationParams[1];

				switch (relationship.toLowerCase()) {
					case relations.SPOUSE:
						console.log(this.familyTree.getSpouse(member).getName());
						break;

					case relations.DAUGHTER:
						console.log(
							this.familyTree
								.getDaughters(member)
								.map((data) => data.getName())
								.join(" ")
						);
						break;

					case relations.SON:
						console.log(
							this.familyTree
								.getSons(member)
								.map((data) => data.getName())
								.join(" ")
						);
						break;

					case relations.SIBLINGS:
						console.log(
							this.familyTree
								.getSiblings(member)
								.map((data) => data.getName())
								.join(" ")
						);
						break;

					case relations.BROTHER:
						console.log(
							this.familyTree
								.getSiblings(member, Tgender.MALE)
								.map((data) => data.getName())
								.join(" ")
						);
						break;

					case relations.SISTER_IN_LAW:
						let sisterInLaws = [];
						let wivesOfSiblings = this.familyTree
							.getSiblings(member, Tgender.MALE)
							.filter((brother) => brother.getSpouse())
							.map((brother) => brother.getSpouse().getName());

						sisterInLaws = sisterInLaws.concat(wivesOfSiblings);

						let spouseSL = this.familyTree.getSpouse(member);
						if (spouseSL) {
							sisterInLaws = sisterInLaws.concat(
								spouseSL
									.getSiblings(Tgender.FEMALE)
									.map((sister) => sister.getName())
							);
						}

						if (sisterInLaws.length < 1) {
							throw new Error(erroCode.NONE);
						}

						console.log(sisterInLaws.join(" "));
						break;

					case relations.BROTHER_IN_LAW:
						let brotherInLaws = [];
						let husbandOfSibilings = this.familyTree
							.getSiblings(member, Tgender.FEMALE)
							.filter((sister) => sister.getSpouse())
							.map((sister) => sister.getSpouse().getName());

						brotherInLaws = brotherInLaws.concat(husbandOfSibilings);

						let spouseBL = this.familyTree.getSpouse(member);
						if (spouseBL) {
							brotherInLaws = brotherInLaws.concat(
								spouseBL
									.getSiblings(Tgender.MALE)
									.map((brother) => brother.getName())
							);
						}

						if (brotherInLaws.length < 1) {
							throw new Error(erroCode.NONE);
						}

						console.log(brotherInLaws.join(" "));
						break;

					case relations.SISTER:
						console.log(
							this.familyTree
								.getSiblings(member, Tgender.FEMALE)
								.map((data) => data.getName())
								.join(" ")
						);
						break;

					case relations.MATERNAL_AUNT:
						console.log(
							this.familyTree
								.getMother(member)
								.getSiblings(Tgender.FEMALE)
								.map((data) => data.getName())
								.join(" ")
						);
						break;

					case relations.PATERNAL_AUNT:
						console.log(
							this.familyTree
								.getFather(member)
								.getSiblings(Tgender.FEMALE)
								.map((data) => data.getName())
								.join(" ")
						);
						break;

					case relations.MATERNAL_UNCLE:
						console.log(
							this.familyTree
								.getMother(member)
								.getSiblings(Tgender.MALE)
								.map((data) => data.getName())
								.join(" ")
						);
						break;

					case relations.PATERNAL_UNCLE:
						console.log(
							this.familyTree
								.getFather(member)
								.getSiblings(Tgender.MALE)
								.map((data) => data.getName())
								.join(" ")
						);
						break;

					case relations.FATHER:
						console.log(this.familyTree.getFather(member).getName());
						break;

					case relations.MOTHER:
						console.log(this.familyTree.getFather(member).getName());
						break;
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
			this.doQuery(query[0], params);
		} catch (e) {
			console.log(e.message);
		}
	}

	prompt() {
		process.stdin.resume();
		process.stdin.setEncoding("utf-8");
		var inputs = "";

		process.stdin.on("data", (input) => {
			inputs += input;
		});

		process.stdin.on("end", () => {
			for (let input of inputs.split("\n")) {
				if (input) {
					this.query(input);
				}
			}
		});
	}
}

//const application = new App(process.argv[3] || null);

// application.showHelpers();
//application.prompt();
