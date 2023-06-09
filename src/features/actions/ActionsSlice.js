import { createAsyncThunk, createSlice, nanoid, current } from "@reduxjs/toolkit";
import axios from "axios";

import {spellList} from "../../data/spellsSRD.js";


export const getAPISPelllist = createAsyncThunk('actions/fetchAPISpelllist', async () => {
    let spellListNames = []
    let spellList = []
    try {
        let response = await axios.get("https://www.dnd5eapi.co/api/spells")
         spellListNames = response.data.results
        await axios.all(
            spellListNames.map(name => (axios.get(`https://www.dnd5eapi.co${name.url}`)))
        ).then((responses => {
            responses.forEach((resp) => {
                spellList.push(resp.data)
            })
        }))
        return spellList
    } catch (error) {
        console.error(error)
        return []
    }
})
export const buildSpelllistFromDB = createAsyncThunk("actions/buildSpellListFromDB", async (payload) => {
    try {
        let result = await window.api.getFullDB(payload)
        return result
    } catch (error) {
        console.log(error)
        return []
    }
})

const initialState = {
    actions: [
        {id:nanoid(), name: "Unarmed Attack", range: "Melee",  damage: 1, type: "Action", scaling: "Strength", isProficient: true, damageType:"Bludgeoning", description:"An attack with your fist, ellbow, head etc."},
    ],
    spells: [
	],
    spellListImportStatues: "idle",
	sortedSpellList: [],
    highestSpellSlot: "1st",
    spellListAPI: []
}

