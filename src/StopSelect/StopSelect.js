import {useEffect, useState} from 'react'
import FilterDropDown from '../FilterDropDown/FilterDropDown'
import Button from 'react-bootstrap/Button'
import MapView from '../Map/Map'

const StopSelect = () => {
	const [ allStopsNamesA, setAllStopsNamesA ] = useState(['Maria'])
	const [ allStopsNamesB, setAllStopsNamesB ] = useState([])
	const [ allData, setAllData ] = useState([])
	const [ selectedIndex, setSelectedIndex ] = useState(null);
	const [ coordinates, setCoordinates ] = useState([]);
	const mariaStop = { lat: 60.16843, lon: 24.92115 };

	useEffect(() => {
		getAllStops()
		.then(result => {
			setAllStopsNamesB(result.data.stops.map(row => row.name))
			setAllData(result.data.stops)
		});
	}, [])

	const clickHandler = () => {
		console.log(`Between Maria and`, allData[selectedIndex])
		getItenerary(mariaStop, allData[selectedIndex])
		.then(result => {
			console.log(result)
			const polyUtil = require('polyline-encoded');
			const latlngs = result.data.plan.itineraries[0].legs.map(leg => polyUtil.decode(leg.legGeometry.points)).flat(1);
			console.log(latlngs);
			setCoordinates(latlngs);
		})
	}

	return (
		<div>
			<FilterDropDown defaultText='Select stop' selectedIndex={0} data ={allStopsNamesA} />
			<FilterDropDown defaultText='Select stop' data ={allStopsNamesB} returnStateHandler={setSelectedIndex} />
			<Button variant="primary" onClick={clickHandler}>Primary</Button>
			<MapView />
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