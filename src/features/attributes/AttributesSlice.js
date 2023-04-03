import { createSlice, nanoid, createAction } from "@reduxjs/toolkit"


export const attributeChange = createAction(
	"attributes/attributeChange",
	async (payload, dispatch) => {
		dispatch(attributeChange2(payload))
		dispatch(computeInitiative())
		dispatch(updateProficiencies())
		dispatch(computeAC())
		dispatch(computeHitDC())
	}
  )

const initialState = {
	casting: {isCaster: true, type: "", spellAttribute: "", spellHit: 2, spellDC: 10},
    charAttributes: [
		{ id: 'Strength', name: 'Strength', value: 10, bonus: 0},
		{ id: 'Dexterity', name: 'Dexterity', value: 10, bonus: 0},
		{ id: 'Constitution', name: 'Constitution', value: 10, bonus: 0},
		{ id: 'Intelligence', name: 'Intelligence', value: 10, bonus: 0},
		{ id: 'Wisdom', name: 'Wisdom', value: 10, bonus: 0},
		{ id: 'Charisma', name: 'Charisma', value: 10, bonus: 0},
	],
	jackOfAllTrades: false,
	skills: [
		{id: "StrenghtSave", name: "Strength Saving Throw", shortName: "Saving Throw", supSkill: "Strength", bonus: 0, proficient: false, expertise: false},
		{id: "Athletics", name:"Athletics", shortName:"Athletic", supSkill: "Strength", bonus: 0, proficient: false, expertise: false},
		{id: "DexteritySave", name: "Dexterity Saving Throw", shortName: "Saving Throw", supSkill: "Dexterity", bonus: 0, proficient: false, expertise: false},
		{id: "Acrobatics", name:"Acrobatics", shortName:"Acrobatics", supSkill: "Dexterity", bonus: 0, proficient: false, expertise: false},
		{id: "SlightOfHand", name:"Slight of Hand", shortName:"Slight of Hand", supSkill: "Dexterity", bonus: 0, proficient: false, expertise: false},
		{id: "Stealth", name:"Stealth", shortName:"Stealth", supSkill: "Dexterity", bonus: 0, proficient: false, expertise: false},
		{id: "ConstitutionSave", name: "Constitution Saving Throw", shortName: "Saving Throw", supSkill: "Constitution", bonus: 0, proficient: false, expertise: false},
		{id: "IntelligenceSave", name: "Intelligence Saving Throw", shortName: "Saving Throw", supSkill: "Intelligence", bonus: 0, proficient: false, expertise: false},
		{id: "Arcana", name:"Arcana", shortName:"Arcana", supSkill: "Intelligence", bonus: 0, proficient: false, expertise: false},
		{id: "History", name:"History", shortName:"History", supSkill: "Intelligence", bonus: 0, proficient: false, expertise: false},
		{id: "Investigation", name:"Investigation", shortName:"Investigation", supSkill: "Intelligence", bonus: 0, proficient: false, expertise: false},
		{id: "Nature", name:"Nature", shortName:"Nature", supSkill: "Intelligence", bonus: 0, proficient: false, expertise: false},
		{id: "Religion", name:"Religion", shortName:"Religion", supSkill: "Intelligence", bonus: 0, proficient: false, expertise: false},
		{id: "WisdomSave", name: "Wisdom Saving Throw", shortName: "Saving Throw", supSkill: "Wisdom", bonus: 0, proficient: false, expertise: false},
		{id: "AnimalHandling", name: "Animal Handling", shortName: "Animal Handling", supSkill: "Wisdom", bonus: 0, proficient: false, expertise: false},
		{id: "Insight", name: "Insight", shortName: "Insight", supSkill: "Wisdom", bonus: 0, proficient: false, expertise: false},
		{id: "Medicine", name: "Medicine", shortName: "Medicine", supSkill: "Wisdom", bonus: 0, proficient: false, expertise: false},
		{id: "Perception", name: "Perception", shortName: "Perception", supSkill: "Wisdom", bonus: 0, proficient: false, expertise: false},
		{id: "Survival", name: "Survival", shortName: "Survival", supSkill: "Wisdom", bonus: 0, proficient: false, expertise: false},
		{id: "CharismaSave", name: "Charisma Saving Throw", shortName: "Saving Throw", supSkill: "Charisma", bonus: 0, proficient: false, expertise: false},
		{id: "Deception", name: "Deception", shortName: "Deception", supSkill: "Charisma", bonus: 0, proficient: false, expertise: false},
		{id: "Intimidation", name: "Intimidation", shortName: "Intimidation", supSkill: "Charisma", bonus: 0, proficient: false, expertise: false},
		{id: "Performance", name: "Performance", shortName: "Performance", supSkill: "Charisma", bonus: 0, proficient: false, expertise: false},
		{id: "Persuasion", name: "Persuasion", shortName: "Persuasion", supSkill: "Charisma", bonus: 0, proficient: false, expertise: false},
		{id: "SimpleWeapons", name: "Simple Weapons", shortName: "Simple Weapons", supSkill: "Weapon", bonus: "", proficient: false, expertise: false},
		{id: "MartialWeapons", name: "Martial Weapons", shortName: "Martial Weapons", supSkill: "Weapon", bonus: "", proficient: false, expertise: false},
		{id: "Shield", name: "Shield", shortName: "Shield", supSkill: "Weapon", bonus: "", proficient: false, expertise: false},
		{id: "LightArmor", name: "Light Armor", shortName: "Light Armor", supSkill: "Armor", bonus: "", proficient: false, expertise: false},
		{id: "MediumArmor", name: "Medium Armor", shortName: "Medium Armor", supSkill: "Armor", bonus: "", proficient: false, expertise: false},
		{id: "HeavyArmor", name: "Heavy Armor", shortName: "Heavy Armor", supSkill: "Armor", bonus: "", proficient: false, expertise: false},
	],
	proficienciesTypes: [
		{value: "Weapon", label: "Weapon"}, 
		{value: "Armor", label: "Armor"}, 
		{value: "Tool", label: "Tool"}, 
		{value: "Instrument", label: "Instrument"},
	],
	proficiency: {id: "proficiency", name: "Proficiency", value: 2},
    charAC: {id: "AC", name: "AC", value: 10, baseAC: 10, scalingPrimary: "Dexterity", unarmoredDefense: true, scalingSecondary: "None", wearsArmor: false, maxBonus: 100, stealthDisadvantage: false},
	initiative: {id: "initiative", name: "Initiative", value: 0, scalingPrimary: "Dexterity", scalingSecondary: "None", flatBonus: 0 }
}

