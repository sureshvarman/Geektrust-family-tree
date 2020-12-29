import FamilyTree from "./src/family";
import SeedData from "./src/seed-data";

import { IDB, Tgender, IFamilyMember } from "./src/family-utils";

class DB implements IDB {
	data: Object = {};

	constructor() {
		console.log("Initilizing db store....");
	}

	set(name: string, member: IFamilyMember) {
		this.data[name] = member;
	}

	get(name: string): IFamilyMember {
		return this.data[name];
	}
}

const familyTree = new FamilyTree(new DB());

const seedData = new SeedData(familyTree);

seedData.seed();

function doit(action: string) {
	switch (action) {
	}
}

function build() {}
