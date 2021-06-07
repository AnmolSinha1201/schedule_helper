import {useEffect, useState} from 'react'
import FilterDropDown from '../FilterDropDown/FilterDropDown'
import Button from 'react-bootstrap/Button'

const StopSelect = () => {
	const [ allStopsA, setAllStopsA ] = useState(['Maria'])
	const [ allStopsB, setAllStopsB ] = useState([])
	const [ selectedIndex, setSelectedIndex ] = useState(null);
	const mariaStop = { lat: 60.16843, lon: 24.92115 };

	useEffect(() => {
		getAllStops()
		.then(result => setAllStopsB(result.data.stops.map(row => row.name)));
	}, [])

	const clickHandler = () => {
		getItenerary(mariaStop, allStopsB[selectedIndex])
		.then(result => console.log(result))
	}

	return (
		<div>
			<FilterDropDown defaultText='Select stop' selectedIndex={0} data ={allStopsA} />
			<FilterDropDown defaultText='Select stop' data ={allStopsB} returnStateHandler={setSelectedIndex} />
			<Button variant="primary" onClick={clickHandler}>Primary</Button>
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

const getItenerary = (from, to) => {
	return fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
		method: 'POST',
		headers: { 'Content-Type' : 'application/graphql' },
		body : `{
			plan(
				from: {lat: 60.168992, lon: 24.932366}
				to: {lat: 60.175294, lon: 24.684855}
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
					}
				}
			}
		}`
	}).then(response => response.json())
}