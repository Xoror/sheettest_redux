import React, { useState} from 'react';
import { useDispatch, useSelector } from "react-redux"

import CreatableSelect from 'react-select/creatable';
import Button from 'react-bootstrap/Button';
import CardGroup from 'react-bootstrap/CardGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

import "../styles.css"

import { ResourcesList } from './ResourcesList';
import { MiscProficiencies} from "../attributes/MiscProficiencies"

import { addResource } from './ResourcesSlice';
import { addMiscProficiency } from '../attributes/AttributesSlice';

export const ResourcesMiscProficiencies = () => {
	const dispatch = useDispatch()
    const proficienciesTypes = useSelector(state => state.attributes.proficienciesTypes)
    
	const handleAddResource = (event) => {
		event.preventDefault();
		dispatch(addResource(
            {name: event.target[0].value, current: event.target[2].value, maximum: event.target[3].value, dice: event.target[1].value}
        ))
	}
	const handleAddMiscProficiency = (event) => {
		event.preventDefault();
		console.log([event.target[0].value, selectedType, event.target[2].value, event.target[3].value])
		dispatch(addMiscProficiency(
            [event.target[0].value, selectedType, event.target[2].value, event.target[3].value]
        ))
	}
	const [showAddResource, setShowAddResource] = useState(false);
	const handleShowAddResource = () => setShowAddResource(true);
	const handleCloseAddResource = () => setShowAddResource(false);
	
	const [showAddMiscProf, setShowAddMiscProf] = useState(false);
	const handleShowAddMiscProf = () => setShowAddMiscProf(true);
	const handleCloseAddMiscProf = () => setShowAddMiscProf(false);
	
	const [selectedType, setSelectedType] = useState("");
	
	const customStyles = {
		option: (defaultStyles) => ({
			...defaultStyles,
			color: "#000000",
		}),
	}

	return (
	<div>
		<div className="container-fluid">
			<Modal show={showAddResource}>
				<Form onSubmit={handleAddResource}>
					<Modal.Header>
						<Modal.Title> Add Resource </Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<InputGroup>
							<InputGroup.Text>Name</InputGroup.Text>
							<Form.Control required name="Name" placeholder="Name" aria-label="Name"/>
							<InputGroup.Text>Dice</InputGroup.Text>
							<Form.Control required name="Dice" placeholder="Dice" aria-label="Dice"/>
						</InputGroup>
						<InputGroup>
							<InputGroup.Text>Current</InputGroup.Text>
							<Form.Control required name="Current" placeholder="Current" aria-label="Current"/>
							<InputGroup.Text>Maximum</InputGroup.Text>
							<Form.Control required name="Maximum" placeholder="Maximum" aria-label="Maximum"/>
						</InputGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="danger" onClick={handleCloseAddResource}>
							Close
						</Button>
						<Button variant="success" type="submit">
							Save Changes
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
			
			<Modal show={showAddMiscProf}>
				<Form onSubmit={(event) => handleAddMiscProficiency(event)}>
					<Modal.Header>
						<Modal.Title> Add Misc Proficiency </Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<InputGroup>
							<InputGroup.Text>Name</InputGroup.Text>
							<Form.Control required name="Name" placeholder="Name" aria-label="Name"/>
							<InputGroup.Text>Type</InputGroup.Text>
							<CreatableSelect required styles={customStyles} isClearable options={proficienciesTypes} onChange={(value) => setSelectedType(value)}/>
						</InputGroup>
						<InputGroup>
							<InputGroup.Text htmlFor="proficiencyInput">Proficient</InputGroup.Text>
							<Form.Select id="proficiencyInput">
								<option value="True">Yes</option>
								<option value="False">No</option>
							</Form.Select>
							<InputGroup.Text htmlFor="expertiseInput">Expertise</InputGroup.Text>
							<Form.Select id="expertiseInput">
								<option value="True">Yes</option>
								<option value="False">No</option>
							</Form.Select>
							<Button variant="success" type="submit">Submit</Button>
						</InputGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseAddMiscProf}>
							Close
						</Button>
						<Button variant="primary" type="submit">
							Save Changes
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
			
			<CardGroup>
				<div className="card bg-secondary border-dark justify-content-middle">
					<Button variant="primary" onClick={handleShowAddResource}> Add Resource </Button>
					<ResourcesList/>
				</div>
				<div className="card bg-secondary border-dark justify-content-middle">
					<Button variant="primary" onClick={handleShowAddMiscProf}> Add Misc Proficiency</Button>
					<MiscProficiencies/>
				</div>
			</CardGroup>
			
		</div>
	</div>
	)
}