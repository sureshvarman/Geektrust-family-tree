import {
	BrotherInLawsRelation,
	ChildRelation,
	FatherRelation,
	MaternalAuntRelation,
	MaternalUncleRelation,
	MotherRelation,
	PaternalAuntRelation,
	PaternalUncleRelation,
	SiblingsRelation,
	SisterInLawsRelation,
	SpouseRelation,
} from ".";
import {
	messages,
	Operations,
	Relations,
	Tgender,
	TRelationShipBuilder,
} from "../family-utils";

export default class RelationShipFactory {
	parsers: Object = {};
	builders: Object = {};
	messages: Object = {};

	constructor() {
		this.parsers = {
			[Relations.DAUGHTER]: {
				Relation: new ChildRelation(),
				gender: Tgender.FEMALE,
			},

			[Relations.SON]: {
				Relation: new ChildRelation(),
				gender: Tgender.MALE,
			},

			[Relations.FATHER]: {
				Relation: new FatherRelation(),
			},

			[Relations.MOTHER]: {
				Relation: new MotherRelation(),
			},

			[Relations.BROTHER]: {
				Relation: new SiblingsRelation(),
				gender: Tgender.MALE,
			},

			[Relations.SISTER]: {
				Relation: new SiblingsRelation(),
				gender: Tgender.FEMALE,
			},

			[Relations.SIBLINGS]: {
				Relation: new SiblingsRelation(),
			},

			[Relations.SPOUSE]: {
				Relation: new SpouseRelation(),
			},

			[Relations.SISTER_IN_LAW]: {
				Relation: new SisterInLawsRelation(),
			},

			[Relations.BROTHER_IN_LAW]: {
				Relation: new BrotherInLawsRelation(),
			},

			[Relations.MATERNAL_AUNT]: {
				Relation: new MaternalAuntRelation(),
			},

			[Relations.MATERNAL_UNCLE]: {
				Relation: new MaternalUncleRelation(),
			},

			[Relations.PATERNAL_UNCLE]: {
				Relation: new PaternalUncleRelation(),
			},

			[Relations.PATERNAL_AUNT]: {
				Relation: new PaternalAuntRelation(),
			},
		};

		this.builders = {
			[Operations.ADD_BROTHER_IN_LAW]: {
				Relation: new BrotherInLawsRelation(),
			},

			[Operations.ADD_SISTER_IN_LAW]: {
				Relation: new SisterInLawsRelation(),
			},

			[Operations.ADD_CHILD]: {
				Relation: new ChildRelation(),
			},

			[Operations.ADD_FATHER]: {
				Relation: new FatherRelation(),
			},

			[Operations.ADD_MOTHER]: {
				Relation: new MotherRelation(),
			},

			[Operations.ADD_MATERNAL_AUNT]: {
				Relation: new MaternalAuntRelation(),
			},

			[Operations.ADD_MATERNAL_UNCLE]: {
				Relation: new MaternalUncleRelation(),
			},

			[Operations.ADD_PATERNAL_AUNT]: {
				Relation: new PaternalAuntRelation(),
			},

			[Operations.ADD_PATERNAL_UNCLE]: {
				Relation: new PaternalUncleRelation(),
			},

			[Operations.ADD_SIBLING]: {
				Relation: new SiblingsRelation(),
			},

			[Operations.ADD_SPOUSE]: {
				Relation: new SpouseRelation(),
			},
		};

		this.messages = {
			[Operations.ADD_BROTHER_IN_LAW]:
				messages.BROTHER_IN_LAW_ADDITION_SUCCEEDED,

			[Operations.ADD_SISTER_IN_LAW]: messages.SISTER_IN_LAW_ADDITION_SUCCEEDED,

			[Operations.ADD_CHILD]: messages.CHILD_ADDITION_SUCCEEDED,

			[Operations.ADD_FATHER]: messages.FATHER_ADDITION_SUCCEEDED,

			[Operations.ADD_MOTHER]: messages.MOTHER_ADDITION_SUCCEEDED,

			[Operations.ADD_MATERNAL_AUNT]: messages.MATERNAL_AUNT_ADDITION_SUCCEEDED,

			[Operations.ADD_MATERNAL_UNCLE]:
				messages.MATERNAL_UNCLE_ADDITION_SUCCEEDED,

			[Operations.ADD_PATERNAL_AUNT]: messages.PATERNAL_AUNT_ADDITION_SUCCEEDED,

			[Operations.ADD_PATERNAL_UNCLE]:
				messages.PATERNAL_UNCLE_ADDITION_SUCCEEDED,

			[Operations.ADD_SIBLING]: messages.SIBLINGS_ADDITION_SUCCEEDED,

			[Operations.ADD_SPOUSE]: messages.SPOUSE_ADDITION_SUCCEEDED,
		};
	}

	getRelationshipParser(relation: Relations): TRelationShipBuilder {
		if (!relation || !this.parsers[relation]) {
			throw new Error("Unable to find the relations for parser");
		}

		return this.parsers[relation];
	}

	getRelationshipBuilder(relation: Operations) {
		if (!relation || !this.builders[relation]) {
			throw new Error("Unable to find the relations for builder");
		}

		return this.builders[relation];
	}

	getRelationShipBuilderMessages(relation: Operations) {
		if (!relation || !this.messages[relation]) {
			throw new Error("Unable to find the relations for builder message");
		}

		return this.messages[relation];
	}
}
