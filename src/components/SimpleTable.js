import Table from 'react-bootstrap/Table'

export default function SimpleTable (props) {
  return (
    <Table striped bordered hover size="sm" className={props.className}>
      <tbody>
        {Object.entries(props.data).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{(typeof value) === 'number' ? Math.round(value * 100) / 100 : value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}