import { IFamilyMember, IParser, erroCode } from "./family-utils";

export default class Parser implements IParser {
	familyMembers: IFamilyMember[];

	constructor(familyMembers) {
		this.familyMembers = familyMembers;
	}

	parse(): string {
		if (this.familyMembers.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return this.familyMembers
			.map((familyMember) => familyMember.getName())
			.join(" ");
	}
}
