import { IDB, IFamilyMember } from "./family-utils";

export default class DB implements IDB {
	dataSet: Object = {};

	constructor() {}

	set(name: string, member: IFamilyMember) {
		this.dataSet[name] = member;
	}

	get(name: string): IFamilyMember {
		return this.dataSet[name];
	}

	clear() {
		this.dataSet = {};
	}
}
