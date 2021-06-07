import {useEffect, useState} from 'react'
import FilterDropDown from '../FilterDropDown/FilterDropDown'
import Button from 'react-bootstrap/Button'
import MapView from '../Map/Map'
import styles from './StopSelect.module.css'
import DisplayTable from '../Table/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

const StopSelect = () => {
	const [ allStopsNamesA, setAllStopsNamesA ] = useState(['Maria'])
	const [ allStopsNamesB, setAllStopsNamesB ] = useState([])
	const [ allData, setAllData ] = useState([])
	const [ selectedIndex, setSelectedIndex ] = useState(null);
	const [ itineraries, setItineraries ] = useState([]);
	const mariaStop = { lat: 60.16843, lon: 24.92115, name: 'Maria' };

	useEffect(() => {
		getAllStops()
		.then(result => {
			setAllStopsNamesB(result.data.stops.map(row => row.name))
			setAllData(result.data.stops)
		});
	}, [])

	const clickHandler = () => {
		getItinerary(mariaStop, allData[selectedIndex])
		.then(result => setItineraries(result.data.plan.itineraries[0].legs))
	}

	const polyUtil = require('polyline-encoded');
	return (
		<div className={styles.Wrapper}>
			<MapView coordinatesArray={itineraries.map(leg => polyUtil.decode(leg.legGeometry.points))} start={mariaStop} end={allData[selectedIndex]} className={styles.MapViewWrapper}/>
			<div className={styles.SelectorsWrapper}>
				<div className={styles.ControlsWrapper}>
					<FilterDropDown defaultText='Select stop' selectedIndex={0} data ={allStopsNamesA} />
					<FontAwesomeIcon icon={faExchangeAlt} />
					<FilterDropDown defaultText='Select stop' data ={allStopsNamesB} returnStateHandler={setSelectedIndex} />
					<Button variant="primary" onClick={clickHandler}>Submit</Button>
				</div>
				<DisplayTable schedule={itineraries}/>
			</div>
		</div>
	)
}

export default StopSelect;

const getAllStops = () => {
	return fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
		method: 'POST',
		headers: { 'Content-Type' : 'application/graphql' },
		body : `{ 
			stops {
				gtfsId
				name
				lat
				lon
				zoneId
			}
		}`
	}).then(response => response.json())
}

const getItinerary = (from, to) => {
	return fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
		method: 'POST',
		headers: { 'Content-Type' : 'application/graphql' },
		body : `{
			plan(
				from: {lat: ${from.lat}, lon: ${from.lon}}
				to: {lat: ${to.lat}, lon: ${to.lon}}
				numItineraries: 3
			) {
				itineraries {
					legs {
						startTime
						endTime
						mode
						duration
						realTime
						distance
						transitLeg
						legGeometry {
							length
							points
						}
					}
				}
			}
		}`
	}).then(response => response.json())
}