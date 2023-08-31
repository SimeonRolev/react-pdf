import React from 'react'
import PropTypes from 'prop-types'

function PageNumberInput({ initialValue, numPages, onSubmit, ...rest }) {
    const [pageNumberInput, setPageNumberInput] = React.useState(initialValue);

    React.useEffect(() => {
        setPageNumberInput(initialValue)
    }, [initialValue])

    return (
        <input
            type='number'
            min={1}
            max={numPages}
            onChange={e => setPageNumberInput(parseInt(e.target.value))}
            onKeyUp={e => e.key === "Enter" && onSubmit(pageNumberInput)}
            onBlur={() => onSubmit(pageNumberInput)}
            value={pageNumberInput}
            {...rest}
        />
    )
}

PageNumberInput.propTypes = {
    initialValue: PropTypes.number,
    numPages: PropTypes.number,
    onSubmit: PropTypes.func,
}

export default PageNumberInput
