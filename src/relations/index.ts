import FamilyTree from "../family-tree";
import {
	IFamilyMember,
	IFamilyTree,
	Irelation,
	Tgender,
	erroCode,
} from "../family-utils";

export class BrotherInLawsRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		let brotherInLaws = [];

		let husbandOfSibilings = this.familyTree
			.getMember(memberName)
			.getSiblings(Tgender.FEMALE)
			.filter((sister) => sister.getSpouse())
			.map((sister) => sister.getSpouse());

		brotherInLaws = brotherInLaws.concat(husbandOfSibilings);

		let spouse = this.familyTree.getMember(memberName).getSpouse();
		if (spouse) {
			brotherInLaws = brotherInLaws.concat(spouse.getSiblings(Tgender.MALE));
		}

		if (brotherInLaws.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return [].concat(brotherInLaws);
	}
}

export class BrotherRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree.getSiblings(memberName, Tgender.MALE);

		return [].concat(familyMember);
	}
}

export class DaughterRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree.getChildren(
			memberName,
			Tgender.FEMALE
		);

		return [].concat(familyMember);
	}
}

export class FatherRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree.getFather(memberName);

		return [].concat(familyMember);
	}
}

export class MaternalAuntRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree
			.getMember(memberName)
			.getMother()
			.getSiblings(Tgender.FEMALE);

		return [].concat(familyMember);
	}
}

export class MaternalUncleRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree
			.getMember(memberName)
			.getMother()
			.getSiblings(Tgender.MALE);

		return [].concat(familyMember);
	}
}

export class MotherRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree.getMother(memberName);

		return [].concat(familyMember);
	}
}

export class PaternalAuntRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree
			.getMember(memberName)
			.getFather()
			.getSiblings(Tgender.FEMALE);

		return [].concat(familyMember);
	}
}

export class PaternalUncleRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree
			.getMember(memberName)
			.getFather()
			.getSiblings(Tgender.MALE);

		return [].concat(familyMember);
	}
}

export class SiblingsRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree.getSiblings(memberName);

		return [].concat(familyMember);
	}
}

export class SisterInLawsRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		let sisterInLaws = [];

		let wifeOfSibilings = this.familyTree
			.getMember(memberName)
			.getSiblings(Tgender.MALE)
			.filter((sister) => sister.getSpouse())
			.map((sister) => sister.getSpouse());

		sisterInLaws = sisterInLaws.concat(wifeOfSibilings);

		let spouse = this.familyTree.getMember(memberName).getSpouse();
		if (spouse) {
			sisterInLaws = sisterInLaws.concat(spouse.getSiblings(Tgender.FEMALE));
		}

		if (sisterInLaws.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return [].concat(sisterInLaws);
	}
}

export class SisterRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree.getSiblings(
			memberName,
			Tgender.FEMALE
		);

		return [].concat(familyMember);
	}
}

export class SonRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree.getChildren(memberName, Tgender.MALE);

		return [].concat(familyMember);
	}
}

export class SpouseRelation implements Irelation {
	familyTree: IFamilyTree;

	constructor(familyTree: IFamilyTree) {
		this.familyTree = familyTree;
	}

	getMembers(memberName: string): IFamilyMember[] {
		const familyMember = this.familyTree.getSpouse(memberName);

		return [].concat(familyMember);
	}
}
