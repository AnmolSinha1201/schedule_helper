import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import FormControl from 'react-bootstrap/FormControl'
import styles from './Styles.module.css'; // Import css modules stylesheet as styles

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
	({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
		const [value, setValue] = useState('');

		return (
			<div
				ref={ref}
				style={style}
				className={className}
				aria-labelledby={labeledBy}
			>
				<FormControl
					autoFocus
					className={styles.Searchbar}
					placeholder="Type to filter..."
					onChange={(e) => setValue(e.target.value)}
					value={value}
				/>
				<ul className="list-unstyled">
					{React.Children.toArray(children).filter(
						(child) =>
							!value || child.props.children.toLowerCase().startsWith(value),
					)}
				</ul>
			</div>
		);
	},
);

const FilterDropDown = ({defaultText = "Default", data, returnStateHandler}) => {
	const [text, setText] = useState(defaultText);
	const selectHandler = (index) => {
		setText(data[index])
		returnStateHandler(index)
	}

	return (
		<Dropdown>
			<Dropdown.Toggle variant='info'>
				{text}
			</Dropdown.Toggle>

			<Dropdown.Menu as={CustomMenu} className={styles.DropDown}>
				{ data.map((row, index) => <Dropdown.Item eventKey={index} key={index} 
				onSelect={selectHandler}>{row}</Dropdown.Item>) }
			</Dropdown.Menu>
		</Dropdown>
	)
}

export default FilterDropDown