import { readFileSync } from "fs";
import { IFamilyTree, Tgender } from "./family-utils";

import { SpouseRelation, MotherRelation } from "./relations";

/**
 * @class SeedData
 * Class to insert seed data to form an tree
 */
export default class SeedData {
	private familyTree: IFamilyTree;
	private defaultFileLocation: string = process.cwd() + "/seed-data.txt";

	/**
	 * @constructor
	 * @param {IFamilyTree} familyTree
	 */
	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	/**
	 * Private function to read the seed data
	 * @param {string} fileLocation location of the file
	 */
	protected readSeedData(fileLocation?: string): Array<string> {
		let seedData = readFileSync(fileLocation, "utf8").split("\n");

		return seedData.filter((data) => {
			return !data.match(/\/\//) && data;
		});
	}

	/**
	 * private Function to add members to the tree and decide the mother and communicates back
	 * @param {string} member1
	 * @param {string} member2
	 * @param {string} mother
	 */
	protected addMembersGetMother(member1, member2, mother) {
		let [member1Name, member1Gender] = member1.split(":");
		let [member2Name, member2Gender] = member2 ? member2.split(":") : [];

		this.familyTree.addMember(
			member1Name,
			member1Gender == Tgender.MALE ? Tgender.MALE : Tgender.FEMALE
		);

		if (member2Name) {
			this.familyTree.addMember(
				member2Name,
				member2Gender == Tgender.MALE ? Tgender.MALE : Tgender.FEMALE
			);

			this.familyTree
				.buildRelation(member1Name, new SpouseRelation())
				.makeRelation(this.familyTree.getMember(member2Name));
		}

		if (mother) {
			this.familyTree
				.buildRelation(member1Name, new MotherRelation())
				.makeRelation(this.familyTree.getMember(mother));
		}

		return this.getMother(member1Name, member2Name);
	}

	/**
	 * Private function to decide on the mother
	 * @param {string} member1
	 * @param {string} member2
	 */
	protected getMother(member1, member2) {
		if (
			this.familyTree.isMemberExists(member1) &&
			this.familyTree.getMember(member1).getGender() == Tgender.FEMALE
		) {
			return member1;
		} else if (
			this.familyTree.isMemberExists(member2) &&
			this.familyTree.getMember(member2).getGender() == Tgender.FEMALE
		) {
			return member2;
		}

		return null;
	}

	/**
	 * Function to start seeding the data
	 * @param {string} newFileLocation location of the file
	 */
	seed(newFileLocation?: string) {
		const tabSize = 4;
		const seedData = this.readSeedData(
			newFileLocation || this.defaultFileLocation
		);
		let mothers = [];

		for (let data of seedData) {
			const startAt = data.slice(0).search(/[a-zA-Z]/);
			data = data.slice(startAt, data.length);

			const mother = mothers[startAt / tabSize - 1];

			let [member1, member2] = data.split("-");
			const motherInMember = this.addMembersGetMother(member1, member2, mother);

			if (motherInMember) {
				mothers[startAt / tabSize] = motherInMember;
			}
		}

		this.familyTree.setRoot(mothers[0]);
	}
}