const AttributeSlice = createSlice({
    name: "attributes",
    initialState,
    reducers: {
        changeJackOfAllTrades(state, action) {
            state.jackOfAllTrades = action.payload
        },
        attributeChange2(state, action) {
            var id = action.payload[1];
            const bonus = (value) => {
                return Math.floor( (value - 10)/2);
            }
            /* Dangerous bc "change" IS the state.charattribute object, so change that directly and not a copy like in python!! */
            var change = state.charAttributes.filter(attribute => attribute.id=== id)[0]
            change.value = action.payload[0]
            change.bonus = bonus(action.payload[0])
        },
        proficiencyChange(state, action) {
            var id2 = action.payload[2];
			var name2 = action.payload[1];
			let skill = state.skills.filter((skill) => {return skill.name === name2})[0]
			if(id2 === "Proficiency") {
				skill.proficient = action.payload[0]
				if(action.payload[0] === false) {
					skill.expertise = action.payload[0]
				}
			}
			else if (id2 === "Expertise") {
				skill.expertise = action.payload[0]
				if(action.payload[0] === true) {
					skill.proficient = action.payload[0]
				}
			}
        },
		addMiscProficiency(state, action) {
			if(action.payload[1].__isNew__ === true) {
				state.proficienciesTypes.push({value: action.payload[1].value, label: action.payload[1].label})
				console.log("new entry")
			}
			state.skills.push( 
				{id: action.payload[0], name: action.payload[0], shortName: action.payload[0], supSkill: action.payload[1].value, bonus: "", proficient: action.payload[2], expertise: action.payload[3]}, 
			)
		},
		updateProficiency(state, action) {
			state.proficiency.value =  Math.floor( 2 + ((action.payload-1)/4) );
		},
		updateProficiencies(state, action) {
			for(let j=0;j<24;j++) {
				let skill = state.skills[j];
				let modifier = 0;
				if(skill.proficient === true) {
					modifier += state.proficiency.value;
					if(skill.expertise === true) {
						modifier += state.proficiency.value;
					}
				}
				else if(state.jackOfAllTrades === true) {
					modifier += Math.floor(state.proficiency.value/2)
				}
				skill.bonus = state.charAttributes.filter((attribute) => {return attribute.name === skill.supSkill})[0].bonus + modifier
			}
		},
		changeAC: {
			reducer(state, action) {
				if(action.payload.wearsArmor) {
					state.charAC.wearsArmor = true
					state.charAC.unarmoredDefense = false
					state.charAC.baseAC = parseInt(action.payload.baseAC)
					state.charAC.scalingPrimary = action.payload.scalingPrimary
					state.charAC.maxBonus = parseInt(action.payload.maxBonus)
					state.charAC.stealthDisadvantage = action.payload.stealthDisadvantage
				}
				/*{wearsArmor: false, unarmoredDefense: true, baseAC: event.target[1].value, scalingPrimary: event.target[2].value, scalingSecondary: event.target[3].value}*/
				else if(action.payload.unarmoredDefense) {
					state.charAC.wearsArmor = false
					state.charAC.unarmoredDefense = true
					state.charAC.baseAC = parseInt(action.payload.baseAC)
					state.charAC.scalingPrimary = action.payload.scalingPrimary
					state.charAC.scalingSecondary = action.payload.scalingSecondary
				}
			},
			prepare (data, id) {
                return {
                    payload: data,
                    id: id
                }
            }
		},
		computeAC(state, action) {
			let ACtest = 0
			if(state.charAC.unarmoredDefense) {
				ACtest = state.charAC.baseAC + state.charAttributes.filter(attribute => {return attribute.name === state.charAC.scalingPrimary})[0].bonus
				if(state.charAC.scalingSecondary != "None") {
					ACtest += state.charAttributes.filter(attribute => {return attribute.name === state.charAC.scalingSecondary})[0].bonus
				}
			}
			else if(state.charAC.wearsArmor) {
				let bonus = state.charAttributes.filter(attribute => {return attribute.name === state.charAC.scalingPrimary})[0].bonus
				ACtest = state.charAC.baseAC + (bonus > state.charAC.maxBonus ? state.charAC.maxBonus : bonus)
			}
			state.charAC.value = ACtest
		},
		changeInitiative: {
			reducer(state, action) {
				/*{scalingPrimary: event.target[0].value, scalingSecondary: event.target[1].value, flatBonus: event.target[2].value}*/
				state.initiative.scalingPrimary = action.payload.scalingPrimary
				state.initiative.scalingSecondary = action.payload.scalingSecondary
				state.initiative.flatBonus = parseInt(action.payload.flatBonus)
				computeInitiative()
			},
			prepare (data, id) {
                return {
                    payload: data,
                    id: id
                }
            }
		},
		computeInitiative(state, action) {
			state.initiative.value = 0 + (state.initiative.flatBonus)
			if(state.initiative.scalingPrimary != "None") {
				state.initiative.value += state.charAttributes.filter(attribute => {return attribute.name === state.initiative.scalingPrimary})[0].bonus
			}
			if(state.initiative.scalingSecondary != "None") {
				state.initiative.value += state.charAttributes.filter(attribute => {return attribute.name === state.initiative.scalingSecondary})[0].bonus
			}
		},
		computeHitDC(state, action) {
			let filteredAttribute = state.charAttributes.filter(attribute => {return attribute.name === state.casting.spellAttribute})
			if(filteredAttribute.length != 0) {
				state.casting.spellHit = parseInt(state.proficiency.value) + parseInt(filteredAttribute[0].bonus)
				state.casting.spellDC = 8 + state.casting.spellHit
			}
			else {
				state.casting.spellHit = parseInt(state.proficiency.value)
				state.casting.spellDC = 8 + state.casting.spellHit
			}
		},
		changeIsCaster(state, action) {
            state.casting.isCaster = action.payload
        },
        changeCastingAttribute(state, action) {
            state.casting.spellAttribute = action.payload
        },
        changeCasterType(state, action) {
            state.casting.type = action.payload
        },
		importAttributes(state, action) {
			let keys1 = Object.keys(state)
            keys1.map(key => 
                state[key] = action.payload[key]
            )
		}
    }
})

export default AttributeSlice.reducer
export const {changeAC, computeAC, 
	changeJackOfAllTrades, attributeChange2,
	proficiencyChange, addMiscProficiency, updateProficiency, updateProficiencies, 
	changeInitiative, computeInitiative,
	computeHitDC, changeIsCaster, changeCasterType, changeCastingAttribute, importAttributes} = AttributeSlice.actions