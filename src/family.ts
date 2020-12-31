import {
	IFamilyTree,
	Tgender,
	IDB,
	IFamilyMember,
	erroCode,
	messages,
} from "./family-utils";

/**
 * Class represents the family member attributes and relations
 * abstracted to the level of member, where the getter and setters are available
 * @class FamilyMember
 */
class FamilyMember implements IFamilyMember {
	protected name: string;
	protected gender: Tgender;
	protected mother: IFamilyMember = null;
	protected father: IFamilyMember = null;
	protected spouse: IFamilyMember = null;
	protected children: Array<IFamilyMember> = [];

	/**
	 * @constructor
	 * @param {string} name
	 * @param {Tgender} gender
	 */
	constructor(name: string, gender: Tgender) {
		this.name = name;
		this.gender = gender;

		if (!this.name) {
			throw new Error("name is required");
		}

		if (!this.gender) {
			throw new Error("gender is required, should be Tgender MALE|FEMALE");
		}
	}

	/**
	 * to get the name of the member
	 * @returns {String}
	 */
	getName(): String {
		return this.name;
	}

	/**
	 * to get the gender of the member
	 * @returns {Tgender}
	 */
	getGender(): Tgender {
		return this.gender;
	}

	/**
	 * Function to get the family member
	 * @returns {IFamilyMember}
	 */
	getSpouse(): IFamilyMember {
		return this.spouse;
	}

	/**
	 * Function to get the mother
	 * @returns {IFamilyMember}
	 */
	getMother(): IFamilyMember {
		return this.mother;
	}

	/**
	 * Function to get the father
	 * @returns {IFamilyMember}
	 */
	getFather(): IFamilyMember {
		return this.father;
	}

	/**
	 * Function to get the childrens
	 * @returns {Array<IFamilyMember}
	 */
	getChildren(): Array<IFamilyMember> {
		return this.children;
	}

	/**
	 * function to get the sibilings
	 * @param {Tgender} gender gender to get
	 * @returns {Array<IFamilyTree>}
	 */
	getSiblings(gender?: Tgender) {
		const mother = this.getMother();

		if (!mother) {
			return [];
		}

		let children = mother.getChildren();
		children = children.filter((child) => child.getName() !== this.getName());

		if (gender) {
			children = children.filter((child) => child.getGender() == gender);
		}

		return children;
	}

	/**
	 * Function to set the spouse
	 * @param spouse
	 */
	setSpouse(spouse: IFamilyMember) {
		if (this.gender === spouse.getGender()) {
			throw new Error(
				"Same Gender's cannot marry. Sorry! We are 350 years behind..."
			);
		}

		this.spouse = spouse;
	}

	/**
	 * Function to setMother
	 * @param {IFamilyMember} mother
	 */
	setMother(mother: IFamilyMember) {
		if (mother.getGender() !== Tgender.FEMALE) {
			throw new Error("Cannot be an mother..");
		}

		this.mother = mother;
	}

	/**
	 * Function to set Father
	 * @param {IFamilyMember} mother
	 */
	setFather(father: IFamilyMember) {
		if (father.getGender() !== Tgender.MALE) {
			throw new Error("Cannot be an mother..");
		}

		this.father = father;
	}

