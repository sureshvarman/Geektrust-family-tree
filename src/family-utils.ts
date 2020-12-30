export type Tparents = {
	mother: IFamilyMember;
	father: IFamilyMember;
};

export interface IFamilyTree {
	addMember(name: string, gender: Tgender);
	doWedding(name1: string, name2: string);
	addChild(name: string, gender: Tgender, mother: string): string;
	getMember(name: string): IFamilyMember;
	setRoot(name: string);

	getSpouse(name: string): IFamilyMember;
	getSons(name: string): Array<IFamilyMember>;
	getDaughters(name: string): Array<IFamilyMember>;
	getSiblings(name: string, gender?: Tgender): Array<IFamilyMember>;

	getSisterInLaws(name: string): Array<IFamilyMember>;
	getBrotherInLaws(name: string): Array<IFamilyMember>;

	getMaternalAunts(name: string): Array<IFamilyMember>;
	getPaternalAunts(name: string): Array<IFamilyMember>;

	getMaternalUncles(name: string): Array<IFamilyMember>;
	getPaternalUncles(name: string): Array<IFamilyMember>;
}

export interface IFamilyMember {
	getName(): String;
	getGender(): Tgender;
	getSpouse(): IFamilyMember;
	getChildren(): Array<IFamilyMember>;
	getFather(): IFamilyMember;
	getMother(): IFamilyMember;
	getSiblings(gender?: Tgender): Array<IFamilyMember>;

	setSpouse(spouse: IFamilyMember);
	setFather(parent: IFamilyMember);
	setMother(parent: IFamilyMember);
	addChild(child: IFamilyMember);
}

export interface IDB {
	dataSet: Object;
	set(name: string, member: IFamilyMember);
	get(name: string): IFamilyMember;
}

export enum Tgender {
	MALE = "male",
	FEMALE = "female",
}

export enum relations {
	PATERNAL_UNCLE = "paternal-uncle",
	MATERNAL_UNCLE = "maternal-uncle",
	PATERNAL_AUNT = "paternal-aunt",
	MATERNAL_AUNT = "maternal-aunt",
	SISTER_IN_LAW = "sister-in-law",
	BROTHER_IN_LAW = "brother-in-law",
	SON = "son",
	DAUGHTER = "daughter",
	SIBLINGS = "siblings",
	SPOUSE = "spouse",
	BROTHER = "brother",
	SISTER = "sister",
	FATHER = "father",
	MOTHER = "mother",
}

export enum actions {
	ADD_CHILD = "add_child",
	GET_RELATIONSHIP = "get_relationship",
}

export enum erroCode {
	PERSON_NOT_FOUND = "PERSON_NOT_FOUND",
	CHILD_ADDITION_FAILED = "CHILD_ADDITION_FAILED",
	NONE = "NONE",
	PERSON_ADDITION_FAILED = "PERSON_ADDITION_FAILED",
}

export enum messages {
	CHILD_ADDITION_SUCCEEDED = "CHILD_ADDITION_SUCCEEDED",
}
