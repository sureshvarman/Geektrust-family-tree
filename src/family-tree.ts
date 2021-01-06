import {
	IFamilyTree,
	Tgender,
	IDB,
	IFamilyMember,
	erroCode,
	messages,
} from "./family-utils";

import FamilyMember from "./family-member";

/**
 * class maintains familyMember in a store and validate them for a retrieve or addition
 * an another level decopuling between the familyMember and the concrete calling class
 *
 * @class FamilyTree
 */
export default class FamilyTree implements IFamilyTree {
	db: IDB;
	root: IFamilyMember;

	/**
	 * @constructor
	 * @param {IDB} db database interface to store and retrieve the data
	 */
	constructor(db: IDB) {
		this.db = db;
	}

	/**
	 * Function to map parents
	 * @param {IFamilyMember} childMember
	 * @param {IFamilyMember} motherMember
	 * @param {IFamilyMember} fatherMember
	 */
	protected mapParents(
		childMember: IFamilyMember,
		motherMember: IFamilyMember,
		fatherMember: IFamilyMember
	) {
		try {
			childMember.setMother(motherMember);
			childMember.setFather(fatherMember);

			motherMember.addChild(childMember);
			fatherMember.addChild(childMember);
		} catch (e) {
			throw new Error(erroCode.CHILD_ADDITION_FAILED);
		}
	}

	/**
	 * Function to get the member exists or not
	 * @param name
	 *
	 * @returns {Boolean}
	 */
	isMemberExists(name: string) {
		const member = this.db.get(name);

		if (!member) {
			return false;
		}

		return true;
	}

	/**
	 * Function to get the member
	 * @param name
	 *
	 * @returns {IFamilyMember}
	 */
	getMember(name: string) {
		const member = this.db.get(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		return member;
	}

	/**
	 * Function to get the children
	 * @param {string} name
	 * @param {Tgender} gender
	 */
	getChildren(name: string, gender: Tgender) {
		let children = this.getMember(name).getChildren();

		children = children.filter((child) => child.getGender() == gender);

		return children;
	}

	/**
	 * function to add memeber to the tree structure
	 * @param name
	 * @param gender
	 */
	addMember(name: string, gender: Tgender) {
		this.db.set(name, new FamilyMember(name, gender));
	}

	/**
	 * Function to do wedding for the member, takes input
	 * @param {String} male male member
	 * @param {String} female female member
	 */
	doWedding(male: string, female: string) {
		const partner1 = this.getMember(male);
		const partner2 = this.getMember(female);

		if (partner1.getSpouse() || partner2.getSpouse()) {
			throw new Error("Already married....");
		}

		if (partner1.getGender() == partner2.getGender()) {
			throw new Error(
				"MisMatched genders \n Sorry!, we are 350 years behind..."
			);
		}

		partner2.setSpouse(partner1);
		partner1.setSpouse(partner2);
	}

	/**
	 * Function to add child to an family member
	 * @param name
	 * @param gender
	 * @param mother
	 */
	addChild(name: string, gender: Tgender, mother: string): string {
		const motherMember = this.getMember(mother);

		if (motherMember.getGender() !== Tgender.FEMALE) {
			throw new Error(erroCode.CHILD_ADDITION_FAILED);
		} else if (!motherMember.getSpouse()) {
			throw new Error(erroCode.CHILD_ADDITION_FAILED);
		}

		if (!this.db.get(name)) {
			this.addMember(name, gender);
		}

		const fatherMember = motherMember.getSpouse();

		this.mapParents(this.getMember(name), motherMember, fatherMember);

		return messages.CHILD_ADDITION_SUCCEEDED;
	}

	/**
	 * Function to get mother
	 * @param {string} name
	 *
	 * @return {IFamilyMember}
	 */
	getMother(name: string) {
		const member = this.getMember(name);

		return member.getMother();
	}

	/**
	 * Function to get father
	 * @param {string} name
	 *
	 * @return {IFamilyMember}
	 */
	getFather(name: string) {
		const member = this.getMember(name);

		return member.getFather();
	}

	/**
	 * Function to get spouse
	 * @param {string} name
	 *
	 * @return {IFamilyMember}
	 */
	getSpouse(name: string) {
		const member = this.getMember(name);

		const spouse = member.getSpouse();

		if (!spouse) {
			throw new Error(erroCode.NONE);
		}

		return spouse;
	}

	/**
	 * Function to get sibilings
	 * @param {string} name
	 *
	 * @return {IFamilyMember}
	 */
	getSiblings(name: string, gender?: Tgender) {
		const member = this.getMember(name);

		let siblings = member.getSiblings(gender);

		if (siblings.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return siblings;
	}

	/**
	 * Function to set root female
	 * @param name
	 */
	setRoot(name: string) {
		const member = this.db.get(name);

		if (member && member.getGender() == Tgender.FEMALE) {
			this.root = member;

			return;
		}

		throw new Error(erroCode.PERSON_ADDITION_FAILED);
	}
}
