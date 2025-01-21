export function extractQueryParams(query) {
    return query.substr(1).split('&').reduce((querysParams, param) => {
        const [key, value] = param.split('=')
        querysParams[key] = value

        return querysParams
    }, {})
}