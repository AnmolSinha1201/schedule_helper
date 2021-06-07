import { useEffect } from 'react'
import styles from './Map.module.css'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet'

import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


const randomMax = (max) => {
	return Math.floor(Math.random() * max);
}

const renderPositions = (positions, index) => {
	const color = '#' + randomMax(64).toString(16) + randomMax(64).toString(16) + randomMax(64).toString(16);
	console.log(color)
	return (
		<>
		<Polyline color={'#' + Math.random().toString(16).substr(-6) } positions={positions} weight={3} key={index} />
		{/* {positions.map((position, index) => (
			<CircleMarker
			key={index}
			center={position}
			fill={true}
			color="#220bb9"
			radius={3}
			>
			<Popup>
				<b>lat:</b> {position.lat} <br />
				<b>lng:</b> {position.lng} <br />
			</Popup>
			</CircleMarker>
		))} */}
		</>
	);
}

const marker = (coordinate) => {
	if (coordinate)
		return (
			<Marker position={[coordinate.lat, coordinate.lon]}>
				<Popup>
				{ coordinate.name }
				</Popup>
			</Marker>
		)
	return (<></>)
}

const MapView = ({coordinatesArray, start, end}) => {
	
	return (
		<div className={styles.MapWrapper}>
			{/* height and width style needed for leaflet to adjust to parent */}
			<MapContainer center={[60.1699, 24.9384]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} >
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{ marker(start) }
				{ marker(end) }
				{ coordinatesArray.map((coordinates, index) => renderPositions(coordinates, index)) }
			</MapContainer>
		</div>
	)
}

export default MapView