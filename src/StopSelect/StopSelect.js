import {useEffect, useState} from 'react'
import FilterDropDown from '../FilterDropDown/FilterDropDown'
import Button from 'react-bootstrap/Button'
import MapView from '../Map/Map'
import styles from './StopSelect.module.css'
import DisplayTable from '../Table/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

const StopSelect = () => {
	const mariaStop = [{ lat: 60.16843, lon: 24.92115, name: 'Maria' }];
	const [ allData, setAllData ] = useState([])
	const [ selectedStop, setSelectedStop ] = useState(null);
	const [ stopA, setStopA ] = useState(mariaStop[0]);
	const [ stopB, setStopB ] = useState(null);
	const [ itineraries, setItineraries ] = useState([]);
	const [ swap, setSwap ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ showAlert, setShowAlert ] = useState(false);
	

	useEffect(() => {
		getAllStops()
		.then(result => {
			setAllData(result.data.stops)
		});
	}, [])

	const clickHandler = () => {
		if (selectedStop == null)
		{
			setShowAlert(true);
			return;
		}
		setIsLoading(true);

		const A = swap ? selectedStop[0] : mariaStop[0];
		const B = swap ? mariaStop[0] : selectedStop[0];

		setStopA(A);
		setStopB(B);
		
		getItinerary(A, B)
		.then(result => {
			setItineraries(result.data.plan.itineraries[0].legs)
			setIsLoading(false);
		});
	}

	const polyUtil = require('polyline-encoded');
	return (
		<div className={styles.Wrapper}>
			<MapView coordinatesArray={itineraries.map(leg => polyUtil.decode(leg.legGeometry.points))} start={stopA} end={stopB} className={styles.MapViewWrapper}/>
			<div className={styles.SelectorsWrapper}>
				<div className={styles.ControlsWrapper}>
					<FilterDropDown defaultText='Select stop' selectedIndex={swap ? null : 0 }
						data ={swap ? allData : mariaStop} returnStateHandler={swap ? setSelectedStop : (i) => {}} 
					/>
					<div className={styles.SwapIconWrapper}>
						<FontAwesomeIcon icon={faExchangeAlt} className={styles.SwapIcon} onClick={() => {setSwap(!swap)}}/>
					</div>
					<FilterDropDown defaultText='Select stop' selectedIndex={swap ? 0 : null }
						data ={swap ? mariaStop : allData} returnStateHandler={swap ? (i) => {} : setSelectedStop} 
					/>
					<Button variant="primary" onClick={clickHandler}>Submit</Button>
				</div>
				<div className={styles.TableWrapper}>
					{
						isLoading &&
						<Spinner animation="border" role="status">
							<span className="sr-only">Loading...</span>
						</Spinner>
					}
					<DisplayTable schedule={itineraries}/>
				</div>
			</div>
			{
				showAlert &&
				<div  className={styles.Alert}>
					<Alert variant='danger' dismissible onClose={() => setShowAlert(false)}>
						Please select both the destinations in the selection boxes!
					</Alert>
				</div>
			}
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