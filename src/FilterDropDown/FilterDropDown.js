import React, { useState } from 'react'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import Form from 'react-bootstrap/Form'

const FilterDropDown = ({defaultText = "Default", selectedIndex = null, data, returnStateHandler = (opt) => {}}) => {
	const [singleSelections, setSingleSelections] = useState(selectedIndex == null ? [] : [data[selectedIndex]]);

	const handleChange = (selectedOptions) => {
		setSingleSelections(selectedOptions);
		returnStateHandler(selectedOptions);
	}

	return (
		<Typeahead
			id="basic-typeahead-single"
			labelKey={option => option.name}
			options = {data}
			placeholder={defaultText}
			selected={singleSelections}
			onChange={handleChange}
		/>
	);
}

export default FilterDropDown