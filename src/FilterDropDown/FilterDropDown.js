import React, { useState } from 'react'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import Form from 'react-bootstrap/Form'

const FilterDropDown = ({defaultText = "Default", selectedIndex = null, data, returnStateHandler = (opt) => {}}) => {
	const [singleSelections, setSingleSelections] = useState([]);

	const handleChange = (selectedOptions) => {
		returnStateHandler(selectedOptions);
	}

	return (
		<Form.Group>
			<Typeahead
				id="basic-typeahead-single"
				labelKey={option => option.name}
				options = {data}
				placeholder={defaultText}
				selected={singleSelections}
				onChange={handleChange}
			/>
		</Form.Group>
	);
}

export default FilterDropDown