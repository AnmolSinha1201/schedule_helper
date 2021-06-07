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



const renderPositions = (positions) => {
	return (
		<>
		<Polyline color="#220bb9" positions={positions} />
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

const MapView = ({coordinates}) => {
	
	return (
		<div className={styles.MapWrapper}>
			{/* height and width style needed for leaflet to adjust to parent */}
			<MapContainer center={[60.1699, 24.9384]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={[51.505, -0.09]}>
					<Popup>
					A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
				{ renderPositions(coordinates) }
			</MapContainer>
		</div>
	)
}

export default MapView