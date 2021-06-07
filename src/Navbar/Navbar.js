import styles from './Navbar.module.css'
import {useState} from 'react'

const Navbar = () => {
	const NavMenuItems = ['Home', 'Contact Us']
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<div className={styles.NavbarWrapper}>
			<div className={styles.Title}>
				Schedule Helper
			</div>
			<div className={styles.NavigationItems}>
				{
					NavMenuItems.map((item, index) => (
						<div  key={index}
						className={[styles.SingleNavigationItem, selectedIndex == index ? styles.SelectedItem : null].filter(i => i!= null).join(' ')} 
						onClick={() => setSelectedIndex(index)} >
							<div className={styles.TextContainer}>
								{item}
							</div>
						</div>
					))
				}
				
			</div>
		</div>
	)
}

export default Navbar