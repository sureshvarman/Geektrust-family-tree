import FamilyTree from "../family-tree";
import {
	IFamilyMember,
	IFamilyTree,
	Irelation,
	Tgender,
	erroCode,
} from "../family-utils";

export class BrotherInLawsRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}
	makeRelation(
		member: IFamilyMember,
		relationMember: IFamilyMember
	): Irelation {
		if (this.member.getSpouse() == relationMember) {
			relationMember.getMother().addChild(member);
		} else if (
			relationMember.getGender() == Tgender.FEMALE &&
			relationMember.getMother() == this.member.getMother()
		) {
			relationMember.setSpouse(member);
		}

		return this;
	}

	getMembers(): IFamilyMember[] {
		let brotherInLaws = [];

		let husbandOfSibilings = this.member
			.getSiblings(Tgender.FEMALE)
			.filter((sister) => sister.getSpouse())
			.map((sister) => sister.getSpouse());

		brotherInLaws = brotherInLaws.concat(husbandOfSibilings);

		let spouse = this.member.getSpouse();
		if (spouse) {
			brotherInLaws = brotherInLaws.concat(spouse.getSiblings(Tgender.MALE));
		}

		if (brotherInLaws.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return [].concat(brotherInLaws);
	}
}

export class SisterInLawsRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}
	makeRelation(
		member: IFamilyMember,
		relationMember: IFamilyMember
	): Irelation {
		if (this.member.getSpouse() == relationMember) {
			relationMember.getMother().addChild(member);
		} else if (
			relationMember.getGender() == Tgender.MALE &&
			relationMember.getMother() == this.member.getMother()
		) {
			relationMember.setSpouse(member);
		}

		return this;
	}

	getMembers(): IFamilyMember[] {
		let sisterInLaws = [];

		let wifeOfSibilings = this.member
			.getSiblings(Tgender.MALE)
			.filter((sister) => sister.getSpouse())
			.map((sister) => sister.getSpouse());

		sisterInLaws = sisterInLaws.concat(wifeOfSibilings);

		let spouse = this.member.getSpouse();
		if (spouse) {
			sisterInLaws = sisterInLaws.concat(spouse.getSiblings(Tgender.FEMALE));
		}

		if (sisterInLaws.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return [].concat(sisterInLaws);
	}
}

export class SiblingsRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}

	makeRelation(member: IFamilyMember): Irelation {
		this.member.getMother().addChild(member);

		return this;
	}

	getMembers(gender?: Tgender): IFamilyMember[] {
		let familyMember: Array<IFamilyMember>;

		if (gender) {
			familyMember = this.member.getSiblings(gender);
		} else {
			familyMember = this.member.getSiblings();
		}

		return [].concat(familyMember);
	}
}

export class ChildRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}

	makeRelation(member: IFamilyMember): Irelation {
		if (
			this.member.getGender() !== Tgender.FEMALE ||
			!this.member.getSpouse()
		) {
			throw new Error(erroCode.CHILD_ADDITION_FAILED);
		}

		this.member.addChild(member);
		this.member.getSpouse().addChild(member);

		member.setMother(this.member);
		member.setFather(this.member.getSpouse());

		return this;
	}

	getMembers(gender?: Tgender): IFamilyMember[] {
		let familyMember: Array<IFamilyMember>;

		if (gender) {
			familyMember = this.member.getChildren(gender);
		} else {
			familyMember = this.member.getChildren();
		}

		return [].concat(familyMember);
	}
}

export class FatherRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}

	makeRelation(member: IFamilyMember): Irelation {
		this.member.setFather(member);
		this.member.setMother(member.getSpouse());

		return this;
	}

	getMembers(): IFamilyMember[] {
		const familyMember = this.member.getFather();

		return [].concat(familyMember);
	}
}

export class MaternalAuntRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}

	makeRelation(member: IFamilyMember): Irelation {
		this.member.getMother().getMother().addChild(member);

		return this;
	}

	getMembers(): IFamilyMember[] {
		const familyMember = this.member.getMother().getSiblings(Tgender.FEMALE);

		return [].concat(familyMember);
	}
}

export class MaternalUncleRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}

	makeRelation(member: IFamilyMember): Irelation {
		this.member.getMother().getMother().addChild(member);

		return this;
	}

	getMembers(): IFamilyMember[] {
		const familyMember = this.member.getMother().getSiblings(Tgender.MALE);

		return [].concat(familyMember);
	}
}

export class MotherRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}

	makeRelation(member: IFamilyMember): Irelation {
		this.member.setMother(member);
		this.member.setFather(member.getSpouse());

		return this;
	}

	getMembers(): IFamilyMember[] {
		const familyMember = this.member.getMother();

		return [].concat(familyMember);
	}
}

export class PaternalAuntRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}

	makeRelation(member: IFamilyMember): Irelation {
		this.member.getFather().getMother().addChild(member);

		return this;
	}

	getMembers(): IFamilyMember[] {
		const familyMember = this.member.getFather().getSiblings(Tgender.FEMALE);

		return [].concat(familyMember);
	}
}

export class PaternalUncleRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}

	makeRelation(member: IFamilyMember): Irelation {
		this.member.getFather().getMother().addChild(member);

		return this;
	}

	getMembers(): IFamilyMember[] {
		const familyMember = this.member.getFather().getSiblings(Tgender.MALE);

		return [].concat(familyMember);
	}
}

export class SpouseRelation implements Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember) {
		this.member = member;

		return this;
	}

	makeRelation(member: IFamilyMember): Irelation {
		this.member.setSpouse(member);
		member.setSpouse(this.member);

		return this;
	}

	getMembers(): IFamilyMember[] {
		const familyMember = this.member.getSpouse();

		return [].concat(familyMember);
	}
}
