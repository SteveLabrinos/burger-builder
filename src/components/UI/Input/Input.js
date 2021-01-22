import React from 'react';

import classes from './Input.module.css';

const input = props => {
    const inputClasses = [classes.InputElement];
    if (props.invalid && props.shouldValidate && props.isTouched) {
        inputClasses.push(classes.Invalid);
    }

    let validationError = null;
    if (props.invalid && props.isTouched) {
        validationError = <p className={classes.ValidationError}>{props.errMsg}</p>;
    }

    let elementType;

    switch (props.elementType) {
        case ('input'):
            elementType = <input className={inputClasses.join(' ')}
                                 {...props.elementConfig}
                                 value={props.elementValue}
                                 onChange={props.changed}/>;
            break;
        case ('textarea'):
            elementType = <textarea className={inputClasses.join(' ')}
                                    {...props.elementConfig}
                                    value={props.elementValue}
                                    onChange={props.changed}/>;
            break;
        case ('select'):
            elementType = (
                <select
                    className={inputClasses.join(' ')}
                    value={props.elementValue}
                    onChange={props.changed}>
                    {props.elementConfig.options
                        .map(option => (
                            <option key={option.value} value={option.value}>
                                {option.displayValue}
                            </option>
                        ))}
                </select>
            );
            break;
        default:
            elementType = <input className={classes.InputElement}
                                 {...props.elementConfig}
                                 value={props.elementValue} />;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {elementType}
            {validationError}
        </div>
    );
}

export default input;