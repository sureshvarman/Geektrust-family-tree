export type Tparents = {
	mother: IFamilyMember;
	father: IFamilyMember;
};

export interface IFamilyTree {
	addMember(name: string, gender: Tgender): IFamilyTree;
	getMember(name: string): IFamilyMember;
	isMemberExists(name: string);

	buildRelation(member: string, relation: Irelation): Irelation;

	setRoot(name: string);
}

export interface IFamilyMember {
	getName(): String;
	getGender(): Tgender;
	getSpouse(): IFamilyMember;
	getChildren(gender?: Tgender): Array<IFamilyMember>;
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

export enum Relations {
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

export enum Operations {
	GET_RELATIONSHIP = "get_relationship",

	ADD_PATERNAL_UNCLE = "add_paternal-uncle",
	ADD_MATERNAL_UNCLE = "add_maternal-uncle",
	ADD_PATERNAL_AUNT = "add_paternal-aunt",
	ADD_MATERNAL_AUNT = "add_maternal-aunt",
	ADD_SISTER_IN_LAW = "add_sister-in-law",
	ADD_BROTHER_IN_LAW = "add_brother-in-law",
	ADD_SIBLING = "add_sibling",
	ADD_SPOUSE = "add_spouse",
	ADD_FATHER = "add_father",
	ADD_MOTHER = "add_mother",
	ADD_CHILD = "add_child",
}

export enum QueryType {
	ADDITTION = "add",
	GET_RELATIONSHIP = "get_relationship",
}

export enum erroCode {
	PERSON_NOT_FOUND = "PERSON_NOT_FOUND",
	CHILD_ADDITION_FAILED = "CHILD_ADDITION_FAILED",
	NONE = "NONE",
	PERSON_ADDITION_FAILED = "PERSON_ADDITION_FAILED",
	SPOUSE_ADDITION_FAILED = "SPOUSE_ADDITION_FAILED",
	SIBLINGS_ADDITION_FAILED = "SIBLINGS_ADDITION_FAILED",
	BROTHER_IN_LAW_ADDITION_FAILED = "BROTHER_IN_LAW_ADDITION_FAILED",
	SISTER_IN_LAW_ADDITION_FAILED = "SISTER_IN_LAW_ADDITION_FAILED",

	PATERNAL_UNCLE_ADDITION_FAILED = "PATERNAL_UNCLE_ADDITION_FAILED",
	PATERNAL_AUNT_ADDITION_FAILED = "PATERNAL_AUNT_ADDITION_FAILED",
	MATERNAL_AUNT_ADDITION_FAILED = "MATERNAL_AUNT_ADDITION_FAILED",
	MATERNAL_UNCLE_ADDITION_FAILED = "MATERNAL_UNCLE_ADDITION_FAILED",
}

export enum messages {
	CHILD_ADDITION_SUCCEEDED = "CHILD_ADDITION_SUCCEEDED",
	SPOUSE_ADDITION_SUCCEEDED = "SPOUSE_ADDITION_SUCCEEDED",
	SIBLINGS_ADDITION_SUCCEEDED = "SIBLINGS_ADDITION_SUCCEEDED",
	MOTHER_ADDITION_SUCCEEDED = "MOTHER_ADDITION_SUCCEEDED",
	FATHER_ADDITION_SUCCEEDED = "FATHER_ADDITION_SUCCEEDED",
	SISTER_IN_LAW_ADDITION_SUCCEEDED = "SISTER_IN_LAW_ADDITION_SUCCEEDED",
	BROTHER_IN_LAW_ADDITION_SUCCEEDED = "BROTHER_IN_LAW_ADDITION_SUCCEEDED",
	PATERNAL_UNCLE_ADDITION_SUCCEEDED = "PATERNAL_UNCLE_ADDITION_SUCCEEDED",
	PATERNAL_AUNT_ADDITION_SUCCEEDED = "PATERNAL_AUNT_ADDITION_SUCCEEDED",
	MATERNAL_AUNT_ADDITION_SUCCEEDED = "MATERNAL_AUNT_ADDITION_SUCCEEDED",
	MATERNAL_UNCLE_ADDITION_SUCCEEDED = "MATERNAL_UNCLE_ADDITION_SUCCEEDED",
}

export interface Irelation {
	member: IFamilyMember;

	setMember(member: IFamilyMember): Irelation;
	getMembers(gender?: Tgender): Array<IFamilyMember>;
	makeRelation(
		member: IFamilyMember,
		relationMember?: IFamilyMember
	): Irelation;
}

export interface IParser {
	familyMembers: Array<IFamilyMember>;

	parse(): string;
}

export type TAddMemberInput = {
	firstMember: string;
	gender: Tgender;
	relationMember: string;
	viaMember?: string;
};

export type TGetRelationInput = {
	member: string;
	relationship: Relations;
};

export type TRelationShipBuilder = {
	Relation: Irelation;
	gender?: Tgender;
};
