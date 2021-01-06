import {
	IFamilyTree,
	Tgender,
	IDB,
	IFamilyMember,
	erroCode,
	messages,
	Irelation,
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
	 * function to add memeber to the tree structure
	 * @param name
	 * @param gender
	 */
	addMember(name: string, gender: Tgender): IFamilyTree {
		this.db.set(name, new FamilyMember(name, gender));

		return this;
	}

	/**
	 * Function to set relation strategy to apply on the given family member
	 * @param member
	 * @param relation
	 */
	buildRelation(member: string, relation: Irelation) {
		const familyMember = this.getMember(member);

		return relation.setMember(familyMember);
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