	/**
	 * function to add child to the member
	 * @param child
	 */
	addChild(child: IFamilyMember) {
		this.children.push(child);
	}
}

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
		if (!childMember || !motherMember || !fatherMember) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

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
	 * Function to get the children
	 * @param {IFamilyMember} member
	 * @param {Tgender} gender
	 */
	protected getChildren(member: IFamilyMember, gender: Tgender) {
		let children = member.getChildren();

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
		const partner1 = this.db.get(male);
		const partner2 = this.db.get(female);

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
		const motherMember = this.db.get(mother);

		if (!motherMember) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		} else if (motherMember.getGender() !== Tgender.FEMALE) {
			throw new Error(erroCode.CHILD_ADDITION_FAILED);
		} else if (!motherMember.getSpouse()) {
			throw new Error(erroCode.CHILD_ADDITION_FAILED);
		}

		const fatherMember = motherMember.getSpouse();

		if (!this.db.get(name)) {
			this.addMember(name, gender);
		}

		this.mapParents(this.db.get(name), motherMember, fatherMember);

		return messages.CHILD_ADDITION_SUCCEEDED;
	}

	/**
	 * Function to get sons
	 * @param {string} name
	 *
	 * @return {Array<IFamilyMember>}
	 */
	getSons(name: string) {
		const member = this.db.get(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		const children = this.getChildren(member, Tgender.MALE);

		if (children.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return children;
	}

	/**
	 * Function to get daughters
	 * @param {string} name
	 *
	 * @return {Array<IFamilyMember>}
	 */
	getDaughters(name: string) {
		const member = this.db.get(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		const children = this.getChildren(member, Tgender.FEMALE);

		if (children.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return children;
	}

	/**
	 * Function to get mother
	 * @param {string} name
	 *
	 * @return {IFamilyMember}
	 */
	getMother(name: string) {
		const member = this.db.get(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		return member.getMother();
	}

	/**
	 * Function to get father
	 * @param {string} name
	 *
	 * @return {IFamilyMember}
	 */
	getFather(name: string) {
		const member = this.db.get(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		return member.getFather();
	}

	/**
	 * Function to get spouse
	 * @param {string} name
	 *
	 * @return {IFamilyMember}
	 */
	getSpouse(name: string) {
		const member = this.db.get(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

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
		const member = this.db.get(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		let siblings = member.getSiblings(gender);

		if (siblings.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return siblings;
	}

	/**
	 * Function to get the member
	 * @param name
	 *
	 * @returns {IFamilyMember}
	 */
	getMember(name: string) {
		const member = this.db.get(name);

		return member;
	}

	/**
	 * Function to get the paternal uncles
	 * @param {string} name
	 *
	 * @returns {Array<IFamilyMember>}
	 */
	getPaternalUncles(name: string): Array<IFamilyMember> {
		const member = this.getMember(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		const paternalUncles = member.getFather().getSiblings(Tgender.MALE);

		if (paternalUncles.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return paternalUncles;
	}

	/**
	 * Function to get the maternal uncles
	 * @param {string} name
	 *
	 * @returns {Array<IFamilyMember>}
	 */
	getMaternalUncles(name: string): Array<IFamilyMember> {
		const member = this.getMember(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		const maternalUncles = member.getMother().getSiblings(Tgender.MALE);

		if (maternalUncles.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return maternalUncles;
	}

	/**
	 * Function to get the paternal aunt
	 * @param {string} name
	 *
	 * @returns {Array<IFamilyMember>}
	 */
	getPaternalAunts(name: string): Array<IFamilyMember> {
		const member = this.getMember(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		const paternalAunts = member.getFather().getSiblings(Tgender.FEMALE);

		if (paternalAunts.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return paternalAunts;
	}

	/**
	 * Function to get the maternal aunt
	 * @param {string} name
	 *
	 * @returns {Array<IFamilyMember>}
	 */
	getMaternalAunts(name: string): Array<IFamilyMember> {
		const member = this.getMember(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		const paternalAunts = member.getMother().getSiblings(Tgender.FEMALE);

		if (paternalAunts.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return paternalAunts;
	}

	/**
	 * Function to get brother in laws
	 * @param name
	 *
	 * @return {Array<IFamilyMember>}
	 */
	getBrotherInLaws(name: string): Array<IFamilyMember> {
		let brotherInLaws = [];
		const member = this.getMember(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		let husbandOfSibilings = member
			.getSiblings(Tgender.FEMALE)
			.filter((sister) => sister.getSpouse())
			.map((sister) => sister.getSpouse());

		brotherInLaws = brotherInLaws.concat(husbandOfSibilings);

		let spouse = member.getSpouse();
		if (spouse) {
			brotherInLaws = brotherInLaws.concat(spouse.getSiblings(Tgender.MALE));
		}

		if (brotherInLaws.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return brotherInLaws;
	}

	/**
	 * Function to get sister in laws
	 * @param name
	 *
	 * @return {Array<IFamilyMember>}
	 */
	getSisterInLaws(name: string): Array<IFamilyMember> {
		let sisterInLaws = [];
		const member = this.getMember(name);

		if (!member) {
			throw new Error(erroCode.PERSON_NOT_FOUND);
		}

		let wivesOfSiblings = member
			.getSiblings(Tgender.MALE)
			.filter((brother) => brother.getSpouse())
			.map((brother) => brother.getSpouse());

		sisterInLaws = sisterInLaws.concat(wivesOfSiblings);

		let spouse = member.getSpouse();
		if (spouse) {
			sisterInLaws = sisterInLaws.concat(spouse.getSiblings(Tgender.FEMALE));
		}

		if (sisterInLaws.length < 1) {
			throw new Error(erroCode.NONE);
		}

		return sisterInLaws;
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
