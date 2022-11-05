import Table from 'react-bootstrap/Table'
import round from '../data/round'

export default function SimpleTable (props) {
  return (
    <Table striped bordered hover size="sm" className={props.className}>
      <tbody>
        {Object.entries(props.data).map(([key, value]) => (
          <tr key={key}>
            <td>{(props.keySubs && props.keySubs[key]) ? props.keySubs[key] : key}</td>
            <td>{(typeof value) === 'number' ? round(value) : value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}