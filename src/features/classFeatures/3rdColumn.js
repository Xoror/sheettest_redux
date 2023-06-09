import React, { useState} from 'react';
import { useDispatch, useSelector } from "react-redux"


import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FeaturesBox } from './FeaturesBox';
import { ActionsBox } from '../actions/ActionsBox'
import { InventoryBox } from '../inventory/InventoryBox';
import { Notes } from '../notes/Notes';
import { ActionCard } from '../../components/ActionCard';

import { buildSpelllist, buildSpelllistFromDB } from '../actions/ActionsSlice';
import { importCharacterNames } from '../nav/NavBarSlice';


export const ThirdColumn = () => {
	const dispatch = useDispatch()
    const actions = useSelector(state => state.actions.actions)
    const spells = useSelector(state => state.actions.spells)
    const charClass = useSelector(state => state.charDetails.charClass)
    const castingAttribute = useSelector(state => state.attributes.casting.scaling)
    const highestSpellSlot = useSelector(state => state.actions.highestSpellSlot)
	const [radioValue, setRadioValue] = useState("0");
	const desktop = useSelector(state => state.desktop)

	const handleSwitch = (event) => {
		setRadioValue(event.target.value)
		if(event.currentTarget.value === "2") {
			if(!desktop) {
				dispatch(buildSpelllist([charClass, castingAttribute]))
			}
			else if(desktop) {
				dispatch(buildSpelllistFromDB("SELECT data FROM spells")).then(result => console.log(result))
			}
			//dispatch(getAPISPelllist())
		}
	}

	const radios = [
		{ name: "Features", value: "0" },
		{ name: "Actions", value: "1" },
		{ name: "Spells", value: "2" },
		{ name: "Inventory", value: "3" },
		{ name: "Notes", value: "4" }
	];

	const headersActions = ["Action", "Bonus Action", "Reaction", "Special"];
	const listSlots = ["Cantrip","1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]
	const headersSpells = listSlots.slice(0,listSlots.indexOf(highestSpellSlot)+1)
	const sections = [
        <FeaturesBox/>, 
        <ActionsBox offCanvas={false} actions={actions} id="Actions" options={headersActions} headers={headersActions}/>, 
        <ActionsBox offCanvas={false} actions={spells} id="Spells" options={listSlots} headers={headersSpells} spells={true}/>, 
        <InventoryBox/>, 
        <Notes/>,
    ]
	
	return (
		<Card bg="secondary"  style={{border:"1px solid black"}}>
			<div>
				<ButtonGroup style={{width:"100%"}}>
					{radios.map((radio, idx) => (
						<ToggleButton key={`3rdColumnButton-${idx}`} id={`3rdColumnButton-${idx}`} type="radio" variant='primary' name="radio" value={radio.value} checked={radioValue === radio.value} onChange={handleSwitch} >
							{radio.name}
						</ToggleButton>
					))}
				</ButtonGroup>
			</div>
			<div>
				{sections[parseInt(radioValue)]}
			</div>
		</Card>
	)
}
/*
<ButtonGroup>
	{radios.map((radio, idx) => (
		<ToggleButton key={idx} id={`radio-${idx}`} type="radio" variant='primary' name="radio" value={radio.value} checked={radioValue === radio.value} onChange={handleSwitch} >
			{radio.name}
		</ToggleButton>
	))}
</ButtonGroup>
*/