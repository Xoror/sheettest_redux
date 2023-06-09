import React from 'react';
import { useSelector } from "react-redux"

import { SkillItem } from './AttributeSkills';

export const MiscProficienciesList = (props) => {
	const skills = useSelector(state => state.attributes.skills)
	return (
		<dl>
			<dt>{props.name}</dt>
			{skills.filter((skill) => {return skill.supSkill === props.name}).map((skill) => (
					<SkillItem key={skill.id} skill2={skill}/>
				))}
		</dl>
	);
}