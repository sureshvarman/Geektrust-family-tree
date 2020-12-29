export type Tparents = {
	mother: IFamilyMember;
	father: IFamilyMember;
};

export interface IFamilyTree {
	addMember(name: string, gender: Tgender);
	doWedding(name1: string, name2: string);
	addChild(name: string, gender: Tgender, mother: string);
}

export interface IFamilyMember {
	getName(): String;
	getGender(): Tgender;
	getSpouse(): IFamilyMember;
	getChildren(): Array<IFamilyMember>;
	getFather(): IFamilyMember;
	getMother(): IFamilyMember;

	setSpouse(spouse: IFamilyMember);
	setFather(parent: IFamilyMember);
	setMother(parent: IFamilyMember);
	addChild(child: IFamilyMember);
}

export interface IDB {
	data: Object;
	set(name: string, member: IFamilyMember);
	get(name: string): IFamilyMember;
}

export enum Tgender {
	MALE = "male",
	FEMALE = "female",
}
