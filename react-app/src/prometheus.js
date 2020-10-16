export const api = "http://localhost:9090/api/v1/query?";

export function extract_sensors(response) {
    return (
        response.data.result.map((metric) => {
            return (
                {
                    'name': metric['metric']['__name__'],
                    'value': metric['value'][1]
                }
            )
        })
    );
}
