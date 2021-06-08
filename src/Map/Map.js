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
	const color = ('#' + randomMax(64).toString(16) + randomMax(64).toString(16) + randomMax(64).toString(16)).padEnd(7, '0');
	return (
		<Polyline color={color } positions={positions} weight={4} key={index} />
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

const MapView = ({coordinatesArray, start, end, className}) => {
	const center = start != null ? [start.lat, start.lon] : [end.lat, end.lon]
	
	return (
		<div className={[styles.MapWrapper, className].join(' ')}>
			{/* height and width style needed for leaflet to adjust to parent */}
			<MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} >
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