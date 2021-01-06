import { Tgender, IFamilyMember } from "./family-utils";

/**
 * Class represents the family member attributes and relations
 * abstracted to the level of member, where the getter and setters are available
 * @class FamilyMember
 */
export default class FamilyMember implements IFamilyMember {
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
