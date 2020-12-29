import React from "react";
import "./App.css";

class TargetLanguages extends React.Component {
    constructor() {
        super();
        this.state = {
        targetlanguages: {
            es: false,
            fr: false,
            de: false
        },
        };
    }
    
    handleClick = (event) => {
        const { name, checked } = event.target;
        this.setState((prevState) => {
        const targetlanguages = prevState.targetlanguages;
        targetlanguages[name] = checked;
        return targetlanguages;
        });
    };
    
    render() {
        const targetLangs = Object.keys(this.state.targetlanguages)
        .filter((key) => this.state.targetlanguages[key])
        .join(", ");
        return (
            <div>
                <div>
                <input checked={this.state.targetlanguages.es} onChange={this.handleClick} type="checkbox" name="es" /> Spanish
                </div>
                <div>
                <input checked={this.state.targetlanguages.fr} onChange={this.handleClick} type="checkbox" name="fr" /> French
                </div>
                <div>
                <input checked={this.state.targetlanguages.de} onChange={this.handleClick} type="checkbox" name="de" /> German
                </div>
            </div>
        );
    }
    }

export default TargetLanguages;
