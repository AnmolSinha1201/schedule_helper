import Table from 'react-bootstrap/Table'

const DisplayTable = ({schedule = []}) => {
	if (schedule.length == 0)
		return (<></>)

	console.log(schedule)
	return (
		<div>
			<Table striped bordered hover>
				<thead>
					<tr>
					<th>#</th>
					<th>Time</th>
					<th>Mode</th>
					<th>Distance</th>
					</tr>
				</thead>
				<tbody>
					{
						schedule.map((row, index) => (
							<tr key={`row_${index}`}>
								<td key={`desc_${index}_0`}>{index + 1}</td>
								<td key={`desc_${index}_1`}>
									{`${toStandardDate(row.startTime)} - ${toStandardDate(row.endTime)} (${toMinutes(row.duration)} minutes)`}
								</td>
								<td key={`desc_${index}_2`}>
									{row.mode}
								</td>
								<td key={`desc_${index}_3`}>
									{`${Math.round(row.distance)} m`}
								</td>
							</tr>
						))
					}
				</tbody>
			</Table>
		</div>
	)
}

export default DisplayTable

const toStandardDate = (epochTime) => {
	let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
	d.setUTCMilliseconds(epochTime);
	return `${d.getHours()}:${d.getMinutes()}`
}

const toMinutes = (seconds) => {
	return Math.round(seconds / 60);
}