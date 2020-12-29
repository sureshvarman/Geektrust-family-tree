import { readFileSync } from "fs";
import { IFamilyTree, Tgender } from "./family-utils";

export default class SeedData {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	protected readSeedData(): Array<string> {
		let seedData = readFileSync(
			process.cwd() + "/src/seed-data.txt",
			"utf8"
		).split("\n");

		return seedData.filter((data) => {
			return !data.match(/\/\//) && data;
		});
	}

	protected parseMembersAndGetMother(member1, member2, mother) {
		let [member1Name, member1Gender] = member1.split(":");
		let [member2Name, member2Gender] = member2 ? member2.split(":") : [];

		this.familyTree.addMember(
			member1Name,
			member1Gender == "male" ? Tgender.MALE : Tgender.FEMALE
		);

		if (member2Name) {
			this.familyTree.addMember(
				member2Name,
				member2Gender == "male" ? Tgender.MALE : Tgender.FEMALE
			);

			this.familyTree.doWedding(member1Name, member2Name);
		}

		if (mother) {
			this.familyTree.addChild(member1Name, member1Gender, mother);
		}

		if (member1Gender == "female") {
			return member1Name;
		} else if (member2Gender == "female") {
			return member2Name;
		}

		return null;
	}

	getMother(member1, member2) {}

	seed() {
		const tabSize = 4;
		const seedData = this.readSeedData();
		let mothers = [];

		for (let data of seedData) {
			const startAt = data.slice(0).search(/[a-zA-Z]/);
			data = data.slice(startAt, data.length);

			const mother = mothers[startAt / tabSize - 1];
			let [member1, member2] = data.split("-");
			const motherInMember = this.parseMembersAndGetMother(
				member1,
				member2,
				mother
			);

			if (motherInMember) {
				mothers[startAt / tabSize] = motherInMember;
			}
		}
	}
}