const ActionsSlice = createSlice({
    name: "actions",
    initialState,
    reducers: {
        addAction: {
            reducer(state, action) {
                if(action.payload[1] === "Actions") {
                    state.actions.push(action.payload[0])
                }
                else if(action.payload[1] === "Spells") {
                    let slots = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]
                    let test1 = slots.indexOf(action.payload[0].type)
                    let test2 = slots.indexOf(state.highestSpellSlot)
                    if(test1 > test2) { 
                        state.highestSpellSlot = action.payload[0].type
                    }
                    state.spells.push(action.payload[0])
                }
            },
            prepare(data, id) {
                data["id"] = nanoid()
                return {
                    payload: [data, id]
                }
            }
        },
        editAction: {
            reducer(state, action) {
                if(action.payload[1] === "Actions") {
                    console.log(action.payload[0])
                    let testIndex = state.actions.indexOf(state.actions.find(action1 => {return action1.id === action.payload[0].id}))
                    state.actions[testIndex] = action.payload[0]
                }
                else if(action.payload[2] === "Spells") {
                    let slots = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]
                    let test1 = slots.indexOf(action.payload[0].type)
                    let test2 = slots.indexOf(state.highestSpellSlot)
                    if(test1 > test2) {
                        state.highestSpellSlot = action.payload[0].type
                    }
                    
                    let testIndex = state.spells.indexOf(state.spells.find(action1 => {return action1.id === action.payload[1].id }))
                    state.spells[testIndex] = action.payload[0]
                }
            },
            prepare(data, id) {
                return {
                    payload: [data, id]
                }
            }
        },
        deleteAction: {
            reducer(state, action) {
                if(action.payload[2] === "Actions") {
                    let test = state.actions.filter((action1) => {return action1.type === action.payload[0]})[action.payload[1]]
                    let index = state.actions.indexOf(test)
                    
                    state.actions = state.actions.slice(0, index).concat(state.actions.slice(index + 1))		
                }
                else if(action.payload[2] === "Spells") {
                    let test = state.spells.filter((action1) => {return action1.type === action.payload[0]})[action.payload[1]]
                    let index = state.spells.indexOf(test)
                    
                    let test2 = state.sortedSpellList.filter(spell => {return spell.name === test.name})[0]
                    if(test2) {
                        test2.isPrepared = false
                    }
                    
                    state.spells = state.spells.slice(0, index).concat(state.spells.slice(index + 1))
                    
                    var slots = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]
                    var maxIndex = slots.indexOf(state.highestSpellSlot)
                    
                    for(let i=maxIndex; i>=0; i--) {
                        if(i > 0) {
                            if( state.spells.filter(spell => {return spell.type === slots[i]}).length === 0) {
                            }
                            else {
                                state.highestSpellSlot = slots[i]
                                break
                            }
                        }
                        else {
                            state.highestSpellSlot = slots[i]
                            break
                        }
                    }
                }
            },
            prepare(type, index, id){
                return {
                    payload: [type, index, id] 
                }
            }
        },
        setPrepared: {
            reducer(state, action) {
                if(action.payload[1]) {
                    if(state.spells.filter(spell => {return spell.name === action.payload[0]}).length === 0) {
                        let spell = state.sortedSpellList.filter(spell => {return spell.name === action.payload[0]})[0]
                        state.spells.push(spell)
                        spell.isPrepared = true
                        let slots = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]
                        let test1 = slots.indexOf(spell.type)
                        let test2 = slots.indexOf(state.highestSpellSlot)
                        if(test1 > test2) {
                            state.highestSpellSlot = slots[test1]
                        }
                    }
                    else {
                        state.spells.filter(spell => {return spell.name === action.payload[0]})[0].isPrepared = action.payload[1]
                    }
                }
                else {
                    if(action.payload[2]) {
                        let test = state.spells.filter(spell => {return spell.name === action.payload[0]})[0]
                        test.isPrepared=false
                        let test2 = state.sortedSpellList.filter(spell => {return spell.name === action.payload[0]})[0]
                        if(test2) {
                            test2.isPrepared = action.payload[1]
                        }
                        let index = state.spells.indexOf(test)
                        state.spells = state.spells.slice(0, index).concat(state.spells.slice(index + 1))
                        
                        
                        var slots = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]
                        var maxIndex = slots.indexOf(state.highestSpellSlot)
                        
                        for(let i=maxIndex; i>=0; i--) {
                            if(i > 0) {
                                if( state.spells.filter(spell => {return spell.type === slots[i]}).length === 0) {
                                }
                                else {
                                    state.highestSpellSlot = slots[i]
                                    break
                                }
                            }
                            else {
                                state.highestSpellSlot = slots[i]
                                break
                            }
                        }
                    }
                    else {
                        let test = state.spells.filter(spell => {return spell.name === action.payload[0]})[0]
                        test.isPrepared=false
                    }
                }
            },
            prepare(id, checked, offCanvas) {
                return{
                    payload: [id, checked, offCanvas]
                }
            }
        },
        buildSpelllist(state, action) {
            if(state.sortedSpellList.length === 0) {
				const listSlots = ["cantrip", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]
				const returnSpellslot = (number) => {
					if(number === 0) {
						return "Cantrip"
					}
					else {
						return listSlots[parseInt(number)]
					}
				}
                var spellLiistUnformatted = []
                var spellLiistFormatted

				spellList.map((spell, index) => (
					spellLiistUnformatted.push(
                        {
                            showCard:false,
                            filtered:true, 
                            id: nanoid(), 
                            name: spell.name, 
                            range: spell.range, 
                            damage: spell.damage === undefined ? "None" : (spell.level === 0 ? spell.damage.damage_at_character_level[spell.level+1] : spell.damage.damage_at_slot_level[spell.level]), 
                            type: returnSpellslot(spell.level), 
                            scaling: action.payload[1], 
                            isPrepared: false, 
                            damageType: spell.damage === undefined ? "None" : (spell.damage.damage_type === undefined ? "None": spell.damage.damage_type.name), 
                            description: [spell.desc, spell.higher_level], 
                            school: spell.school.name, 
                            ritual: spell.ritual, 
                            classes: spell.classes, 
                            components: spell.components,
                            duration: [spell.duration, spell.concentration], 
                            castingTime: spell.casting_time
                        }
                    )
                    //window.api.addRow(["update spells set data = ? where id = ?", [JSON.stringify(spellLiistUnformatted[index], null), index + 1]])
				))
                
				var spellLiistFormatted = spellLiistUnformatted.sort((a, b) => {
					const nameA = a.name.toUpperCase(); // ignore upper and lowercase
					const nameB = b.name.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}

					// names must be equal
					return 0;
				});
				state.sortedSpellList = spellLiistFormatted
				console.log(state.sortedSpellList)
			}
        },
        updateSpellListScaling(state, action) {
            state.sortedSpellList.map(spell => (
                spell.scaling = action.payload
            ))
        },
        updateSpellCardShow(state, action) {
            state.spells.map(spell => (
                spell.showCard = spell.id === action.payload[0] ? !spell.showCard : false
            ))
        },
        filterSpells(state, action) {
            let filters = action.payload[0]
            let search = action.payload[1]
            
            var test1
			var test2
			var test3
			var test4
            var test5
            var count = 0
            for(let i=0; i<state.sortedSpellList.length; i++) {
                test4 = false
                let body = state.sortedSpellList[i]
                // Testing spell tier and school
                if(filters.spellslots.length != 0 && filters.schools.length != 0) {
                    test1 = filters.spellslots.find(spellslot => (spellslot === body.type)) ? true : false
                    test2 = filters.schools.find(school => (school === body.school)) ? true : false
                }
                else if(filters.spellslots.length === 0 && filters.schools.length != 0) {
                    test1 = true
                    test2 = filters.schools.find(school => (school === body.school)) ? true : false
                }
                else if(filters.spellslots.length != 0 && filters.schools.length === 0) {
                    test1 = filters.spellslots.find(spellslot => (spellslot === body.type)) ? true : false
                    test2 = true
                }
                else if(filters.spellslots.length === 0 && filters.schools.length === 0) {
                    test1 = true
                    test2 = true
                }

                // testing search
                if(search != "") {
                    test3 = body.name.toLowerCase().includes(search.toLowerCase())
                }
                else {
                    test3 = true
                }

                // testing class
                if(filters.classes.length != 0) {
                    for(let j=0; j<filters.classes.length;j++) {
                        for(let k=0; k<body.classes.length;k++) {
                            if(filters.classes[j] === body.classes[k].name) {
                                test4 = true
                            }
                        }
                    }
                } else {
                    test4 = true
                }
                
                //testing ritual
                if(filters.ritual.length != 0) {
                    if(filters.ritual.length == 1) {
                        let test
                        if(body.ritual) {
                            test = "ritual"
                        }
                        else {
                            test="not ritual"
                        }
                        test5 = filters.ritual.find(ritual => (ritual === test)) ? true:false
                    }
                    else if (filters.ritual.length == 2) {
                        test5 = false
                    }
                }
                else {
                    test5 = true
                }
                
                state.sortedSpellList[i].filtered = test1 && test2 && test3 && test4 && test5
            }
        },
        importActions(state, action) {
            let keys1 = Object.keys(state)
            keys1.map(key => 
                state[key] = action.payload[key]
            )
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getAPISPelllist.fulfilled, (state, action) => {
                state.spellListAPI = action.payload
            })

            .addCase(buildSpelllistFromDB.pending, (state, action) => {

            })
            .addCase(buildSpelllistFromDB.fulfilled, (state, action) => {
                if(state.sortedSpellList.length === 0) {
                    const listSlots = ["cantrip", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]
                    const returnSpellslot = (number) => {
                        if(number === 0) {
                            return "Cantrip"
                        }
                        else {
                            return listSlots[parseInt(number)]
                        }
                    }
                    var spellLiistUnformatted = []
                    action.payload.map((data, index) => (
                        spellLiistUnformatted.push(JSON.parse(data.data))
                    ))
                    
                    var spellLiistFormatted = spellLiistUnformatted.sort((a, b) => {
                        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
    
                        // names must be equal
                        return 0;
                    });
                    state.sortedSpellList = spellLiistFormatted
                    console.log(state.sortedSpellList)
                    
                }
            })
            .addCase(buildSpelllistFromDB.rejected, (state, action) => {

            })
    }
})


export default ActionsSlice.reducer

export const { addAction, editAction, deleteAction, setPrepared, buildSpelllist, buildSpelllistAPI, 
    importActions, filterSpells, updateSpellListScaling, updateSpellCardShow } = ActionsSlice.actions