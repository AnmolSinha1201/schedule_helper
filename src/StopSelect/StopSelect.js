import {useEffect, useState} from 'react'
import FilterDropDown from '../FilterDropDown/FilterDropDown'
import Button from 'react-bootstrap/Button'
import MapView from '../Map/Map'
import styles from './StopSelect.module.css'
import DisplayTable from '../Table/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

const StopSelect = () => {
	const mariaStop = { lat: 60.16843, lon: 24.92115, name: 'Maria' };
	const [ allData, setAllData ] = useState([])
	const [ selectedStop, setSelectedStop ] = useState(null);
	const [ stopA, setStopA ] = useState(mariaStop);
	const [ stopB, setStopB ] = useState(null);
	const [ itineraries, setItineraries ] = useState([]);
	

	useEffect(() => {
		getAllStops()
		.then(result => {
			setAllData(result.data.stops)
		});
	}, [])

	const clickHandler = () => {
		const A = mariaStop;
		const B = selectedStop[0];

		setStopA(A);
		setStopB(B);
		
		getItinerary(A, B)
		.then(result => setItineraries(result.data.plan.itineraries[0].legs));
	}

	const polyUtil = require('polyline-encoded');
	return (
		<div className={styles.Wrapper}>
			<MapView coordinatesArray={itineraries.map(leg => polyUtil.decode(leg.legGeometry.points))} start={stopA} end={stopB} className={styles.MapViewWrapper}/>
			<div className={styles.SelectorsWrapper}>
				<div className={styles.ControlsWrapper}>
					<FilterDropDown defaultText='Select stop' data ={[mariaStop]} />
					<FontAwesomeIcon icon={faExchangeAlt} />
					<FilterDropDown defaultText='Select stop' data ={allData} returnStateHandler={setSelectedStop} />
					<Button variant="primary" onClick={clickHandler}>Submit</Button>
				</div>
				<div className={styles.TableWrapper}>
					<DisplayTable schedule={itineraries}/>
				</div>
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