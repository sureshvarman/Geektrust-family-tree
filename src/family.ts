import {
	IFamilyTree,
	Tgender,
	IDB,
	IFamilyMember,
	Tparents,
} from "./family-utils";

class FamilyMember implements IFamilyMember {
	name: string;
	gender: Tgender;
	mother: IFamilyMember = null;
	father: IFamilyMember = null;
	spouse: IFamilyMember = null;
	children: Array<IFamilyMember> = [];

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

export default class FamilyTree implements IFamilyTree {
	db: IDB;
	root: IFamilyMember;

	constructor(db: IDB) {
		this.db = db;
		// get the seed data and decorate the tree
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
			throw new Error(
				"One of the member is not yet into the family tree to build an relation..."
			);
		}

		childMember.setMother(motherMember);
		childMember.setFather(fatherMember);

		motherMember.addChild(childMember);
		fatherMember.addChild(childMember);
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
	addChild(name: string, gender: Tgender, mother: string) {
		const motherMember = this.db.get(mother);

		if (!motherMember || motherMember.getGender() !== Tgender.FEMALE) {
			throw new Error("mother not exists or not an mother...");
		}

		const fatherMember = motherMember.getSpouse();

		if (!this.db.get(name)) {
			this.addMember(name, gender);
		}

		this.mapParents(this.db.get(name), motherMember, fatherMember);
	}

	/**
	 * Function to get the children
	 * @param {IFamilyMember} member
	 * @param {Tgender} gender
	 */
	getChildren(member: IFamilyMember, gender: Tgender) {
		const children = member.getChildren();

		return children.filter((child) => child.getGender() == gender);
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
			throw new Error("Member not found");
		}

		return this.getChildren(member, Tgender.MALE);
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
			throw new Error("Member not found");
		}

		return this.getChildren(member, Tgender.FEMALE);
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
			throw new Error("Member not found");
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
			throw new Error("Member not found");
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
			throw new Error("Member not found");
		}

		return member.getSpouse();
	}
}
